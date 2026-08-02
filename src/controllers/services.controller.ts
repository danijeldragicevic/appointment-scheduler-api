import { Request, Response } from "express";
import { appointments, getNextServiceId, services } from "../data/store";
import { ApiError } from "../utils/ApiError";
import { Service, ServiceInput } from "../types";
import { getClientType } from "../utils/clientType";

function validateInput(body: unknown): ServiceInput {
  if (typeof body !== "object" || body === null) {
    throw new ApiError(400, "Request body must be an object");
  }

  const input = body as Record<string, unknown>;
  if (typeof input.name !== "string" || input.name === "") {
    throw new ApiError(400, 'Field "name" is required and must be a non-empty string');
  }
  if (typeof input.duration !== "number" || input.duration <= 0) {
    throw new ApiError(400, 'Field "duration" is required and must be a positive number');
  }
  if (typeof input.price !== "number" || input.price < 0) {
    throw new ApiError(400, 'Field "price" is required and must be a non-negative number');
  }

  return {
    name: input.name,
    duration: input.duration,
    price: input.price,
  };
}

function findServiceOrThrow(id: number): Service {
  const service = services.find((s) => s.id === id);
  if (!service) {
    throw new ApiError(404, `Service with id ${id} not found`);
  }
  return service;
}

export function listServices(_req: Request, res: Response): void {
  res.status(200).json(services);
}

export function getService(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const service = findServiceOrThrow(id);
  res.status(200).json(service);
}

export function createService(req: Request, res: Response): void {
  const input = validateInput(req.body);
  const service: Service = { id: getNextServiceId(), ...input };
  services.push(service);
  console.info(`Created service #${service.id} (${service.name}) [client=${getClientType(req)}]`);
  res.status(201).json(service);
}

export function updateService(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const service = findServiceOrThrow(id);
  const input = validateInput(req.body);

  Object.assign(service, input);
  console.info(`Updated service #${id} (${service.name}) [client=${getClientType(req)}]`);
  res.status(200).json(service);
}

export function deleteService(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const service = findServiceOrThrow(id);

  const hasConfirmedAppointments = appointments.some(
    (a) => a.service === service.name && a.status === "confirmed"
  );
  if (hasConfirmedAppointments) {
    throw new ApiError(409, `Cannot delete service "${service.name}": has confirmed appointments`);
  }

  services.splice(services.indexOf(service), 1);
  console.info(`Deleted service #${id} (${service.name}) [client=${getClientType(req)}]`);
  res.status(200).json({ message: "Service deleted successfully" });
}
