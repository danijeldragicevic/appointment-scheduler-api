import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app";

describe("Health", () => {
  const app = createApp();

  it("responds without requiring authentication", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
