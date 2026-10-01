export type ResourceType = "room" | "asset";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  features: string[];
}

export type AssetStatus = "available" | "in_use" | "maintenance";

export interface Asset {
  id: string;
  name: string;
  inventoryCode: string;
  status: AssetStatus;
}

export interface Booking {
  id: string;
  resourceType: ResourceType;
  resourceId: string;
  title: string;
  start: string;
  end: string;
  notes?: string;
}

export type NewBooking = Omit<Booking, "id">;

export interface AppData {
  rooms: Room[];
  assets: Asset[];
  bookings: Booking[];
}

export interface BookingFilters {
  search: string;
  date: string | null;
  resourceType: ResourceType | "all";
  resourceId: string | "all";
}
