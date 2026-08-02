import { Request, Response } from "express";
import { appointments, getNextAppointmentId, PROVIDER_BASE_SLOTS, services, users } from "../data/store";
import { ApiError } from "../utils/ApiError";
import { Appointment, AppointmentInput } from "../types";
import { getClientType } from "../utils/clientType";

const REQUIRED_FIELDS: (keyof AppointmentInput)[] = [
  "user",
  "provider",
  "service",
  "time",
  "date",
];

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

function parseIsoDate(date: string): number | null {
  if (!DATE_PATTERN.test(date)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  const isRealCalendarDate =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;

  return isRealCalendarDate ? timestamp : null;
}

function startOfTodayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function oneYearFromTodayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear() + 1, now.getUTCMonth(), now.getUTCDate());
}

function validateInput(body: unknown): AppointmentInput {
  if (typeof body !== "object" || body === null) {
    throw new ApiError(400, "Request body must be an object");
  }

  const input = body as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (typeof input[field] !== "string" || input[field] === "") {
      throw new ApiError(400, `Field "${field}" is required and must be a non-empty string`);
    }
  }

  if (!isValidTime(input.time as string)) {
    throw new ApiError(400, 'Field "time" must be a valid 24-hour time in HH:MM format');
  }

  const dateTimestamp = parseIsoDate(input.date as string);
  if (dateTimestamp === null) {
    throw new ApiError(400, 'Field "date" must be a valid date in YYYY-MM-DD format');
  }
  if (dateTimestamp < startOfTodayUtc()) {
    throw new ApiError(400, 'Field "date" cannot be in the past');
  }
  if (dateTimestamp > oneYearFromTodayUtc()) {
    throw new ApiError(400, 'Field "date" cannot be more than a year in the future');
  }

  return {
    user: input.user as string,
    provider: input.provider as string,
    service: input.service as string,
    time: input.time as string,
    date: input.date as string,
  };
}

function assertReferencesExist(input: AppointmentInput): void {
  if (!users.some((u) => u.name === input.user)) {
    throw new ApiError(400, `Unknown user "${input.user}"`);
  }
  if (!Object.prototype.hasOwnProperty.call(PROVIDER_BASE_SLOTS, input.provider)) {
    throw new ApiError(400, `Unknown provider "${input.provider}"`);
  }
  if (!services.some((s) => s.name === input.service)) {
    throw new ApiError(400, `Unknown service "${input.service}"`);
  }
  if (!PROVIDER_BASE_SLOTS[input.provider].includes(input.time)) {
    throw new ApiError(400, `${input.provider} does not offer a ${input.time} time slot`);
  }
}

function findAppointmentOrThrow(id: number): Appointment {
  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) {
    throw new ApiError(404, `Appointment with id ${id} not found`);
  }
  return appointment;
}

function isSlotTaken(
  provider: string,
  date: string,
  time: string,
  excludeId?: number
): boolean {
  return appointments.some(
    (a) =>
      a.provider === provider &&
      a.date === date &&
      a.time === time &&
      a.status === "confirmed" &&
      a.id !== excludeId
  );
}

export function listAppointments(_req: Request, res: Response): void {
  res.status(200).json(appointments);
}

export function getAppointment(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const appointment = findAppointmentOrThrow(id);
  res.status(200).json(appointment);
}

export function createAppointment(req: Request, res: Response): void {
  const input = validateInput(req.body);
  assertReferencesExist(input);

  if (isSlotTaken(input.provider, input.date, input.time)) {
    console.warn(
      `Booking conflict: ${input.provider} is already booked on ${input.date} at ${input.time} [client=${getClientType(req)}]`
    );
    throw new ApiError(409, "Time slot not available");
  }

  const appointment: Appointment = {
    id: getNextAppointmentId(),
    ...input,
    status: "confirmed",
  };

  appointments.push(appointment);
  console.info(
    `Booked appointment #${appointment.id} for ${appointment.user} with ${appointment.provider} on ${appointment.date} at ${appointment.time} [client=${getClientType(req)}]`
  );
  res.status(201).json(appointment);
}

export function updateAppointment(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const appointment = findAppointmentOrThrow(id);
  const input = validateInput(req.body);
  assertReferencesExist(input);

  if (isSlotTaken(input.provider, input.date, input.time, id)) {
    console.warn(
      `Reschedule conflict: ${input.provider} is already booked on ${input.date} at ${input.time} [client=${getClientType(req)}]`
    );
    throw new ApiError(409, "New time slot not available");
  }

  Object.assign(appointment, input);
  console.info(
    `Rescheduled appointment #${id} to ${appointment.date} at ${appointment.time} [client=${getClientType(req)}]`
  );
  res.status(200).json(appointment);
}

export function cancelAppointment(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const appointment = findAppointmentOrThrow(id);
  appointment.status = "cancelled";
  console.info(`Cancelled appointment #${id} [client=${getClientType(req)}]`);
  res.status(200).json({ message: "Appointment cancelled successfully" });
}
