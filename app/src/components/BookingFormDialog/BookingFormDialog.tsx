import { useEffect, useState } from "react";
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField,
} from "@mui/material";
import type { Asset, Booking, ResourceType, Room } from "@/types/domain";
import { localInputToUtcIso, utcIsoToLocalInput } from "@/utils/datetime";
import { useAppStore } from "@/store/useAppStore";

export interface BookingFormDialogProps {
  open: boolean;
  onClose: () => void;
  rooms: Room[];
  assets: Asset[];
  booking?: Booking;
}

interface FormState {
  resourceType: ResourceType;
  resourceId: string;
  title: string;
  startLocal: string;
  endLocal: string;
  notes: string;
}

function emptyForm(rooms: Room[], assets: Asset[]): FormState {
  return { resourceType: "room", resourceId: rooms[0]?.id ?? assets[0]?.id ?? "", title: "", startLocal: "", endLocal: "", notes: "" };
}

export function BookingFormDialog({ open, onClose, rooms, assets, booking }: BookingFormDialogProps) {
  const saveBooking = useAppStore((s) => s.saveBooking);
  const [form, setForm] = useState<FormState>(() => emptyForm(rooms, assets));
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setConflictError(null);
    setValidationError(null);
    if (booking) {
      setForm({
        resourceType: booking.resourceType,
        resourceId: booking.resourceId,
        title: booking.title,
        startLocal: utcIsoToLocalInput(booking.start),
        endLocal: utcIsoToLocalInput(booking.end),
        notes: booking.notes ?? "",
      });
    } else {
      setForm(emptyForm(rooms, assets));
    }
  }, [open, booking, rooms, assets]);

  const resourceOptions = form.resourceType === "room" ? rooms : assets;

  const handleSubmit = async () => {
    setConflictError(null);
    setValidationError(null);

    if (!form.resourceId || !form.title.trim() || !form.startLocal || !form.endLocal) {
      setValidationError("Заполните ресурс, название и время начала/окончания.");
      return;
    }

    const start = localInputToUtcIso(form.startLocal);
    const end = localInputToUtcIso(form.endLocal);

    if (new Date(start).getTime() >= new Date(end).getTime()) {
      setValidationError("Время окончания должно быть позже времени начала.");
      return;
    }

    setSubmitting(true);
    const result = await saveBooking(booking?.id, {
      resourceType: form.resourceType,
      resourceId: form.resourceId,
      title: form.title.trim(),
      start,
      end,
      notes: form.notes.trim() || undefined,
    });
    setSubmitting(false);

    if (!result.ok) {
      const names = result.conflicts.map((c) => `«${c.title}»`).join(", ");
      setConflictError(
        names ? `Пересечение по времени с существующей бронью: ${names}.` : "Не удалось сохранить бронь."
      );
      return;
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{booking ? "Редактировать бронь" : "Новая бронь"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {conflictError && <Alert severity="error">{conflictError}</Alert>}
          {validationError && <Alert severity="warning">{validationError}</Alert>}

          <TextField
            select
            label="Тип ресурса"
            value={form.resourceType}
            onChange={(e) => {
              const resourceType = e.target.value as ResourceType;
              const options = resourceType === "room" ? rooms : assets;
              setForm((f) => ({ ...f, resourceType, resourceId: options[0]?.id ?? "" }));
            }}
          >
            <MenuItem value="room">Аудитория</MenuItem>
            <MenuItem value="asset">Инвентарь</MenuItem>
          </TextField>

          <TextField select label="Ресурс" value={form.resourceId} onChange={(e) => setForm((f) => ({ ...f, resourceId: e.target.value }))}>
            {resourceOptions.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
          </TextField>

          <TextField label="Название брони" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />

          <Stack direction="row" spacing={2}>
            <TextField label="Начало" type="datetime-local" value={form.startLocal} onChange={(e) => setForm((f) => ({ ...f, startLocal: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Окончание" type="datetime-local" value={form.endLocal} onChange={(e) => setForm((f) => ({ ...f, endLocal: e.target.value }))} InputLabelProps={{ shrink: true }} fullWidth />
          </Stack>

          <TextField label="Комментарий" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} multiline minRows={2} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}
