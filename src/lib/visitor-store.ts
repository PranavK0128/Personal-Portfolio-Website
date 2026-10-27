import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type {
  LiveAction,
  LiveBoard,
  NotePosition,
  Stroke,
  VisitorNote,
} from "./visitors";

export class BoardError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class VisitorStore {
  db: DatabaseSync;
  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`
      PRAGMA journal_mode=WAL;
      PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY, created_at INTEGER NOT NULL, posted INTEGER NOT NULL DEFAULT 0, blocked INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, visitor_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, message TEXT NOT NULL, drawing TEXT NOT NULL, created_at INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, window_start INTEGER NOT NULL, count INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS notes_created ON notes(created_at DESC);
      CREATE TABLE IF NOT EXISTS note_positions (note_id TEXT PRIMARY KEY, x REAL NOT NULL, y REAL NOT NULL, rotate REAL NOT NULL, z INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS board_clients (id TEXT PRIMARY KEY, owner TEXT NOT NULL, color TEXT NOT NULL, cursor_x REAL, cursor_y REAL, selection TEXT, selected_at INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS board_clients_owner ON board_clients(owner);
      INSERT OR IGNORE INTO settings(key,value) VALUES('notes_version','0');
      CREATE TRIGGER IF NOT EXISTS notes_insert_version AFTER INSERT ON notes BEGIN UPDATE settings SET value=CAST(value AS INTEGER)+1 WHERE key='notes_version'; END;
      CREATE TRIGGER IF NOT EXISTS notes_update_version AFTER UPDATE ON notes BEGIN UPDATE settings SET value=CAST(value AS INTEGER)+1 WHERE key='notes_version'; END;
      CREATE TRIGGER IF NOT EXISTS notes_delete_version AFTER DELETE ON notes BEGIN UPDATE settings SET value=CAST(value AS INTEGER)+1 WHERE key='notes_version'; DELETE FROM note_positions WHERE note_id=OLD.id; END;
    `);
    this.db
      .prepare(
        "INSERT OR IGNORE INTO settings(key,value) VALUES('network_salt',?)",
      )
      .run(randomBytes(32).toString("hex"));
  }
  tokenHash(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }
  networkHash(ip: string) {
    const row = this.db
      .prepare("SELECT value FROM settings WHERE key='network_salt'")
      .get() as { value: string };
    return createHmac("sha256", row.value).update(ip).digest("hex");
  }
  visitor(token: string | undefined) {
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    const row = this.db
      .prepare("SELECT id,posted,blocked,created_at FROM visitors WHERE id=?")
      .get(this.tokenHash(token)) as
      | { id: string; posted: number; blocked: number; created_at: number }
      | undefined;
    return row && Date.now() - row.created_at < 365 * 86400000 ? row : null;
  }
  issue(network: string) {
    // Bound anonymous cookie creation, including attempts to clear cookies repeatedly.
    this.throttle(`sessions:${network}`, 30, 86400000);
    const token = randomBytes(32).toString("base64url");
    this.db
      .prepare("INSERT INTO visitors(id,created_at) VALUES(?,?)")
      .run(this.tokenHash(token), Date.now());
    return token;
  }
  throttle(key: string, max: number, window: number, now = Date.now()) {
    const row = this.db
      .prepare(`INSERT INTO rate_limits(key,window_start,count) VALUES(?,?,1)
      ON CONFLICT(key) DO UPDATE SET
        count=CASE WHEN rate_limits.window_start<=? THEN 1 ELSE rate_limits.count+1 END,
        window_start=CASE WHEN rate_limits.window_start<=? THEN excluded.window_start ELSE rate_limits.window_start END
      RETURNING count`)
      .get(key, now, now - window, now - window) as { count: number };
    if (row.count > max)
      throw new BoardError(
        "Too many requests from this network. Please try again later.",
        429,
      );
  }
  list(): VisitorNote[] {
    const rows = this.db
      .prepare(
        "SELECT id,name,message,drawing,created_at FROM notes WHERE hidden=0 ORDER BY created_at DESC",
      )
      .all() as {
      id: string;
      name: string;
      message: string;
      drawing: string;
      created_at: number;
    }[];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      message: row.message,
      drawing: JSON.parse(row.drawing),
      createdAt: new Date(row.created_at).toISOString(),
    }));
  }
  post(
    token: string,
    network: string,
    data: { name: string; message: string; drawing: Stroke[] },
  ): VisitorNote {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const visitor = this.visitor(token);
      if (!visitor)
        throw new BoardError("Please refresh the board before posting.", 403);
      if (visitor.blocked)
        throw new BoardError("Posting is unavailable for this browser.", 403);
      if (visitor.posted)
        throw new BoardError(
          "You've already left a note. Thanks for stopping by!",
          409,
        );
      this.throttle(`posts:${network}`, 5, 86400000);
      const note = {
        ...data,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };
      this.db
        .prepare(
          "INSERT INTO notes(id,visitor_id,name,message,drawing,created_at) VALUES(?,?,?,?,?,?)",
        )
        .run(
          note.id,
          visitor.id,
          note.name,
          note.message,
          JSON.stringify(note.drawing),
          Date.parse(note.createdAt),
        );
      this.db
        .prepare("UPDATE visitors SET posted=1 WHERE id=?")
        .run(visitor.id);
      this.db.exec("COMMIT");
      return note;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  moderate(id: string, action: "hide" | "restore" | "block") {
    const row = this.db
      .prepare("SELECT visitor_id FROM notes WHERE id=?")
      .get(id) as { visitor_id: string } | undefined;
    if (!row) throw new Error("Note not found.");
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare("UPDATE notes SET hidden=? WHERE id=?")
        .run(action === "restore" ? 0 : 1, id);
      if (action === "block")
        this.db
          .prepare("UPDATE visitors SET blocked=1 WHERE id=?")
          .run(row.visitor_id);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  // Positions are durable. Presence and drag ownership expire after a lost connection.
  pruneClients(now = Date.now()) {
    this.db
      .prepare(
        "DELETE FROM board_clients WHERE updated_at<=? OR owner IN (SELECT id FROM visitors WHERE blocked=1)",
      )
      .run(now - 15000);
    this.db
      .prepare(
        "UPDATE board_clients SET selection=NULL WHERE selection IS NOT NULL AND (selected_at<=? OR selection NOT IN (SELECT id FROM notes WHERE hidden=0))",
      )
      .run(now - 8000);
  }
  join(token: string, now = Date.now()) {
    const visitor = this.visitor(token);
    if (!visitor || visitor.blocked)
      throw new BoardError("Live access is unavailable for this browser.", 403);
    this.throttle(`connections:${visitor.id}`, 30, 60000, now);
    this.pruneClients(now);
    const count = this.db
      .prepare(
        "SELECT COUNT(*) AS total, SUM(owner=?) AS owned FROM board_clients",
      )
      .get(visitor.id) as { total: number; owned: number };
    if (count.total >= 100 || count.owned >= 6)
      throw new BoardError(
        "Too many live board connections. Close another board tab and retry.",
        429,
      );
    const id = randomUUID();
    const colors = [
      "#e66b7a",
      "#5e9dff",
      "#43b991",
      "#c18aff",
      "#db963e",
      "#dd75be",
    ];
    const color = colors[Number.parseInt(id.slice(0, 8), 16) % colors.length];
    this.db
      .prepare(
        "INSERT INTO board_clients(id,owner,color,updated_at) VALUES(?,?,?,?)",
      )
      .run(id, visitor.id, color, now);
    return id;
  }
  leave(client: string) {
    this.db.prepare("DELETE FROM board_clients WHERE id=?").run(client);
  }
  hasClient(client: string) {
    return !!this.db
      .prepare("SELECT 1 FROM board_clients WHERE id=?")
      .get(client);
  }
  liveUpdate(
    token: string,
    client: string,
    action: LiveAction,
    now = Date.now(),
  ) {
    const visitor = this.visitor(token);
    if (!visitor || visitor.blocked)
      throw new BoardError("Live access is unavailable for this browser.", 403);
    this.throttle(`live:${visitor.id}`, 1800, 60000, now);
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.pruneClients(now);
      const session = this.db
        .prepare("SELECT selection FROM board_clients WHERE id=? AND owner=?")
        .get(client, visitor.id) as { selection: string | null } | undefined;
      if (!session)
        throw new BoardError(
          "Reconnecting to the board. Please try again.",
          410,
        );
      this.db
        .prepare("UPDATE board_clients SET updated_at=? WHERE id=?")
        .run(now, client);
      if (action.type === "leave") this.leave(client);
      if (action.type === "cursor")
        this.db
          .prepare("UPDATE board_clients SET cursor_x=?,cursor_y=? WHERE id=?")
          .run(action.cursor?.x ?? null, action.cursor?.y ?? null, client);
      if (action.type === "release")
        this.db
          .prepare("UPDATE board_clients SET selection=NULL WHERE id=?")
          .run(client);
      if (action.type === "select" || action.type === "move") {
        if (
          !this.db
            .prepare("SELECT 1 FROM notes WHERE id=? AND hidden=0")
            .get(action.noteId)
        )
          throw new BoardError("This note is no longer on the board.", 404);
        if (action.type === "select") {
          if (
            this.db
              .prepare(
                "SELECT 1 FROM board_clients WHERE selection=? AND id<>?",
              )
              .get(action.noteId, client)
          )
            throw new BoardError(
              "Someone else is moving this note. Try again in a moment.",
              409,
            );
          this.ensurePositions();
          this.db
            .prepare(
              "UPDATE board_clients SET selection=?,selected_at=? WHERE id=?",
            )
            .run(action.noteId, now, client);
          this.db
            .prepare(
              "UPDATE note_positions SET z=(SELECT COALESCE(MAX(z),0)+1 FROM note_positions) WHERE note_id=?",
            )
            .run(action.noteId);
        } else {
          if (session.selection !== action.noteId)
            throw new BoardError(
              "Select the note again before moving it.",
              409,
            );
          this.db
            .prepare("UPDATE note_positions SET x=?,y=? WHERE note_id=?")
            .run(action.x, action.y, action.noteId);
          this.db
            .prepare("UPDATE board_clients SET selected_at=? WHERE id=?")
            .run(now, client);
        }
      }
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  ensurePositions() {
    this.db.exec(`INSERT OR IGNORE INTO note_positions(note_id,x,y,rotate,z)
      SELECT id, (rowid*31%85)/100.0, (rowid*17%80)/100.0, (rowid*37%51)-25, rowid FROM notes WHERE hidden=0`);
  }
  liveSnapshot(now = Date.now()): LiveBoard {
    this.pruneClients(now);
    this.ensurePositions();
    const rows = this.db
      .prepare(
        "SELECT p.note_id,p.x,p.y,p.rotate,p.z FROM note_positions p JOIN notes n ON n.id=p.note_id WHERE n.hidden=0 ORDER BY n.created_at DESC",
      )
      .all() as (NotePosition & { note_id: string })[];
    const peers = this.db
      .prepare(
        "SELECT id,color,cursor_x,cursor_y,selection FROM board_clients ORDER BY id",
      )
      .all() as {
      id: string;
      color: string;
      cursor_x: number | null;
      cursor_y: number | null;
      selection: string | null;
    }[];
    return {
      positions: Object.fromEntries(
        rows.map(({ note_id, ...position }) => [note_id, position]),
      ),
      peers: peers.map(({ id, color, cursor_x, cursor_y, selection }) => ({
        id,
        color,
        selection,
        cursor:
          cursor_x === null || cursor_y === null
            ? null
            : { x: cursor_x, y: cursor_y },
      })),
    };
  }
  notesVersion() {
    return (
      this.db
        .prepare("SELECT value FROM settings WHERE key='notes_version'")
        .get() as { value: string }
    ).value;
  }
  close() {
    this.db.close();
  }
}

let instance: VisitorStore | undefined;
export function getVisitorStore() {
  if (
    process.env.VERCEL ||
    (process.env.NODE_ENV === "production" && !process.env.VISITORS_DB_PATH)
  )
    throw new BoardError(
      "The visitors board is not connected to persistent storage yet.",
      503,
    );
  instance ??= new VisitorStore(
    // Runtime state is deliberately outside the source/deployment bundle.
    resolve(
      /* turbopackIgnore: true */ process.env.VISITORS_DB_PATH ||
        ".local-data/visitors.sqlite",
    ),
  );
  return instance;
}
