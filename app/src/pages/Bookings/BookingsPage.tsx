import { useMemo, useState } from "react";
import {
  Box, Button, Container, IconButton, MenuItem, Paper, Stack, Table,
  TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import { AddOutlined, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useAppStore } from "@/store/useAppStore";
import { filterBookings, resourceLabel } from "@/utils/filters";
import { formatLocal } from "@/utils/datetime";
import type { Booking, BookingFilters, ResourceType } from "@/types/domain";
import { BookingFormDialog } from "@/components/BookingFormDialog";

const EMPTY_FILTERS: BookingFilters = { search: "", date: null, resourceType: "all", resourceId: "all" };

export function BookingsPage() {
  const rooms = useAppStore((s) => s.rooms);
  const assets = useAppStore((s) => s.assets);
  const bookings = useAppStore((s) => s.bookings);
  const deleteBooking = useAppStore((s) => s.deleteBooking);

  const [filters, setFilters] = useState<BookingFilters>(EMPTY_FILTERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | undefined>(undefined);

  const resourceOptionsForFilter = filters.resourceType === "asset" ? assets : rooms;
  const visibleBookings = useMemo(() => filterBookings(bookings, filters), [bookings, filters]);

  const openCreate = () => { setEditing(undefined); setDialogOpen(true); };
  const openEdit = (b: Booking) => { setEditing(b); setDialogOpen(true); };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Брони</Typography>
          <Button variant="contained" startIcon={<AddOutlined />} onClick={openCreate}>Новая бронь</Button>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField size="small" label="Поиск" placeholder="По названию или комментарию" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} fullWidth />
          <TextField size="small" label="Дата" type="date" value={filters.date ?? ""} onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value || null }))} InputLabelProps={{ shrink: true }} sx={{ minWidth: 170 }} />
          <TextField size="small" select label="Тип ресурса" value={filters.resourceType} onChange={(e) => setFilters((f) => ({ ...f, resourceType: e.target.value as ResourceType | "all", resourceId: "all" }))} sx={{ minWidth: 160 }}>
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="room">Аудитории</MenuItem>
            <MenuItem value="asset">Инвентарь</MenuItem>
          </TextField>
          <TextField size="small" select label="Ресурс" value={filters.resourceId} disabled={filters.resourceType === "all"} onChange={(e) => setFilters((f) => ({ ...f, resourceId: e.target.value }))} sx={{ minWidth: 180 }}>
            <MenuItem value="all">Все</MenuItem>
            {resourceOptionsForFilter.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
          </TextField>
        </Stack>

        <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #eef0f3" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell><TableCell>Ресурс</TableCell><TableCell>Начало</TableCell>
                <TableCell>Окончание</TableCell><TableCell>Комментарий</TableCell>
                <TableCell width={100} align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleBookings.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>{resourceLabel(b.resourceType, b.resourceId, rooms, assets)}</TableCell>
                  <TableCell>{formatLocal(b.start)}</TableCell>
                  <TableCell>{formatLocal(b.end)}</TableCell>
                  <TableCell>{b.notes ?? "—"}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Редактировать" onClick={() => openEdit(b)}><EditOutlined fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" title="Удалить" onClick={() => deleteBooking(b.id)}><DeleteOutline fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {visibleBookings.length === 0 && (
                <TableRow><TableCell colSpan={6}><Typography color="text.secondary" align="center" sx={{ py: 2 }}>Броней, подходящих под фильтры, не найдено</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <BookingFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} rooms={rooms} assets={assets} booking={editing} />
    </Container>
  );
}
