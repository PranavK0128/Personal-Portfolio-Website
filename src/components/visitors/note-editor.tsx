"use client";

import { type PointerEvent, useEffect, useRef, useState } from "react";
import {
  DRAWING_COLORS,
  type Point,
  type Stroke,
  type VisitorNote,
  validateNote,
} from "@/lib/visitors";
import { BoardIcon } from "./board-icon";
import { Drawing } from "./drawing";

export function NoteEditor({
  onClose,
  onPosted,
}: {
  onClose: () => void;
  onPosted: (note: VisitorNote) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<SVGSVGElement>(null);
  const active = useRef<Stroke | null>(null);
  const busy = useRef(false);
  const [drawing, setDrawing] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Stroke | null>(null);
  const [redo, setRedo] = useState<Stroke[]>([]);
  const [color, setColor] = useState<string>(DRAWING_COLORS[0]);
  const [size, setSize] = useState(8);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  function point(event: PointerEvent<SVGSVGElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return [
      Math.round(
        Math.max(
          0,
          Math.min(425, ((event.clientX - rect.left) * 425) / rect.width),
        ) * 10,
      ) / 10,
      Math.round(
        Math.max(
          0,
          Math.min(425, ((event.clientY - rect.top) * 425) / rect.height),
        ) * 10,
      ) / 10,
    ];
  }

  function begin(event: PointerEvent<SVGSVGElement>) {
    if (
      pending ||
      active.current ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    if (drawing.length >= 250) {
      setError(
        "This drawing has reached the stroke limit. Undo or clear a few strokes.",
      );
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    active.current = { color, size, points: [point(event)] };
    setCurrent(active.current);
  }

  function move(event: PointerEvent<SVGSVGElement>) {
    if (
      !active.current ||
      !event.currentTarget.hasPointerCapture(event.pointerId)
    )
      return;
    const next = point(event);
    const last = active.current.points.at(-1);
    if (last && Math.hypot(next[0] - last[0], next[1] - last[1]) < 1.5) return;
    if (active.current.points.length >= 3000) return;
    active.current = {
      ...active.current,
      points: [...active.current.points, next],
    };
    setCurrent(active.current);
  }

  function finish() {
    if (!active.current) return;
    const stroke = active.current;
    active.current = null;
    setDrawing((prev) => [...prev, stroke]);
    setRedo([]);
    setCurrent(null);
    setError("");
  }

  function undoStroke() {
    const last = drawing.at(-1);
    if (!last) return;
    setDrawing(drawing.slice(0, -1));
    setRedo([...redo, last]);
  }

  function redoStroke() {
    const last = redo.at(-1);
    if (!last) return;
    setDrawing([...drawing, last]);
    setRedo(redo.slice(0, -1));
  }

  async function submit() {
    if (busy.current) return;
    setError("");
    try {
      const payload = validateNote({ name, message, drawing });
      busy.current = true;
      setPending(true);
      const response = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Your note could not be saved. Please try again.",
        );
      onPosted(result.note);
    } catch (err) {
      setError(
        err instanceof Error && err.name !== "TimeoutError"
          ? err.message
          : "The request timed out. Check the board before retrying; your note may have been saved.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      className="note-dialog"
      aria-labelledby="note-editor-title"
      onCancel={(event) => {
        if (pending) event.preventDefault();
        else onClose();
      }}
    >
      <h2 id="note-editor-title" className="sr-only">
        Leave me a note
      </h2>
      <p className="sr-only" id="drawing-help">
        Draw with a mouse, touch, or stylus. Select a color and brush size.
        Undo, redo, erase, or clear your drawing.
      </p>
      <fieldset disabled={pending} className="note-fields">
        <legend className="sr-only">Drawing and message</legend>
        <div className="drawing-toolbar">
          <div className="drawing-colors">
            {DRAWING_COLORS.map((value, index) => (
              <button
                type="button"
                className="drawing-tool color-tool"
                key={value}
                aria-label={`${["Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Purple"][index]} pen`}
                aria-pressed={color === value}
                onClick={() => setColor(value)}
              >
                <span style={{ background: value }} />
              </button>
            ))}
          </div>
          <div className="drawing-actions">
            <button
              type="button"
              className="drawing-tool"
              aria-label="Undo"
              title="Undo"
              disabled={!drawing.length || pending}
              onClick={undoStroke}
            >
              <BoardIcon name="undo" />
            </button>
            <button
              type="button"
              className="drawing-tool"
              aria-label="Redo"
              title="Redo"
              disabled={!redo.length || pending}
              onClick={redoStroke}
            >
              <BoardIcon name="redo" />
            </button>
            <button
              type="button"
              className="drawing-tool"
              aria-label="Eraser"
              title="Eraser"
              aria-pressed={color === "eraser"}
              onClick={() => setColor("eraser")}
            >
              <BoardIcon name="eraser" />
            </button>
            <button
              type="button"
              className="drawing-tool"
              aria-label="Clear drawing"
              title="Clear drawing"
              disabled={!drawing.length || pending}
              onClick={() => {
                setDrawing([]);
                setRedo([]);
              }}
            >
              <BoardIcon name="trash" />
            </button>
            <button
              type="button"
              className="drawing-tool"
              aria-label="Brush size"
              title="Brush size"
              aria-expanded={sizeOpen}
              onClick={() => setSizeOpen(!sizeOpen)}
            >
              <BoardIcon name="size" />
            </button>
          </div>
        </div>
        {sizeOpen && (
          <label className="brush-size">
            Brush size{" "}
            <input
              type="range"
              min="2"
              max="44"
              step="2"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
            <output>{size}</output>
          </label>
        )}
        <svg
          ref={canvas}
          className="drawing-canvas"
          viewBox="0 0 425 425"
          role="img"
          aria-label="Drawing canvas"
          aria-describedby="drawing-help"
          onPointerDown={begin}
          onPointerMove={move}
          onPointerUp={finish}
          onPointerCancel={finish}
          onLostPointerCapture={finish}
        >
          <title>Your drawing</title>
          <Drawing strokes={current ? [...drawing, current] : drawing} />
        </svg>
        <input
          aria-label="Name"
          placeholder="Name"
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="nickname"
        />
        <input
          aria-label="Message"
          placeholder="Type your message here..."
          maxLength={45}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </fieldset>
      {error && (
        <p className="board-error" role="alert">
          {error}
        </p>
      )}
      <div className="editor-footer">
        <span
          className="character-counter"
          title={`${45 - message.length} characters remaining`}
        >
          {45 - message.length}
        </span>
        <div>
          <button
            type="button"
            className="board-button"
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="board-button board-primary"
            disabled={
              pending || !drawing.length || !name.trim() || !message.trim()
            }
            onClick={submit}
          >
            {pending ? "Posting…" : "Submit"}
          </button>
        </div>
      </div>
      <p className="visitor-privacy-note">
        One note per browser. A necessary cookie helps prevent repeat posts.
      </p>
    </dialog>
  );
}
