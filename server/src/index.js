import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import { loadData, saveData } from "./data.js";
import { findConflicts } from "./overlap.js";

const app = express();
app.use(express.json());

// FRONTEND_ORIGINS — список через запятую, напр.:
// "https://username.github.io,http://localhost:5173"
// Если переменная не задана — разрешаем все origin (удобно для быстрого старта,
// но для продакшена лучше явно ограничить).
const allowedOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

let data = loadData();

app.get("/", (_req, res) => res.send("Room & Assets API is running"));

app.get("/api/rooms", (_req, res) => res.json(data.rooms));
app.get("/api/assets", (_req, res) => res.json(data.assets));
app.get("/api/bookings", (_req, res) => res.json(data.bookings));

app.post("/api/bookings", (req, res) => {
  const booking = { id: randomUUID(), ...req.body };
  const conflicts = findConflicts(data.bookings, { ...booking, excludeId: booking.id });
  if (conflicts.length > 0) return res.status(409).json({ conflicts });
  data.bookings.push(booking);
  saveData(data);
  res.status(201).json(booking);
});

app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const idx = data.bookings.findIndex((b) => b.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });

  const updated = { ...req.body, id };
  const conflicts = findConflicts(data.bookings, { ...updated, excludeId: id });
  if (conflicts.length > 0) return res.status(409).json({ conflicts });

  data.bookings[idx] = updated;
  saveData(data);
  res.json(updated);
});

app.delete("/api/bookings/:id", (req, res) => {
  data.bookings = data.bookings.filter((b) => b.id !== req.params.id);
  saveData(data);
  res.status(204).end();
});

app.get("/api/export", (_req, res) => res.json(data));

app.post("/api/import", (req, res) => {
  const body = req.body;
  if (!Array.isArray(body?.rooms) || !Array.isArray(body?.assets) || !Array.isArray(body?.bookings)) {
    return res.status(400).json({ error: "invalid format: expected rooms, assets, bookings arrays" });
  }
  data = body;
  saveData(data);
  res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Room & Assets API listening on :${PORT}`));
