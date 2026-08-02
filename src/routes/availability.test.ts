import { describe, expect, it } from "vitest";
import { createApp } from "../app";
import { authedRequest } from "../test/authedRequest";

describe("Availability API", () => {
  const app = createApp();
  const request = authedRequest(app);

  it("lists availability for a specific provider and date", async () => {
    const res = await request.get("/availability").query({
      provider: "Dr. Smith",
      date: "2025-07-23",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].provider).toBe("Dr. Smith");
    // 09:00 is already booked by the seeded appointment on this date.
    expect(res.body[0].available_times).not.toContain("09:00");
  });

  it("lists availability for all known providers when none specified", async () => {
    const res = await request.get("/availability").query({ date: "2025-07-23" });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(1);
  });
});
