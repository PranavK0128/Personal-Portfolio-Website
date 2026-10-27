import { type NextRequest, NextResponse } from "next/server";
import { BoardError, getVisitorStore } from "@/lib/visitor-store";
import { validateLiveAction } from "@/lib/visitors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

function verify(request: NextRequest, writing = false) {
  const origin = process.env.VISITORS_SITE_ORIGIN || request.nextUrl.origin;
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.VISITORS_SITE_ORIGIN
  )
    throw new BoardError("Live board configuration is incomplete.", 503);
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    (writing && request.headers.get("origin") !== origin)
  )
    throw new BoardError("Please use the board on this website.", 403);
  const token = request.cookies.get("portfolio_visitor")?.value;
  if (!token)
    throw new BoardError("Open the board first. Cookies must be enabled.", 403);
  return token;
}
function failure(error: unknown) {
  return NextResponse.json(
    {
      error:
        error instanceof BoardError
          ? error.message
          : "Live updates are temporarily unavailable.",
    },
    { status: error instanceof BoardError ? error.status : 503, headers },
  );
}

export async function GET(request: NextRequest) {
  try {
    const token = verify(request);
    const store = getVisitorStore();
    const clientId = store.join(token);
    let finish = () => {};
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const encoder = new TextEncoder();
        let ended = false;
        let previous = "";
        let version = "";
        let lastPing = 0;
        let timer: ReturnType<typeof setInterval> | undefined;
        const emit = (event: string, data: unknown) =>
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        finish = () => {
          if (ended) return;
          ended = true;
          clearInterval(timer);
          request.signal.removeEventListener("abort", finish);
          store.leave(clientId);
          try {
            controller.close();
          } catch {
            /* The reader may have already canceled. */
          }
        };
        const tick = () => {
          if (ended) return;
          try {
            const snapshot = store.liveSnapshot();
            if (!store.hasClient(clientId)) {
              finish();
              return;
            }
            const serialized = JSON.stringify(snapshot);
            if (serialized !== previous) {
              emit("state", snapshot);
              previous = serialized;
            }
            const nextVersion = store.notesVersion();
            if (version !== nextVersion) {
              const visitor = store.visitor(token);
              emit("notes", {
                notes: store.list(),
                canPost: !visitor?.posted && !visitor?.blocked,
              });
              version = nextVersion;
            }
            if (Date.now() - lastPing > 5000) {
              controller.enqueue(encoder.encode(": keepalive\n\n"));
              lastPing = Date.now();
            }
          } catch {
            finish();
          }
        };
        emit("welcome", { clientId });
        timer = setInterval(tick, 100);
        request.signal.addEventListener("abort", finish, { once: true });
        if (request.signal.aborted) finish();
        else tick();
      },
      cancel() {
        finish();
      },
    });
    return new Response(stream, {
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = verify(request, true);
    if (
      request.headers.get("content-type")?.split(";")[0] !== "application/json"
    )
      throw new BoardError("Unsupported request format.", 415);
    const reader = request.body?.getReader();
    if (!reader) throw new BoardError("Missing update.", 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 1024) {
        await reader.cancel();
        throw new BoardError("Update too large.", 413);
      }
      chunks.push(chunk.value);
    }
    let data: {
      clientId: string;
      action: ReturnType<typeof validateLiveAction>;
    };
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (
        typeof body.clientId !== "string" ||
        !/^[a-f0-9-]{36}$/.test(body.clientId)
      )
        throw new Error("Invalid session.");
      data = {
        clientId: body.clientId,
        action: validateLiveAction(body.action),
      };
    } catch {
      throw new BoardError("Invalid board update.", 400);
    }
    getVisitorStore().liveUpdate(token, data.clientId, data.action);
    return new NextResponse(null, { status: 204, headers });
  } catch (error) {
    return failure(error);
  }
}
