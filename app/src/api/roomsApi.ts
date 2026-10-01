import { http } from "./client";
import type { Asset, Room } from "@/types/domain";

export async function fetchRooms(): Promise<Room[]> {
  const { data } = await http.get<Room[]>("/rooms");
  return data;
}

export async function fetchAssets(): Promise<Asset[]> {
  const { data } = await http.get<Asset[]>("/assets");
  return data;
}
