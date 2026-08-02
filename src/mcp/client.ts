const DEFAULT_PORT = 8080;

function baseUrl(): string {
  return process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? DEFAULT_PORT}`;
}

function authHeader(): Record<string, string> {
  const token = process.env.AGENT_API_TOKEN;
  if (!token) {
    throw new Error("AGENT_API_TOKEN is not set; the MCP server cannot authenticate with the API");
  }
  return { Authorization: `Bearer ${token}` };
}

export async function apiRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}
