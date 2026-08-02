export type AppointmentStatus = "confirmed" | "cancelled";

export interface Appointment {
  id: number;
  user: string;
  provider: string;
  service: string;
  time: string;
  date: string;
  status: AppointmentStatus;
}

export interface AppointmentInput {
  user: string;
  provider: string;
  service: string;
  time: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface UserInput {
  name: string;
  email: string;
  phone: string;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

export interface ServiceInput {
  name: string;
  duration: number;
  price: number;
}

export interface ProviderAvailability {
  provider: string;
  date: string;
  available_times: string[];
}
