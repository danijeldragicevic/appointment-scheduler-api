import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app";

process.env.API_TOKEN ??= "test-token";
process.env.AGENT_API_TOKEN ??= "test-agent-token";

describe("Auth", () => {
  const app = createApp();

  it("rejects requests with no Authorization header", async () => {
    const res = await request(app).get("/services");
    expect(res.status).toBe(401);
  });

  it("rejects requests with a malformed Authorization header", async () => {
    const res = await request(app).get("/services").set("Authorization", process.env.API_TOKEN!);
    expect(res.status).toBe(401);
  });

  it("rejects requests with an incorrect bearer token", async () => {
    const res = await request(app).get("/services").set("Authorization", "Bearer wrong-token");
    expect(res.status).toBe(401);
  });

  it("accepts requests with the correct bearer token", async () => {
    const res = await request(app)
      .get("/services")
      .set("Authorization", `Bearer ${process.env.API_TOKEN}`);
    expect(res.status).toBe(200);
  });

  it("accepts requests with the agent bearer token", async () => {
    const res = await request(app)
      .get("/services")
      .set("Authorization", `Bearer ${process.env.AGENT_API_TOKEN}`);
    expect(res.status).toBe(200);
  });
});
