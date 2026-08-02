import { Appointment, Service, User } from "../types";

// Single-process in-memory state — not shared across multiple instances/workers.
export const appointments: Appointment[] = [
    {
        id: 1,
        user: "John Doe",
        provider: "Dr. Smith",
        service: "Check-up",
        time: "09:00",
        date: "2025-07-23",
        status: "confirmed",
    },
    {
        id: 2,
        user: "Jane Doe",
        provider: "Dr. Brown",
        service: "Consultation",
        time: "10:00",
        date: "2025-07-23",
        status: "confirmed",
    },
];

export const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "555-0101" },
    { id: 2, name: "Jane Doe", email: "jane@example.com", phone: "555-0102" },
];

export const services: Service[] = [
    { id: 1, name: "Check-up", duration: 30, price: 100 },
    { id: 2, name: "Consultation", duration: 45, price: 150 },
    { id: 3, name: "Follow-up", duration: 15, price: 75 },
];

// Baseline daily time slots each provider offers, before subtracting booked
// appointments. In a real system this would come from provider schedules.
export const PROVIDER_BASE_SLOTS: Record<string, string[]> = {
    "Dr. Smith": ["09:00", "10:30", "11:00", "13:00", "14:00", "15:30"],
    "Dr. Brown": ["10:00", "11:30", "13:00", "14:30", "16:00"],
    "Dr. White": ["09:30", "11:00", "13:30", "15:00", "16:30"],
};

let nextAppointmentId = appointments.length + 1;
export function getNextAppointmentId(): number {
    return nextAppointmentId++;
}

let nextUserId = users.length + 1;
export function getNextUserId(): number {
    return nextUserId++;
}

let nextServiceId = services.length + 1;
export function getNextServiceId(): number {
    return nextServiceId++;
}
