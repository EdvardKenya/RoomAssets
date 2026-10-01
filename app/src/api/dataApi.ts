import { http } from "./client";
import type { AppData } from "@/types/domain";

export async function exportData(): Promise<AppData> {
  const { data } = await http.get<AppData>("/export");
  return data;
}

export async function importData(payload: AppData): Promise<AppData> {
  const { data } = await http.post<AppData>("/import", payload);
  return data;
}
