import fetch, { RequestInit } from "node-fetch";

export async function httpRequest(
  url: string,
  options: RequestInit = {}
): Promise<{ status: number; body: string }> {
  const res = await fetch(url, options);
  const body = await res.text();
  return { status: res.status, body };
}
