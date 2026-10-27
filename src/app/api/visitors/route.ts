import { isIP } from "node:net";
import { type NextRequest, NextResponse } from "next/server";
import { BoardError, getVisitorStore } from "@/lib/visitor-store";
import { validateNote } from "@/lib/visitors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const COOKIE = "portfolio_visitor";
const MAX_BODY_BYTES = 300000;
const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

function network(request: NextRequest) {
  // Only trust a header the deployment's reverse proxy overwrites, never arbitrary forwarded headers.
  const header = process.env.VISITORS_IP_HEADER;
  if (header) {
    const value = request.headers.get(header)?.trim();
    if (!value || !isIP(value))
      throw new BoardError(
        "Visitor verification is unavailable. Please try again later.",
        503,
      );
    return value;
  }
  if (process.env.NODE_ENV === "production")
    throw new BoardError("Visitor spam protection is not configured yet.", 503);
  return "local-development";
}

function failure(error: unknown) {
  if (error instanceof BoardError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status, headers },
    );
  console.error(
    "Visitors storage request failed",
    error instanceof Error ? error.name : "Unknown error",
  );
  return NextResponse.json(
    { error: "The board is temporarily unavailable. Please try again." },
    { status: 503, headers },
  );
}

export async function GET(request: NextRequest) {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site")
      throw new BoardError("Please open the board on this site.", 403);
    const store = getVisitorStore();
    let token = request.cookies.get(COOKIE)?.value;
    let visitor = store.visitor(token);
    const fresh = !visitor;
    if (!visitor) {
      token = store.issue(store.networkHash(network(request)));
      visitor = store.visitor(token);
    }
    const response = NextResponse.json(
      { notes: store.list(), canPost: !visitor?.posted && !visitor?.blocked },
      { headers },
    );
    if (fresh && token)
      response.cookies.set(COOKIE, token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/api/visitors",
        maxAge: 365 * 86400,
      });
    return response;
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (
      process.env.NODE_ENV === "production" &&
      !process.env.VISITORS_SITE_ORIGIN
    )
      throw new BoardError(
        "Visitor spam protection is not configured yet.",
        503,
      );
    const origin = process.env.VISITORS_SITE_ORIGIN || request.nextUrl.origin;
    if (
      request.headers.get("origin") !== origin ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      throw new BoardError("Please submit your note from this website.", 403);
    if (
      request.headers.get("content-type")?.split(";")[0] !== "application/json"
    )
      throw new BoardError("Unsupported request format.", 415);
    const store = getVisitorStore();
    const token = request.cookies.get(COOKIE)?.value;
    if (!token || !store.visitor(token))
      throw new BoardError(
        "Please refresh the board before posting. Cookies must be enabled.",
        403,
      );
    const networkId = store.networkHash(network(request));
    store.throttle(`attempts:${networkId}`, 20, 60000);
    const length = Number(request.headers.get("content-length") || 0);
    if (length > MAX_BODY_BYTES)
      throw new BoardError("This drawing is too large.", 413);
    const reader = request.body?.getReader();
    if (!reader) throw new BoardError("Your note is empty.", 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new BoardError("This drawing is too large.", 413);
      }
      chunks.push(chunk.value);
    }
    let data: ReturnType<typeof validateNote>;
    try {
      data = validateNote(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    } catch (error) {
      throw new BoardError(
        error instanceof Error ? error.message : "Invalid note.",
        400,
      );
    }
    const note = store.post(token, networkId, data);
    return NextResponse.json({ note }, { status: 201, headers });
  } catch (error) {
    return failure(error);
  }
}
