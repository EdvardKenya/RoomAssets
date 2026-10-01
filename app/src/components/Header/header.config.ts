import type { NavItem } from "./header.types";
import { EventNoteOutlined, ListAltOutlined } from "@mui/icons-material";

export const NAV_ITEMS: NavItem[] = [
  { id: "catalog", label: "Каталог ресурсов", icon: ListAltOutlined },
  { id: "bookings", label: "Брони", icon: EventNoteOutlined },
];
