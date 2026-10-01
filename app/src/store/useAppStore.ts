import { create } from "zustand";
import type { AppData, Asset, Booking, NewBooking, Room } from "@/types/domain";
import { fetchAssets, fetchRooms } from "@/api/roomsApi";
import {
  type ConflictError,
  createBooking,
  deleteBookingApi,
  fetchBookings,
  updateBooking,
} from "@/api/bookingsApi";
import { exportData, importData } from "@/api/dataApi";

export type UpsertBookingResult = { ok: true } | { ok: false; conflicts: Booking[] };

interface AppState {
  rooms: Room[];
  assets: Asset[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;

  init(): Promise<void>;

  saveBooking(id: string | undefined, payload: NewBooking): Promise<UpsertBookingResult>;
  deleteBooking(id: string): Promise<void>;

  exportJson(): Promise<void>;
  importJson(file: File): Promise<void>;
}

function upsertById<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx === -1) return [...list, item];
  const copy = list.slice();
  copy[idx] = item;
  return copy;
}

function isValidAppData(value: unknown): value is AppData {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.rooms) && Array.isArray(v.assets) && Array.isArray(v.bookings);
}

export const useAppStore = create<AppState>((set) => ({
  rooms: [],
  assets: [],
  bookings: [],
  loading: true,
  error: null,

  async init() {
    set({ loading: true, error: null });
    try {
      const [rooms, assets, bookings] = await Promise.all([fetchRooms(), fetchAssets(), fetchBookings()]);
      set({ rooms, assets, bookings, loading: false });
    } catch (e) {
      set({
        error:
          "Не удалось загрузить данные с сервера. Проверьте, что бэкенд запущен и доступен по VITE_API_URL.",
        loading: false,
      });
      console.error(e);
    }
  },

  async saveBooking(id, payload) {
    try {
      const saved = id ? await updateBooking(id, payload) : await createBooking(payload);
      set((s) => ({ bookings: upsertById(s.bookings, saved) }));
      return { ok: true };
    } catch (e) {
      const err = e as ConflictError;
      if (err.conflicts) return { ok: false, conflicts: err.conflicts };
      set({ error: err.message || "Не удалось сохранить бронь" });
      return { ok: false, conflicts: [] };
    }
  },

  async deleteBooking(id) {
    await deleteBookingApi(id);
    set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) }));
  },

  async exportJson() {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `room-assets-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  async importJson(file) {
    const text = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Файл не является валидным JSON.");
    }
    if (!isValidAppData(parsed)) {
      throw new Error("Некорректный формат файла: ожидаются поля rooms, assets, bookings (массивы).");
    }
    const saved = await importData(parsed);
    set({ rooms: saved.rooms, assets: saved.assets, bookings: saved.bookings });
  },
}));
