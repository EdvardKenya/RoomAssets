import { endOfDay, parseISO, startOfDay } from "date-fns";
import type { Asset, Booking, BookingFilters, Room, ResourceType } from "@/types/domain";

export function filterBookings(bookings: Booking[], filters: BookingFilters): Booking[] {
  const search = filters.search.trim().toLowerCase();
  let dayStart: Date | null = null;
  let dayEnd: Date | null = null;
  if (filters.date) {
    const d = new Date(`${filters.date}T00:00:00`);
    dayStart = startOfDay(d);
    dayEnd = endOfDay(d);
  }
  return bookings
    .filter((b) => filters.resourceType === "all" || b.resourceType === filters.resourceType)
    .filter((b) => filters.resourceId === "all" || b.resourceId === filters.resourceId)
    .filter((b) => {
      if (!dayStart || !dayEnd) return true;
      const bStart = parseISO(b.start);
      const bEnd = parseISO(b.end);
      return bStart < dayEnd && dayStart < bEnd;
    })
    .filter((b) => !search || b.title.toLowerCase().includes(search) || (b.notes ?? "").toLowerCase().includes(search))
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function resourceLabel(type: ResourceType, id: string, rooms: Room[], assets: Asset[]): string {
  if (type === "room") return rooms.find((r) => r.id === id)?.name ?? id;
  return assets.find((a) => a.id === id)?.name ?? id;
}
