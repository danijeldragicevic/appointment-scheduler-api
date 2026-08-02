import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app";
import { appointments } from "../data/store";
import { authedRequest } from "../test/authedRequest";

function isoDate(daysFromToday: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

const TODAY = isoDate(0);
const TOMORROW = isoDate(1);

describe("Appointments API", () => {
  const app = createApp();
  const request = authedRequest(app);
  const seedLength = 2;

  beforeEach(() => {
    appointments.length = 0;
    appointments.push(
      {
        id: 1,
        user: "John Doe",
        provider: "Dr. Smith",
        service: "Check-up",
        time: "09:00",
        date: TODAY,
        status: "confirmed",
      },
      {
        id: 2,
        user: "Jane Doe",
        provider: "Dr. Brown",
        service: "Consultation",
        time: "10:00",
        date: TODAY,
        status: "confirmed",
      }
    );
  });

  it("lists all appointments", async () => {
    const res = await request.get("/appointments");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(seedLength);
  });

  it("gets a single appointment by id", async () => {
    const res = await request.get("/appointments/1");
    expect(res.status).toBe(200);
    expect(res.body.user).toBe("John Doe");
  });

  it("returns 404 for a missing appointment", async () => {
    const res = await request.get("/appointments/999");
    expect(res.status).toBe(404);
  });

  it("books a new appointment", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Consultation",
      time: "11:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      user: "John Doe",
      provider: "Dr. White",
      status: "confirmed",
    });
  });

  it("rejects booking with missing fields", async () => {
    const res = await request.post("/appointments").send({ user: "John Doe" });
    expect(res.status).toBe(400);
  });

  it("rejects booking for an unknown user", async () => {
    const res = await request.post("/appointments").send({
      user: "Someone Else",
      provider: "Dr. White",
      service: "Consultation",
      time: "11:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking with an unknown provider", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. Nobody",
      service: "Consultation",
      time: "11:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking with an unknown service", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Massage",
      time: "11:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking a time slot the provider doesn't offer", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Consultation",
      time: "17:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking with an invalid time", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Consultation",
      time: "100:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking with an invalid date", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Consultation",
      time: "11:00",
      date: "2025-02-30",
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking in the past", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Consultation",
      time: "11:00",
      date: "2000-01-01",
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking more than a year in the future", async () => {
    const res = await request.post("/appointments").send({
      user: "John Doe",
      provider: "Dr. White",
      service: "Consultation",
      time: "11:00",
      date: "2099-01-01",
    });

    expect(res.status).toBe(400);
  });

  it("rejects booking a conflicting time slot", async () => {
    const res = await request.post("/appointments").send({
      user: "Jane Doe",
      provider: "Dr. Smith",
      service: "Check-up",
      time: "09:00",
      date: TODAY,
    });

    expect(res.status).toBe(409);
  });

  it("updates (reschedules) an appointment", async () => {
    const res = await request.put("/appointments/1").send({
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Check-up",
      time: "14:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(200);
    expect(res.body.time).toBe("14:00");
    expect(res.body.date).toBe(TOMORROW);
  });

  it("rejects rescheduling to a time slot the provider doesn't offer", async () => {
    const res = await request.put("/appointments/1").send({
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Check-up",
      time: "08:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(400);
  });

  it("returns 404 when updating a missing appointment", async () => {
    const res = await request.put("/appointments/999").send({
      user: "John Doe",
      provider: "Dr. Smith",
      service: "Check-up",
      time: "14:00",
      date: TOMORROW,
    });

    expect(res.status).toBe(404);
  });

  it("cancels an appointment", async () => {
    const res = await request.delete("/appointments/1");
    expect(res.status).toBe(200);

    const getRes = await request.get("/appointments/1");
    expect(getRes.body.status).toBe("cancelled");
  });
});
