import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { extractBearerToken, isAgentToken, isBaseToken } from "../utils/authToken";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!token) {
    throw new ApiError(401, "Missing or malformed Authorization header");
  }

  if (!isBaseToken(token) && !isAgentToken(token)) {
    throw new ApiError(401, "Invalid API token");
  }

  next();
}
