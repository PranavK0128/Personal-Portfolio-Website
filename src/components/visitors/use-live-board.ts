"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BoardState, LiveAction, LiveBoard } from "@/lib/visitors";

type Pending = { action: LiveAction; done: (ok: boolean) => void };
export function useLiveBoard(
  onNotes: (board: BoardState) => void,
  onError: (message: string) => void,
) {
  const [state, setState] = useState<LiveBoard>({ peers: [], positions: {} });
  const [clientId, setClientId] = useState("");
  const [connected, setConnected] = useState(false);
  const client = useRef("");
  const queue = useRef<Pending[]>([]);
  const busy = useRef(false);
  const notesCallback = useRef(onNotes);
  const errorCallback = useRef(onError);
  const activeRequest = useRef<AbortController | null>(null);
  useEffect(() => {
    notesCallback.current = onNotes;
    errorCallback.current = onError;
  });

  const send = useCallback((action: LiveAction): Promise<boolean> => {
    if (!client.current) return Promise.resolve(false);
    return new Promise((done) => {
      // Keep the latest pointer location rather than building a backlog on a slow network.
      let replaced = false;
      if (action.type === "cursor" || action.type === "move") {
        for (let i = queue.current.length - 1; i >= 0; i--) {
          const pending = queue.current[i];
          if (
            pending.action.type !== "cursor" &&
            pending.action.type !== "move"
          )
            break;
          if (pending.action.type === action.type) {
            pending.done(false);
            queue.current[i] = { action, done };
            replaced = true;
            break;
          }
        }
      }
      if (!replaced) queue.current.push({ action, done });
      if (busy.current) return;
      busy.current = true;
      void (async () => {
        while (queue.current.length && client.current) {
          const item = queue.current.shift();
          if (!item) break;
          const owner = client.current;
          const controller = new AbortController();
          activeRequest.current = controller;
          const timeout = setTimeout(() => controller.abort(), 5000);
          try {
            const response = await fetch("/api/visitors/live", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clientId: owner, action: item.action }),
              signal: controller.signal,
            });
            if (!response.ok && client.current === owner) {
              const result = await response.json();
              if (!["cursor", "heartbeat", "leave"].includes(item.action.type))
                errorCallback.current(result.error);
            }
            item.done(response.ok && client.current === owner);
          } catch {
            if (
              client.current === owner &&
              ["select", "move"].includes(item.action.type)
            )
              errorCallback.current(
                "Connection interrupted. Please try moving the note again.",
              );
            item.done(false);
          } finally {
            clearTimeout(timeout);
          }
        }
        busy.current = false;
      })();
    });
  }, []);

  useEffect(() => {
    let source: EventSource | undefined;
    let stopped = false;
    let reconnect: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    let connecting = false;
    let generation = 0;
    const controller = new AbortController();
    const clearQueue = () => {
      for (const item of queue.current.splice(0)) item.done(false);
    };
    const disconnect = () => {
      generation++;
      connecting = false;
      const id = client.current;
      client.current = "";
      source?.close();
      source = undefined;
      clearQueue();
      activeRequest.current?.abort();
      setConnected(false);
      setClientId("");
      setState((previous) => ({ ...previous, peers: [] }));
      if (id)
        navigator.sendBeacon(
          "/api/visitors/live",
          new Blob(
            [JSON.stringify({ clientId: id, action: { type: "leave" } })],
            { type: "application/json" },
          ),
        );
    };
    const connect = async () => {
      if (
        stopped ||
        document.visibilityState !== "visible" ||
        !navigator.onLine ||
        source ||
        connecting
      )
        return;
      connecting = true;
      const started = generation;
      try {
        // Establish the HttpOnly anonymous cookie before opening the event stream.
        const response = await fetch("/api/visitors", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error(
            "The board could not be loaded. Please retry shortly.",
          );
        const board = await response.json();
        if (
          stopped ||
          started !== generation ||
          document.visibilityState !== "visible"
        )
          return;
        notesCallback.current(board);
        source = new EventSource("/api/visitors/live");
        source.addEventListener("welcome", (event) => {
          const id = JSON.parse(event.data).clientId;
          client.current = id;
          setClientId(id);
          setConnected(true);
          errorCallback.current("");
          attempts = 0;
        });
        source.addEventListener("state", (event) =>
          setState(JSON.parse(event.data)),
        );
        source.addEventListener("notes", (event) =>
          notesCallback.current(JSON.parse(event.data)),
        );
        source.onerror = () => {
          disconnect();
          if (!stopped)
            reconnect = setTimeout(
              () => void connect(),
              Math.min(30000, 1000 * 2 ** attempts++),
            );
        };
      } catch {
        if (!stopped && started === generation && !controller.signal.aborted) {
          errorCallback.current(
            "The board is temporarily unavailable. Reconnecting…",
          );
          reconnect = setTimeout(
            () => void connect(),
            Math.min(30000, 1000 * 2 ** attempts++),
          );
        }
      } finally {
        if (started === generation) connecting = false;
      }
    };
    const visibility = () => {
      clearTimeout(reconnect);
      if (document.visibilityState === "hidden") disconnect();
      else void connect();
    };
    const heartbeat = setInterval(() => {
      if (client.current) void send({ type: "heartbeat" });
    }, 5000);
    void connect();
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", disconnect);
    window.addEventListener("offline", disconnect);
    window.addEventListener("online", visibility);
    window.addEventListener("pageshow", visibility);
    return () => {
      stopped = true;
      controller.abort();
      clearTimeout(reconnect);
      clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", disconnect);
      window.removeEventListener("offline", disconnect);
      window.removeEventListener("online", visibility);
      window.removeEventListener("pageshow", visibility);
      disconnect();
    };
  }, [send]);
  return { ...state, clientId, connected, send };
}
