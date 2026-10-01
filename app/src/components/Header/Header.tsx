import { useRef } from "react";
import clsx from "clsx";
import { Button, Tooltip } from "@mui/material";
import { DomainRounded, FileDownloadOutlined, FileUploadOutlined } from "@mui/icons-material";
import s from "./Header.module.css";
import { NAV_ITEMS } from "./header.config";

export interface HeaderProps {
  activeNavId: string;
  onNavigate: (id: string) => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
}

export function Header({ activeNavId, onNavigate, onExport, onImportFile }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className={s.header}>
      <div className={s.row}>
        <div className={s.brand}>
          <div className={s.logoBox} aria-hidden>
            <DomainRounded className={s.logoIc} />
          </div>
          <div className={s.app}>Room &amp; Assets</div>
        </div>

        <nav className={s.nav} aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => {
            const active = item.id === activeNavId;
            return (
              <button
                key={item.id}
                type="button"
                className={clsx(s.tab, active && s.tabActive)}
                onClick={() => onNavigate(item.id)}
                aria-current={active ? "page" : undefined}
              >
                {item.icon && <item.icon className={s.tabIc} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={s.spacer} />

        <div className={s.right}>
          <Tooltip title="Экспортировать все данные в JSON">
            <Button size="small" startIcon={<FileDownloadOutlined />} onClick={onExport}>
              Экспорт
            </Button>
          </Tooltip>
          <Tooltip title="Импортировать данные из JSON (заменит текущие данные на сервере)">
            <Button size="small" startIcon={<FileUploadOutlined />} onClick={() => fileInputRef.current?.click()}>
              Импорт
            </Button>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </header>
  );
}
