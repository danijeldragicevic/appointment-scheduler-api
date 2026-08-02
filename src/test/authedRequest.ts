import { Application } from "express";
import request from "supertest";

process.env.API_TOKEN ??= "test-token";

export function authedRequest(app: Application) {
  const token = `Bearer ${process.env.API_TOKEN}`;
  return {
    get: (url: string) => request(app).get(url).set("Authorization", token),
    post: (url: string) => request(app).post(url).set("Authorization", token),
    put: (url: string) => request(app).put(url).set("Authorization", token),
    delete: (url: string) => request(app).delete(url).set("Authorization", token),
  };
}
