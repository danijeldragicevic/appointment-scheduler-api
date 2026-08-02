import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { appointments } from "../../data/store";
import { authedRequest } from "../authedRequest";
import { expectMatchesSchema } from "./openapiSchemas";

function isoDate(daysFromToday: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

const TODAY = isoDate(0);
const TOMORROW = isoDate(1);

describe("OpenAPI contract", () => {
  const app = createApp();
  const authed = authedRequest(app);

  beforeEach(() => {
    appointments.length = 0;
    appointments.push({
      id: 1,
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Check-up",
      time: "09:00",
      date: TODAY,
      status: "confirmed",
    });
  });

  it("GET /health matches its 200 schema", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    await expectMatchesSchema(res.body, "/health", "get", 200);
  });

  it("GET /services matches its 200 schema", async () => {
    const res = await authed.get("/services");
    expect(res.status).toBe(200);
    await expectMatchesSchema(res.body, "/services", "get", 200);
  });

  it("POST /appointments matches its 201 schema", async () => {
    const res = await authed.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Consultation",
      time: "11:00",
      date: TOMORROW,
    });
    expect(res.status).toBe(201);
    await expectMatchesSchema(res.body, "/appointments", "post", 201);
  });

  it("POST /appointments with missing fields matches its 400 schema", async () => {
    const res = await authed.post("/appointments").send({ user: "John Doe" });
    expect(res.status).toBe(400);
    await expectMatchesSchema(res.body, "/appointments", "post", 400);
  });

  it("POST /appointments with a conflicting slot matches its 409 schema", async () => {
    const res = await authed.post("/appointments").send({
      user: "Jane Doe",
      provider: "Dr. Smith",
      service: "Check-up",
      time: "09:00",
      date: TODAY,
    });
    expect(res.status).toBe(409);
    await expectMatchesSchema(res.body, "/appointments", "post", 409);
  });

  it("GET /appointments/:id for a missing id matches its 404 schema", async () => {
    const res = await authed.get("/appointments/999");
    expect(res.status).toBe(404);
    await expectMatchesSchema(res.body, "/appointments/{id}", "get", 404);
  });

  it("a request with no Authorization header matches the 401 schema", async () => {
    const res = await request(app).get("/services");
    expect(res.status).toBe(401);
    await expectMatchesSchema(res.body, "/services", "get", 401);
  });
});
