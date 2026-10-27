"use client";

import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { BoardState, NotePosition, VisitorNote } from "@/lib/visitors";
import { BoardIcon } from "./board-icon";
import { Drawing } from "./drawing";
import { NoteEditor } from "./note-editor";
import { useLiveBoard } from "./use-live-board";

function initialPosition(index: number): NotePosition {
  return {
    x: ((index * 31) % 85) / 100,
    y: ((index * 17) % 80) / 100,
    rotate: ((index * 37) % 51) - 25,
    z: index + 1,
  };
}
function shuffledIds(notes: VisitorNote[]) {
  const ids = notes.map((note) => note.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids.slice(0, 12);
}

export function VisitorsBoard() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [error, setError] = useState("");
  const [editor, setEditor] = useState(false);
  const [grid, setGrid] = useState(false);
  const [sample, setSample] = useState<string[]>([]);
  const [positions, setPositions] = useState<Record<string, NotePosition>>({});
  const [limit, setLimit] = useState(12);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const drag = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    position: NotePosition;
    latest: NotePosition;
    accepted: boolean;
    lastSent: number;
  } | null>(null);
  const lastCursor = useRef(0);
  const keyboardMoving = useRef(false);
  const knownNotes = useRef<Set<string> | null>(null);
  const receiveNotes = useCallback((next: BoardState) => {
    const known = knownNotes.current;
    const newIds = next.notes
      .filter((note) => !known?.has(note.id))
      .map((note) => note.id);
    if (!known) setSample(shuffledIds(next.notes));
    else if (newIds.length)
      setSample((previous) => [...newIds, ...previous].slice(0, 12));
    knownNotes.current = new Set(next.notes.map((note) => note.id));
    setBoard(next);
    setError("");
  }, []);
  const live = useLiveBoard(receiveNotes, setNotice);
  useEffect(() => {
    const timer = setInterval(() => {
      const current = drag.current;
      if (current?.accepted)
        void live.send({
          type: "move",
          noteId: current.id,
          x: current.latest.x,
          y: current.latest.y,
        });
    }, 2000);
    return () => clearInterval(timer);
  }, [live.send]);

  const refresh = useCallback(async (signal?: AbortSignal, shuffle = false) => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/visitors", {
        cache: "no-store",
        signal,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "The board could not be loaded.");
      setBoard(result);
      if (shuffle) setSample(shuffledIds(result.notes));
      setError("");
    } catch (err) {
      if (signal?.aborted) return;
      setError(
        err instanceof Error
          ? err.message
          : "The board could not be loaded. Try again.",
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!live.connected) {
      drag.current = null;
      setPositions({});
    }
  }, [live.connected]);
  useEffect(() => {
    setPositions((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([id, position]) => {
          const shared = live.positions[id];
          return (
            id === drag.current?.id ||
            (shared && (shared.x !== position.x || shared.y !== position.y))
          );
        }),
      ),
    );
  }, [live.positions]);

  function close() {
    setEditor(false);
    addButton.current?.focus();
  }
  function posted(note: VisitorNote) {
    setBoard((prev) => ({
      notes: [note, ...(prev?.notes || [])].filter(
        (item, i, arr) => arr.findIndex((n) => n.id === item.id) === i,
      ),
      canPost: false,
    }));
    setNotice("Thanks for posting! Your note is on the board.");
    close();
  }
  function beginDrag(
    event: PointerEvent<HTMLButtonElement>,
    note: VisitorNote,
    index: number,
  ) {
    if (
      drag.current ||
      grid ||
      !live.connected ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    if (
      live.peers.some(
        (peer) => peer.id !== live.clientId && peer.selection === note.id,
      )
    ) {
      setNotice("Someone else is moving this note. Try again in a moment.");
      return;
    }
    const position =
      positions[note.id] || live.positions[note.id] || initialPosition(index);
    const current = {
      id: note.id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position,
      latest: position,
      accepted: false,
      lastSent: 0,
    };
    drag.current = current;
    event.currentTarget.setPointerCapture(event.pointerId);
    void live.send({ type: "select", noteId: note.id }).then((ok) => {
      current.accepted = ok;
      if (!ok && drag.current === current) {
        drag.current = null;
        setPositions({});
      }
      if (ok && drag.current === current)
        void live.send({
          type: "move",
          noteId: note.id,
          x: current.latest.x,
          y: current.latest.y,
        });
    });
  }
  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId || !panel.current)
      return;
    const width = Math.max(
      1,
      panel.current.clientWidth - event.currentTarget.offsetWidth - 48,
    );
    const height = Math.max(1, panel.current.clientHeight - 310);
    const x = Math.min(
      1,
      Math.max(
        0,
        current.position.x + (event.clientX - current.startX) / width,
      ),
    );
    const y = Math.min(
      1,
      Math.max(
        0,
        current.position.y + (event.clientY - current.startY) / height,
      ),
    );
    current.latest = { ...current.position, x, y, z: 999999 };
    setPositions((prev) => ({ ...prev, [current.id]: current.latest }));
    if (current.accepted && Date.now() - current.lastSent > 80) {
      current.lastSent = Date.now();
      void live.send({ type: "move", noteId: current.id, x, y });
    }
  }
  function endDrag() {
    const current = drag.current;
    if (!current) return;
    drag.current = null;
    // The ordered queue guarantees that even a very quick tap selects before releasing.
    void live
      .send({
        type: "move",
        noteId: current.id,
        x: current.latest.x,
        y: current.latest.y,
      })
      .then((ok) => {
        if (!ok) setPositions({});
      });
    void live.send({ type: "release" });
  }
  async function keyMove(id: string, position: NotePosition, key: string) {
    if (drag.current || keyboardMoving.current) return;
    keyboardMoving.current = true;
    try {
      if (!live.connected || !(await live.send({ type: "select", noteId: id })))
        return;
      const next = {
        ...position,
        x: Math.max(
          0,
          Math.min(
            1,
            position.x +
              (key === "ArrowLeft" ? -0.04 : key === "ArrowRight" ? 0.04 : 0),
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            1,
            position.y +
              (key === "ArrowUp" ? -0.04 : key === "ArrowDown" ? 0.04 : 0),
          ),
        ),
      };
      setPositions((previous) => ({ ...previous, [id]: next }));
      if (
        !(await live.send({ type: "move", noteId: id, x: next.x, y: next.y }))
      )
        setPositions({});
      await live.send({ type: "release" });
    } finally {
      keyboardMoving.current = false;
    }
  }
  const notes = board?.notes || [];
  const sampled = sample
    .map((id) => notes.find((note) => note.id === id))
    .filter((note): note is VisitorNote => !!note);
  const visibleNotes = grid
    ? notes.slice(0, limit)
    : [...sampled, ...notes.filter((note) => !sample.includes(note.id))].slice(
        0,
        12,
      );
  return (
    <section className="visitor-board" aria-label="Visitors drawing board">
      <div className="board-toolbar">
        <div className="board-toolbar-start">
          <button
            type="button"
            className="board-button board-icon-button"
            aria-label={
              grid ? "Switch to scattered board" : "Switch to grid view"
            }
            onClick={() => {
              endDrag();
              void live.send({ type: "cursor", cursor: null });
              setGrid(!grid);
            }}
          >
            <BoardIcon name={grid ? "grid" : "move"} />
          </button>
          <span
            role="img"
            className="board-note-count"
            data-connected={live.connected}
            title={
              live.connected
                ? `${live.peers.length} visitors online`
                : "Reconnecting to the live board"
            }
            aria-label={
              live.connected
                ? `${live.peers.length} visitors online`
                : "Reconnecting to the live board"
            }
          >
            {live.connected ? live.peers.length : "—"}
            <span />
          </span>
        </div>
        {board && !board.canPost ? (
          <span className="board-thanks">Thanks for posting! ♡</span>
        ) : (
          <button
            ref={addButton}
            type="button"
            className="board-button board-primary"
            disabled={!board}
            onClick={() => {
              void live.send({ type: "cursor", cursor: null });
              setEditor(true);
            }}
          >
            <BoardIcon name="plus" />
            Leave a note
          </button>
        )}
      </div>
      <p className="board-notice" role="status" hidden={!notice}>
        {notice}
      </p>
      <div
        ref={panel}
        className="board-surface"
        onPointerMove={(event) => {
          if (editor || Date.now() - lastCursor.current < 80) return;
          lastCursor.current = Date.now();
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          ) {
            void live.send({ type: "cursor", cursor: null });
            return;
          }
          void live.send({
            type: "cursor",
            cursor: {
              x: Math.max(
                0,
                Math.min(1, (event.clientX - rect.left) / rect.width),
              ),
              y: Math.max(
                0,
                Math.min(1, (event.clientY - rect.top) / rect.height),
              ),
            },
          });
        }}
        onPointerLeave={() => {
          void live.send({ type: "cursor", cursor: null });
        }}
        onPointerUp={(event) => {
          if (event.pointerType === "touch")
            void live.send({ type: "cursor", cursor: null });
        }}
      >
        <button
          type="button"
          className="board-shuffle"
          aria-label={grid ? "Refresh notes" : "Shuffle notes"}
          title={grid ? "Refresh notes" : "Shuffle notes"}
          disabled={refreshing || !board || (!grid && !notes.length)}
          onClick={() => {
            if (grid) {
              void refresh();
              return;
            }
            void refresh(undefined, true);
          }}
        >
          <BoardIcon name="shuffle" />
        </button>
        <section
          key={grid ? "grid" : "scattered"}
          className={`board-layout ${grid ? "board-grid" : "board-scattered"}`}
          data-has-more={grid && notes.length > limit}
          aria-label="Visitor notes"
          tabIndex={grid ? 0 : undefined}
        >
          {error ? (
            <div className="board-empty">
              <p role="alert">{error}</p>
              <button
                type="button"
                className="board-button"
                onClick={() => void refresh()}
              >
                Try again
              </button>
            </div>
          ) : !board ? (
            <p className="board-empty" role="status">
              Loading the board…
            </p>
          ) : !notes.length ? (
            <div className="board-empty">
              <p>A little space for everyone who stops by.</p>
              <p>Be the first to leave a drawing and a note.</p>
            </div>
          ) : null}
          {visibleNotes.map((note, index) => {
            const position =
              positions[note.id] ||
              live.positions[note.id] ||
              initialPosition(index);
            const holder = live.peers.find(
              (peer) => peer.selection === note.id,
            );
            return (
              <button
                type="button"
                key={note.id}
                className="visitor-polaroid"
                data-selected={!!holder}
                data-note-id={note.id}
                style={
                  {
                    "--note-x": position.x,
                    "--note-y": position.y,
                    "--selection-color": holder?.color,
                    "--note-angle": `${grid ? 0 : position.rotate}deg`,
                    zIndex: grid
                      ? undefined
                      : visibleNotes.filter(
                          (item) =>
                            (live.positions[item.id]?.z || 0) <= position.z,
                        ).length + (drag.current?.id === note.id ? 20 : 0),
                  } as CSSProperties
                }
                aria-label={`${note.name}: ${note.message}${grid ? "" : ". Drag to move; arrow keys also move this note."}`}
                onPointerDown={(e) => beginDrag(e, note, index)}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onLostPointerCapture={endDrag}
                onKeyDown={(event) => {
                  if (
                    grid ||
                    ![
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ].includes(event.key)
                  )
                    return;
                  event.preventDefault();
                  void keyMove(note.id, position, event.key);
                }}
              >
                <svg
                  className="note-art"
                  viewBox="0 0 425 425"
                  role="img"
                  aria-label={`Drawing by ${note.name}`}
                >
                  <title>Drawing by {note.name}</title>
                  <Drawing strokes={note.drawing} />
                </svg>
                <span className="note-name">{note.name}</span>
                <span className="note-message">{note.message}</span>
              </button>
            );
          })}
        </section>
        {grid && notes.length > limit && (
          <button
            type="button"
            className="board-button board-more"
            onClick={() => setLimit((previous) => previous + 12)}
          >
            See more
          </button>
        )}
        <div className="board-cursors" aria-hidden="true">
          {live.peers
            .filter((peer) => peer.id !== live.clientId && peer.cursor)
            .map((peer) => (
              <span
                key={peer.id}
                className="board-cursor"
                style={{
                  left: `${(peer.cursor?.x || 0) * 100}%`,
                  top: `${(peer.cursor?.y || 0) * 100}%`,
                  color: peer.color,
                }}
              >
                <svg
                  width="20"
                  height="25"
                  viewBox="0 0 20 25"
                  fill="currentColor"
                >
                  <title>Visitor cursor</title>
                  <path
                    d="M2 2v18l5-5 4 8 4-2-4-8h7Z"
                    stroke="var(--background)"
                    strokeWidth="1.5"
                  />
                </svg>
                <span>Visitor {peer.id.slice(0, 4)}</span>
              </span>
            ))}
        </div>
      </div>
      {editor && <NoteEditor onClose={close} onPosted={posted} />}
    </section>
  );
}
