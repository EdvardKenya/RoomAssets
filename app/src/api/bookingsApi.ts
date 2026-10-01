import axios from "axios";
import { http } from "./client";
import type { Booking, NewBooking } from "@/types/domain";

export interface ConflictError extends Error {
  conflicts: Booking[];
}

function isConflictResponse(e: unknown): e is { response: { status: 409; data: { conflicts: Booking[] } } } {
  return axios.isAxiosError(e) && e.response?.status === 409;
}

function toApiError(e: unknown): Error {
  if (isConflictResponse(e)) {
    const err = new Error("Пересечение по времени с существующей бронью") as ConflictError;
    err.conflicts = e.response.data.conflicts ?? [];
    return err;
  }
  return e instanceof Error ? e : new Error(String(e));
}

export async function fetchBookings(): Promise<Booking[]> {
  const { data } = await http.get<Booking[]>("/bookings");
  return data;
}

export async function createBooking(payload: NewBooking): Promise<Booking> {
  try {
    const { data } = await http.post<Booking>("/bookings", payload);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
}

export async function updateBooking(id: string, payload: NewBooking): Promise<Booking> {
  try {
    const { data } = await http.put<Booking>(`/bookings/${id}`, payload);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
}

export async function deleteBookingApi(id: string): Promise<void> {
  await http.delete(`/bookings/${id}`);
}
