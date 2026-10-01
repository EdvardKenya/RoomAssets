import { describe, expect, it } from "vitest";
import { localInputToUtcIso, utcIsoToLocalInput } from "./datetime";

describe("datetime roundtrip", () => {
  it("localInputToUtcIso -> utcIsoToLocalInput возвращает исходное значение", () => {
    const local = "2025-09-05T11:30";
    expect(utcIsoToLocalInput(localInputToUtcIso(local))).toBe(local);
  });
});
