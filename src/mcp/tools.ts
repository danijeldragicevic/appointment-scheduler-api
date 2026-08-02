import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest } from "./client";
import { User } from "../types";

function textResult(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function errorResult(error: unknown) {
  return {
    content: [{ type: "text" as const, text: error instanceof Error ? error.message : String(error) }],
    isError: true,
  };
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "list_users",
    {
      description:
        "List registered users (id and name only). Call this to find the exact user name required by " +
        "book_appointment — the appointments API rejects any name that doesn't match an existing user exactly. " +
        "Contact details are not exposed here; this tool only exists to support name matching for booking.",
    },
    async () => {
      try {
        const users = await apiRequest<User[]>("GET", "/users");
        return textResult(users.map(({ id, name }) => ({ id, name })));
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "list_services",
    {
      description: "List all bookable services (name, duration in minutes, price).",
    },
    async () => {
      try {
        return textResult(await apiRequest("GET", "/services"));
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "check_availability",
    {
      description:
        "List each provider's open time slots for a given date (defaults to today). Always call this " +
        "before book_appointment — booking a time that isn't listed here will be rejected.",
      inputSchema: {
        date: z.string().optional().describe("Date to check, as YYYY-MM-DD. Defaults to today."),
        provider: z.string().optional().describe("Restrict to one provider. Defaults to all providers."),
      },
    },
    async ({ date, provider }) => {
      try {
        const query = new URLSearchParams();
        if (date) query.set("date", date);
        if (provider) query.set("provider", provider);
        const qs = query.toString();
        return textResult(await apiRequest("GET", `/availability${qs ? `?${qs}` : ""}`));
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "book_appointment",
    {
      description:
        "Book a new appointment. Before calling this: get the exact user name from list_users, the exact " +
        "service name from list_services, and an open provider/time from check_availability. The API also " +
        "rejects dates before today or more than a year out.",
      inputSchema: {
        user: z.string().describe("Exact name of an existing user (see list_users)."),
        provider: z.string().describe("Provider name (see check_availability)."),
        service: z.string().describe("Exact name of an existing service (see list_services)."),
        time: z.string().describe("24-hour time in HH:MM format, matching an open slot from check_availability."),
        date: z.string().describe("Date in YYYY-MM-DD format, today through one year from today."),
      },
    },
    async (input) => {
      try {
        return textResult(await apiRequest("POST", "/appointments", input));
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "list_appointments",
    {
      description: "List all appointments, including cancelled ones. Useful to find an id for cancel_appointment.",
    },
    async () => {
      try {
        return textResult(await apiRequest("GET", "/appointments"));
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "cancel_appointment",
    {
      description: "Cancel an existing appointment by id.",
      inputSchema: {
        id: z.number().int().describe("The appointment id to cancel (see list_appointments)."),
      },
    },
    async ({ id }) => {
      try {
        return textResult(await apiRequest("DELETE", `/appointments/${id}`));
      } catch (error) {
        return errorResult(error);
      }
    }
  );
}
