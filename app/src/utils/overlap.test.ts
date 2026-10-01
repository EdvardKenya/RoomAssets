import { describe, expect, it } from "vitest";
import { findConflicts, intervalsOverlap } from "./overlap";
import type { Booking } from "@/types/domain";

describe("intervalsOverlap", () => {
  it("обнаруживает пересекающиеся интервалы", () => {
    expect(
      intervalsOverlap("2025-01-01T10:00:00Z", "2025-01-01T11:00:00Z", "2025-01-01T10:30:00Z", "2025-01-01T12:00:00Z")
    ).toBe(true);
  });
  it("не считает пересечением брони встык", () => {
    expect(
      intervalsOverlap("2025-01-01T10:00:00Z", "2025-01-01T11:00:00Z", "2025-01-01T11:00:00Z", "2025-01-01T12:00:00Z")
    ).toBe(false);
  });
  it("не считает пересечением непересекающиеся интервалы", () => {
    expect(
      intervalsOverlap("2025-01-01T08:00:00Z", "2025-01-01T09:00:00Z", "2025-01-01T10:00:00Z", "2025-01-01T11:00:00Z")
    ).toBe(false);
  });
});

describe("findConflicts", () => {
  const bookings: Booking[] = [
    { id: "b-1", resourceType: "room", resourceId: "r-101", title: "Семинар", start: "2025-01-01T10:00:00Z", end: "2025-01-01T11:00:00Z" },
  ];
  it("находит конфликт для того же ресурса", () => {
    expect(findConflicts(bookings, { resourceType: "room", resourceId: "r-101", start: "2025-01-01T10:30:00Z", end: "2025-01-01T10:45:00Z" })).toHaveLength(1);
  });
  it("игнорирует другой ресурс", () => {
    expect(findConflicts(bookings, { resourceType: "room", resourceId: "r-203", start: "2025-01-01T10:30:00Z", end: "2025-01-01T10:45:00Z" })).toHaveLength(0);
  });
  it("исключает саму бронь при редактировании (excludeId)", () => {
    expect(findConflicts(bookings, { resourceType: "room", resourceId: "r-101", start: "2025-01-01T10:00:00Z", end: "2025-01-01T11:00:00Z", excludeId: "b-1" })).toHaveLength(0);
  });
});
