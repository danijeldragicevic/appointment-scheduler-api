import { Request } from "express";

const BEARER_PREFIX = "Bearer ";

export function extractBearerToken(req: Request): string | undefined {
  const header = req.header("authorization");
  if (!header || !header.startsWith(BEARER_PREFIX)) {
    return undefined;
  }
  return header.slice(BEARER_PREFIX.length);
}

function safeEquals(candidate: string | undefined, expected: string | undefined): boolean {
  return Boolean(expected) && candidate === expected;
}

export function isBaseToken(token: string | undefined): boolean {
  return safeEquals(token, process.env.API_TOKEN);
}

export function isAgentToken(token: string | undefined): boolean {
  return safeEquals(token, process.env.AGENT_API_TOKEN);
}
