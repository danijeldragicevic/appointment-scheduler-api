import { Request, Response } from "express";
import { appointments, getNextUserId, users } from "../data/store";
import { ApiError } from "../utils/ApiError";
import { User, UserInput } from "../types";
import { getClientType } from "../utils/clientType";

function validateInput(body: unknown): UserInput {
  if (typeof body !== "object" || body === null) {
    throw new ApiError(400, "Request body must be an object");
  }

  const input = body as Record<string, unknown>;
  for (const field of ["name", "email", "phone"] as const) {
    if (typeof input[field] !== "string" || input[field] === "") {
      throw new ApiError(400, `Field "${field}" is required and must be a non-empty string`);
    }
  }

  return {
    name: input.name as string,
    email: input.email as string,
    phone: input.phone as string,
  };
}

function findUserOrThrow(id: number): User {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new ApiError(404, `User with id ${id} not found`);
  }
  return user;
}

export function listUsers(_req: Request, res: Response): void {
  res.status(200).json(users);
}

export function getUser(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const user = findUserOrThrow(id);
  res.status(200).json(user);
}

export function createUser(req: Request, res: Response): void {
  const input = validateInput(req.body);
  const user: User = { id: getNextUserId(), ...input };
  users.push(user);
  console.info(`Created user #${user.id} (${user.name}) [client=${getClientType(req)}]`);
  res.status(201).json(user);
}

export function updateUser(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const user = findUserOrThrow(id);
  const input = validateInput(req.body);

  Object.assign(user, input);
  console.info(`Updated user #${id} (${user.name}) [client=${getClientType(req)}]`);
  res.status(200).json(user);
}

export function deleteUser(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const user = findUserOrThrow(id);

  const hasConfirmedAppointments = appointments.some(
    (a) => a.user === user.name && a.status === "confirmed"
  );
  if (hasConfirmedAppointments) {
    throw new ApiError(409, `Cannot delete user "${user.name}": has confirmed appointments`);
  }

  users.splice(users.indexOf(user), 1);
  console.info(`Deleted user #${id} (${user.name}) [client=${getClientType(req)}]`);
  res.status(200).json({ message: "User deleted successfully" });
}
