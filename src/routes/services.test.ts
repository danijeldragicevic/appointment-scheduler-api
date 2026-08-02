import { describe, expect, it } from "vitest";
import { createApp } from "../app";
import { authedRequest } from "../test/authedRequest";

describe("Services API", () => {
  const app = createApp();
  const request = authedRequest(app);

  it("lists all services", async () => {
    const res = await request.get("/services");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("gets a single service by id", async () => {
    const res = await request.get("/services/1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Check-up");
  });

  it("returns 404 for a missing service", async () => {
    const res = await request.get("/services/999");
    expect(res.status).toBe(404);
  });

  it("creates a new service", async () => {
    const res = await request.post("/services").send({
      name: "Vaccination",
      duration: 20,
      price: 50,
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Vaccination", duration: 20, price: 50 });
  });

  it("rejects creating a service with missing fields", async () => {
    const res = await request.post("/services").send({ name: "Vaccination" });
    expect(res.status).toBe(400);
  });

  it("rejects creating a service with a non-positive duration", async () => {
    const res = await request.post("/services").send({
      name: "Vaccination",
      duration: 0,
      price: 50,
    });
    expect(res.status).toBe(400);
  });

  it("updates a service", async () => {
    const res = await request.put("/services/3").send({
      name: "Follow-up",
      duration: 20,
      price: 90,
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 3, duration: 20, price: 90 });
  });

  it("returns 404 when updating a missing service", async () => {
    const res = await request.put("/services/999").send({
      name: "Follow-up",
      duration: 20,
      price: 90,
    });
    expect(res.status).toBe(404);
  });

  it("rejects deleting a service with confirmed appointments", async () => {
    const res = await request.delete("/services/1");
    expect(res.status).toBe(409);
  });

  it("deletes a service with no confirmed appointments", async () => {
    const createRes = await request.post("/services").send({
      name: "Temp Service",
      duration: 10,
      price: 25,
    });
    const { id } = createRes.body;

    const deleteRes = await request.delete(`/services/${id}`);
    expect(deleteRes.status).toBe(200);

    const getRes = await request.get(`/services/${id}`);
    expect(getRes.status).toBe(404);
  });

  it("returns 404 when deleting a missing service", async () => {
    const res = await request.delete("/services/999");
    expect(res.status).toBe(404);
  });
});
