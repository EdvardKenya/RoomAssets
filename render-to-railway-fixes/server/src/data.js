import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "store.json");

const SEED = {
  rooms: [
    { id: "r-101", name: "Аудитория 101", capacity: 30, features: ["projector", "whiteboard"] },
    { id: "r-203", name: "Аудитория 203", capacity: 20, features: [] },
  ],
  assets: [
    { id: "a-proj-1", name: "Проектор Epson", inventoryCode: "PRJ001", status: "available" },
  ],
  bookings: [
    {
      id: "b-1",
      resourceType: "room",
      resourceId: "r-101",
      title: "Семинар",
      start: "2025-09-05T08:00:00Z",
      end: "2025-09-05T09:30:00Z",
      notes: "Нужен HDMI",
    },
  ],
};

// ВАЖНО: на бесплатном тарифе Railway файловая система эфемерная — данные
// переживают рестарты процесса, но затираются при новом деплое. Для учебного
// проекта этого достаточно; для продакшена нужна настоящая БД (Postgres и т.п.).
export function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
