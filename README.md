# Room & Assets

Каталог аудиторий/инвентаря и управление бронями с проверкой пересечений.
Фронтенд — Vite+React+TS+MUI на GitHub Pages, бэкенд — Express REST API на
Railway, деплой фронтенда — через GitHub Actions.

## Структура

```
RoomAssets/
├─ app/              # фронтенд (Vite + React + TS)
├─ server/           # бэкенд (Express REST API)
├─ seed/             # пример данных (формат импорта/экспорта)
├─ docs/             # SPEC/UI/DATA/DECISIONS/TESTS/COMPAT
├─ .github/workflows/  # CI/CD для фронтенда (GitHub Pages)
└─ Justfile
```

## Локальный запуск

```bash
just install          # npm install в app/ и server/

just dev-backend       # терминал 1: API на http://localhost:4000
just dev-frontend       # терминал 2: фронтенд на http://localhost:5173
```

## Деплой

### Бэкенд → Railway
1. Залогинься на https://railway.app через GitHub.
2. New Project → **Deploy from GitHub repo** → выбери этот репозиторий.
3. В настройках сервиса (Settings → Root Directory) укажи `server` — иначе
   Railway попытается собрать проект из корня репозитория и упадёт на этапе
   билда.
4. Там же, в Variables, добавь `FRONTEND_ORIGINS` — свой реальный GH Pages
   origin **строго в нижнем регистре**, например
   `https://<логин>.github.io,http://localhost:5173`.
5. Settings → Networking → **Generate Domain**, чтобы получить публичный URL
   вида `https://<имя-проекта>.up.railway.app`.

### Фронтенд → GitHub Pages
1. В репозитории: **Settings → Pages → Source → GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables** → добавь
   переменную `VITE_API_URL` = `https://<имя-проекта>.up.railway.app/api`
   (адрес из предыдущего шага + `/api`).
3. Пуш в `main` → workflow `.github/workflows/deploy.yml` соберёт фронтенд и
   опубликует на GitHub Pages автоматически.
4. Итоговый адрес: `https://<логин>.github.io/<репозиторий>/`.

## CI/CD коротко

При пуше в `main`: GitHub Actions ставит зависимости фронтенда, гоняет юнит-
тесты, собирает `vite build` (с адресом бэкенда и базовым путём для Pages) и
публикует результат на GitHub Pages. Бэкенд деплоится отдельно самим Railway —
он подключён к тому же репозиторию (с Root Directory = `server`) и
переразворачивается при пуше в `main` без участия GitHub Actions.

> Изначально бэкенд планировался на Render, но Render требует обязательную
> верификацию карты даже для бесплатного тарифа, и карта не прошла
> подтверждение. Перешли на Railway — тот же принцип (GitHub-репозиторий →
> автодеплой при пуше), но без обязательной привязки карты.

## Документация

- [`docs/SPEC.md`](docs/SPEC.md), [`docs/UI.md`](docs/UI.md),
  [`docs/DATA.md`](docs/DATA.md) (включая REST API),
  [`docs/DECISIONS.md`](docs/DECISIONS.md), [`docs/TESTS.md`](docs/TESTS.md),
  [`docs/COMPAT.md`](docs/COMPAT.md)