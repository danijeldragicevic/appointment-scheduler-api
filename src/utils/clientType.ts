import { Request } from "express";
import { extractBearerToken, isAgentToken } from "./authToken";

export type ClientType = "agent" | "default";

export function getClientType(req: Request): ClientType {
  return isAgentToken(extractBearerToken(req)) ? "agent" : "default";
}
