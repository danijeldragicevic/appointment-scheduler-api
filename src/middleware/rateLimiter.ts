import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { getClientType } from "../utils/clientType";

export interface RateLimiterOptions {
  windowMs?: number;
  unidentifiedLimit?: number;
  identifiedLimit?: number;
}

export function createRateLimiter(options: RateLimiterOptions = {}): RateLimitRequestHandler {
  const { windowMs = 60_000, unidentifiedLimit = 60, identifiedLimit = 150 } = options;

  return rateLimit({
    windowMs,
    limit: (req) => (getClientType(req) === "default" ? unidentifiedLimit : identifiedLimit),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" },
  });
}
