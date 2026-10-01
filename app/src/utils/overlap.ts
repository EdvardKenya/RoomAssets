import type { Booking, ResourceType } from "@/types/domain";

export function intervalsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS < bE && bS < aE;
}

export interface CandidateBooking {
  resourceType: ResourceType;
  resourceId: string;
  start: string;
  end: string;
  excludeId?: string;
}

export function findConflicts(bookings: Booking[], candidate: CandidateBooking): Booking[] {
  return bookings.filter(
    (b) =>
      b.id !== candidate.excludeId &&
      b.resourceType === candidate.resourceType &&
      b.resourceId === candidate.resourceId &&
      intervalsOverlap(b.start, b.end, candidate.start, candidate.end)
  );
}
