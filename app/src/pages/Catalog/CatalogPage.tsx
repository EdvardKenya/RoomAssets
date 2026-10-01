import { useMemo, useState } from "react";
import {
  Box, Chip, Container, InputAdornment, Paper, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useAppStore } from "@/store/useAppStore";

const ASSET_STATUS_LABEL: Record<string, string> = {
  available: "Доступен",
  in_use: "Используется",
  maintenance: "На обслуживании",
};

export function CatalogPage() {
  const rooms = useAppStore((s) => s.rooms);
  const assets = useAppStore((s) => s.assets);
  const [search, setSearch] = useState("");

  const filteredRooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rooms.filter((r) => r.name.toLowerCase().includes(q)) : rooms;
  }, [rooms, search]);

  const filteredAssets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? assets.filter((a) => a.name.toLowerCase().includes(q) || a.inventoryCode.toLowerCase().includes(q))
      : assets;
  }, [assets, search]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Каталог ресурсов</Typography>
          <TextField
            size="small"
            placeholder="Поиск по названию / инв. номеру"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" /></InputAdornment> }}
            sx={{ width: 320 }}
          />
        </Stack>

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Аудитории</Typography>
        <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #eef0f3", mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>Название</TableCell><TableCell align="right">Вместимость</TableCell><TableCell>Оснащение</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {filteredRooms.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.name}</TableCell>
                  <TableCell align="right">{r.capacity}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {r.features.length === 0 && <Typography variant="body2" color="text.secondary">—</Typography>}
                      {r.features.map((f) => <Chip key={f} label={f} size="small" variant="outlined" />)}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRooms.length === 0 && (
                <TableRow><TableCell colSpan={3}><Typography color="text.secondary" align="center" sx={{ py: 2 }}>Ничего не найдено</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Инвентарь</Typography>
        <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #eef0f3" }}>
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>Название</TableCell><TableCell>Инв. номер</TableCell><TableCell>Статус</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {filteredAssets.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.inventoryCode}</TableCell>
                  <TableCell><Chip label={ASSET_STATUS_LABEL[a.status] ?? a.status} size="small" /></TableCell>
                </TableRow>
              ))}
              {filteredAssets.length === 0 && (
                <TableRow><TableCell colSpan={3}><Typography color="text.secondary" align="center" sx={{ py: 2 }}>Ничего не найдено</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
}
