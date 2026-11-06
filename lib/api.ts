// Client for the store backend (NEXT_PUBLIC_API_BASE_URL).
// Every customer endpoint needs the X-Vendor-ID header; responses are wrapped
// as { status, message, data }. Works on the server and in the browser.

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
export const VENDOR_ID = process.env.NEXT_PUBLIC_VENDOR_ID ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
  }
}

type Envelope<T> = { status?: string; message?: string; data?: T };

/** Turns DRF-style error bodies ({field: ["msg"]}, {detail}, {message}) into one readable line. */
function errorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string" && b.status !== "success") return b.message;
  if (typeof b.detail === "string") return b.detail;
  const first = Object.entries(b).find(([, v]) => Array.isArray(v) && typeof v[0] === "string");
  if (first) return `${first[0].replace(/_/g, " ")}: ${(first[1] as string[])[0]}`;
  return fallback;
}

export async function apiFetch<T>(
  path: string,
  { token, ...init }: RequestInit & { token?: string | null } = {},
): Promise<T> {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set in .env");

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (VENDOR_ID) headers.set("X-Vendor-ID", VENDOR_ID);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok || (body as Envelope<T>)?.status === "error") {
    throw new ApiError(errorMessage(body, `Request failed (${res.status})`), res.status, body);
  }
  // Most endpoints wrap the payload; a few return it bare
  const env = body as Envelope<T>;
  return (env && typeof env === "object" && "data" in env ? env.data : body) as T;
}

/** Paginated DRF lists come back either as { results: [...] } or as a bare array. */
export function listOf<T>(data: T[] | { results?: T[] } | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}
