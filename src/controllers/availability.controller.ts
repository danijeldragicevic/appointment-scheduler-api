import { Request, Response } from "express";
import { appointments, PROVIDER_BASE_SLOTS } from "../data/store";
import { ProviderAvailability } from "../types";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeAvailability(provider: string, date: string): ProviderAvailability {
  const baseSlots = PROVIDER_BASE_SLOTS[provider] ?? [];
  const bookedTimes = new Set(
    appointments
      .filter((a) => a.provider === provider && a.date === date && a.status === "confirmed")
      .map((a) => a.time)
  );

  return {
    provider,
    date,
    available_times: baseSlots.filter((slot) => !bookedTimes.has(slot)),
  };
}

export function listAvailability(req: Request, res: Response): void {
  const date = typeof req.query.date === "string" ? req.query.date : todayIsoDate();
  const providerQuery = typeof req.query.provider === "string" ? req.query.provider : undefined;
  const providers = providerQuery ? [providerQuery] : Object.keys(PROVIDER_BASE_SLOTS);

  const result = providers.map((provider) => computeAvailability(provider, date));
  res.status(200).json(result);
}
