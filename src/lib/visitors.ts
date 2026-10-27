export const DRAWING_COLORS = [
  "#000000",
  "#FFFFFF",
  "#EF4444",
  "#3B82F6",
  "#22C55E",
  "#EAB308",
  "#FB923C",
  "#A855F7",
] as const;

export type Point = [number, number];
export type Stroke = { color: string; size: number; points: Point[] };
export type VisitorNote = {
  id: string;
  name: string;
  message: string;
  drawing: Stroke[];
  createdAt: string;
};
export type BoardState = { notes: VisitorNote[]; canPost: boolean };

export type NotePosition = { x: number; y: number; rotate: number; z: number };
export type BoardPeer = {
  id: string;
  color: string;
  cursor: { x: number; y: number } | null;
  selection: string | null;
};
export type LiveBoard = {
  peers: BoardPeer[];
  positions: Record<string, NotePosition>;
};
export type LiveAction =
  | { type: "cursor"; cursor: { x: number; y: number } | null }
  | { type: "select"; noteId: string }
  | { type: "move"; noteId: string; x: number; y: number }
  | { type: "release" }
  | { type: "heartbeat" }
  | { type: "leave" };

export function validateLiveAction(value: unknown): LiveAction {
  if (!value || typeof value !== "object")
    throw new Error("Invalid board update.");
  const data = value as Record<string, unknown>;
  const coordinate = (n: unknown) =>
    typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1;
  if (["release", "heartbeat", "leave"].includes(String(data.type)))
    return { type: data.type as "release" | "heartbeat" | "leave" };
  if (data.type === "cursor") {
    if (data.cursor === null) return { type: "cursor", cursor: null };
    const cursor = data.cursor as { x?: unknown; y?: unknown } | undefined;
    if (cursor && coordinate(cursor.x) && coordinate(cursor.y))
      return {
        type: "cursor",
        cursor: { x: cursor.x as number, y: cursor.y as number },
      };
  }
  if (typeof data.noteId === "string" && /^[a-f0-9-]{36}$/.test(data.noteId)) {
    if (data.type === "select") return { type: "select", noteId: data.noteId };
    if (data.type === "move" && coordinate(data.x) && coordinate(data.y))
      return {
        type: "move",
        noteId: data.noteId,
        x: data.x as number,
        y: data.y as number,
      };
  }
  throw new Error("Invalid board update.");
}

export function validateNote(value: unknown): {
  name: string;
  message: string;
  drawing: Stroke[];
} {
  if (!value || typeof value !== "object") throw new Error("Invalid note.");
  const { name, message, drawing } = value as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim() || name.trim().length > 40)
    throw new Error("Enter a name of up to 40 characters.");
  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.trim().length > 45
  )
    throw new Error("Enter a message of up to 45 characters.");
  if (!Array.isArray(drawing) || !drawing.length || drawing.length > 250)
    throw new Error("Add a drawing (up to 250 strokes).");
  let count = 0;
  let hasInk = false;
  const strokes = drawing.map((stroke: unknown): Stroke => {
    if (!stroke || typeof stroke !== "object")
      throw new Error("Invalid drawing.");
    const { color, size, points } = stroke as Record<string, unknown>;
    if (
      typeof color !== "string" ||
      !(color === "eraser" || DRAWING_COLORS.some((c) => c === color))
    )
      throw new Error("Invalid drawing color.");
    if (
      typeof size !== "number" ||
      !Number.isFinite(size) ||
      size < 2 ||
      size > 44
    )
      throw new Error("Invalid brush size.");
    if (!Array.isArray(points) || !points.length)
      throw new Error(
        "This drawing is too detailed. Please use fewer strokes.",
      );
    count += points.length;
    if (count > 12000)
      throw new Error(
        "This drawing is too detailed. Please use fewer strokes.",
      );
    const validPoints = points.map((point: unknown): Point => {
      if (
        !Array.isArray(point) ||
        point.length !== 2 ||
        !point.every(
          (n) =>
            typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 425,
        )
      )
        throw new Error("Invalid drawing coordinates.");
      return [point[0], point[1]];
    });
    if (color !== "eraser") hasInk = true;
    return { color, size, points: validPoints };
  });
  if (!hasInk) throw new Error("Add a drawing before posting.");
  return { name: name.trim(), message: message.trim(), drawing: strokes };
}
