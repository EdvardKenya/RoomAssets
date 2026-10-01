/**
 * Та же логика пересечений, что и на фронтенде (src/utils/overlap.ts) —
 * сервер — источник истины, поэтому проверка обязательно дублируется здесь.
 */
export function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS < bE && bS < aE;
}

export function findConflicts(bookings, candidate) {
  return bookings.filter(
    (b) =>
      b.id !== candidate.excludeId &&
      b.resourceType === candidate.resourceType &&
      b.resourceId === candidate.resourceId &&
      intervalsOverlap(b.start, b.end, candidate.start, candidate.end)
  );
}
