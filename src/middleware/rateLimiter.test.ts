import express, { Application } from "express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createRateLimiter, RateLimiterOptions } from "./rateLimiter";

const BASE_TOKEN = "rl-test-base-token";
const AGENT_TOKEN = "rl-test-agent-token";

function buildTestApp(options: RateLimiterOptions): Application {
  const app = express();
  app.use(createRateLimiter(options));
  app.get("/", (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

describe("createRateLimiter", () => {
  const originalApiToken = process.env.API_TOKEN;
  const originalAgentToken = process.env.AGENT_API_TOKEN;

  beforeEach(() => {
    process.env.API_TOKEN = BASE_TOKEN;
    process.env.AGENT_API_TOKEN = AGENT_TOKEN;
  });

  afterEach(() => {
    process.env.API_TOKEN = originalApiToken;
    process.env.AGENT_API_TOKEN = originalAgentToken;
  });

  it("caps unauthenticated traffic at unidentifiedLimit", async () => {
    const app = buildTestApp({ windowMs: 60_000, unidentifiedLimit: 2, identifiedLimit: 4 });

    const first = await request(app).get("/");
    const second = await request(app).get("/");
    const third = await request(app).get("/");

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
  });

  it("does not grant the agent tier via X-Client-Type when only the base token is presented", async () => {
    const app = buildTestApp({ windowMs: 60_000, unidentifiedLimit: 2, identifiedLimit: 4 });

    const first = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${BASE_TOKEN}`)
      .set("X-Client-Type", "agent");
    const second = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${BASE_TOKEN}`)
      .set("X-Client-Type", "agent");
    const third = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${BASE_TOKEN}`)
      .set("X-Client-Type", "agent");

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
  });

  it("grants the agent tier only when AGENT_API_TOKEN is presented as the bearer token", async () => {
    const app = buildTestApp({ windowMs: 60_000, unidentifiedLimit: 2, identifiedLimit: 4 });

    for (let i = 0; i < 4; i++) {
      const res = await request(app).get("/").set("Authorization", `Bearer ${AGENT_TOKEN}`);
      expect(res.status).toBe(200);
    }

    const fifth = await request(app).get("/").set("Authorization", `Bearer ${AGENT_TOKEN}`);
    expect(fifth.status).toBe(429);
  });

  it("treats an unrecognized bearer token as unidentified", async () => {
    const app = buildTestApp({ windowMs: 60_000, unidentifiedLimit: 2, identifiedLimit: 4 });

    const first = await request(app).get("/").set("Authorization", "Bearer totally-invalid-token");
    const second = await request(app).get("/").set("Authorization", "Bearer totally-invalid-token");
    const third = await request(app).get("/").set("Authorization", "Bearer totally-invalid-token");

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
  });
});
