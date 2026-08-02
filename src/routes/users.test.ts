import { describe, expect, it } from "vitest";
import { createApp } from "../app";
import { authedRequest } from "../test/authedRequest";

describe("Users API", () => {
  const app = createApp();
  const request = authedRequest(app);

  it("lists all users", async () => {
    const res = await request.get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("gets a single user by id", async () => {
    const res = await request.get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("John Doe");
  });

  it("returns 404 for a missing user", async () => {
    const res = await request.get("/users/999");
    expect(res.status).toBe(404);
  });

  it("creates a new user", async () => {
    const res = await request.post("/users").send({
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "555-0103",
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Bob Smith", email: "bob@example.com" });
  });

  it("rejects creating a user with missing fields", async () => {
    const res = await request.post("/users").send({ name: "Bob Smith" });
    expect(res.status).toBe(400);
  });

  it("updates a user", async () => {
    const res = await request.put("/users/2").send({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "555-0199",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 2, email: "jane.doe@example.com" });
  });

  it("returns 404 when updating a missing user", async () => {
    const res = await request.put("/users/999").send({
      name: "Nobody",
      email: "nobody@example.com",
      phone: "555-0000",
    });

    expect(res.status).toBe(404);
  });

  it("rejects deleting a user with confirmed appointments", async () => {
    const res = await request.delete("/users/1");
    expect(res.status).toBe(409);
  });

  it("deletes a user with no confirmed appointments", async () => {
    const createRes = await request.post("/users").send({
      name: "Temp User",
      email: "temp@example.com",
      phone: "555-0104",
    });
    const { id } = createRes.body;

    const deleteRes = await request.delete(`/users/${id}`);
    expect(deleteRes.status).toBe(200);

    const getRes = await request.get(`/users/${id}`);
    expect(getRes.status).toBe(404);
  });

  it("returns 404 when deleting a missing user", async () => {
    const res = await request.delete("/users/999");
    expect(res.status).toBe(404);
  });
});
