import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import { Header } from "@/components/Header";
import { CatalogPage } from "@/pages/Catalog";
import { BookingsPage } from "@/pages/Bookings";
import { useAppStore } from "@/store/useAppStore";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState<"catalog" | "bookings">("catalog");
  const [toast, setToast] = useState<string | null>(null);

  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);
  const init = useAppStore((s) => s.init);
  const exportJson = useAppStore((s) => s.exportJson);
  const importJson = useAppStore((s) => s.importJson);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImport = async (file: File) => {
    try {
      await importJson(file);
      setToast("Данные успешно импортированы.");
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Не удалось импортировать файл.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header activeNavId={tab} onNavigate={(id) => setTab(id as "catalog" | "bookings")} onExport={exportJson} onImportFile={handleImport} />
      {tab === "catalog" ? <CatalogPage /> : <BookingsPage />}
      <Snackbar open={!!error || !!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={error ? "error" : "success"} onClose={() => setToast(null)}>{error ?? toast}</Alert>
      </Snackbar>
    </>
  );
}
