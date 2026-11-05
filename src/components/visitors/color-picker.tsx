"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  type HsvColor,
  hexToHsv,
  hsvToHex,
  normalizeHexColor,
} from "@/lib/drawing-colors";

export function ColorPicker({
  color,
  disabled,
  onChange,
  onClose,
}: {
  color: string;
  disabled: boolean;
  onChange: (color: string) => void;
  onClose: () => void;
}) {
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [hex, setHex] = useState(color);
  const [invalid, setInvalid] = useState(false);
  const wheel = useRef<HTMLDivElement>(null);
  const hexInput = useRef<HTMLInputElement>(null);
  const helpId = useId();
  const errorId = useId();

  useEffect(() => {
    wheel.current?.focus({ preventScroll: true });
  }, []);

  function select(next: HsvColor) {
    if (disabled) return;
    const selected = hsvToHex(next);
    setHsv(next);
    setHex(selected);
    setInvalid(false);
    onChange(selected);
  }

  function selectPoint(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x =
      (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2);
    const y =
      (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2);
    select({
      ...hsv,
      hue: (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360,
      saturation: Math.min(1, Math.hypot(x, y)),
    });
  }

  function onWheelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const increment = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      select({
        ...hsv,
        hue:
          (hsv.hue +
            (event.key === "ArrowRight" ? increment : -increment) +
            360) %
          360,
      });
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      select({
        ...hsv,
        saturation: Math.max(
          0,
          Math.min(
            1,
            hsv.saturation +
              (event.key === "ArrowUp" ? increment : -increment) / 100,
          ),
        ),
      });
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select({ ...hsv, hue: event.key === "Home" ? 0 : 359 });
    }
  }

  function commitHex() {
    const selected = normalizeHexColor(hex);
    setInvalid(!selected);
    if (selected) {
      setHex(selected);
      setHsv(hexToHsv(selected));
      onChange(selected);
    }
    return Boolean(selected);
  }

  const angle = (hsv.hue * Math.PI) / 180;
  return (
    <fieldset className="custom-color-panel" aria-label="Custom pen color">
      <div
        ref={wheel}
        className="color-wheel"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Color wheel"
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={Math.floor(hsv.hue)}
        aria-valuetext={`Hue ${Math.round(hsv.hue)} degrees, saturation ${Math.round(hsv.saturation * 100)} percent`}
        aria-describedby={helpId}
        aria-disabled={disabled}
        onKeyDown={onWheelKeyDown}
        onPointerDown={(event) => {
          if (disabled || (event.pointerType === "mouse" && event.button !== 0))
            return;
          event.currentTarget.setPointerCapture(event.pointerId);
          selectPoint(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            selectPoint(event);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      >
        <span
          className="color-wheel-shade"
          style={{ opacity: 1 - hsv.value }}
        />
        <span
          className="color-wheel-marker"
          style={{
            left: `${50 + Math.cos(angle) * hsv.saturation * 50}%`,
            top: `${50 + Math.sin(angle) * hsv.saturation * 50}%`,
            background: color,
          }}
        />
      </div>
      <p id={helpId} className="sr-only">
        Left and right arrows change hue. Up and down change saturation. Hold
        Shift for larger steps.
      </p>
      <div className="custom-color-controls">
        <label className="custom-hex-label">
          Hex color
          <span className="custom-hex-field">
            <span
              className="custom-color-preview"
              style={{ background: color }}
              aria-hidden="true"
            />
            <input
              ref={hexInput}
              value={hex}
              maxLength={7}
              spellCheck={false}
              autoComplete="off"
              aria-invalid={invalid}
              aria-describedby={invalid ? errorId : undefined}
              onChange={(event) => {
                const draft = event.target.value;
                setHex(draft);
                setInvalid(false);
                const selected = normalizeHexColor(draft);
                if (selected) {
                  setHsv(hexToHsv(selected));
                  onChange(selected);
                }
              }}
              onBlur={commitHex}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (commitHex()) onClose();
                }
              }}
            />
          </span>
        </label>
        {invalid && (
          <p id={errorId} className="custom-color-error" role="alert">
            Use 3 or 6 hex digits, such as #14B8A6.
          </p>
        )}
        <label className="custom-brightness">
          <span>
            Brightness <output>{Math.round(hsv.value * 100)}%</output>
          </span>
          <input
            type="range"
            aria-label="Brightness"
            min="0"
            max="100"
            value={Math.round(hsv.value * 100)}
            style={
              {
                "--bright-color": hsvToHex({ ...hsv, value: 1 }),
              } as CSSProperties
            }
            onChange={(event) =>
              select({ ...hsv, value: Number(event.target.value) / 100 })
            }
          />
        </label>
        <button
          type="button"
          className="board-button custom-color-done"
          onClick={() => {
            if (commitHex()) onClose();
            else hexInput.current?.focus();
          }}
        >
          Done
        </button>
      </div>
    </fieldset>
  );
}
