# Room & Assets

Каталог аудиторий/инвентаря и управление бронями с проверкой пересечений.
Фронтенд — Vite+React+TS+MUI на GitHub Pages, бэкенд — Express REST API на
Render, деплой фронтенда — через GitHub Actions.

## Структура

```
RoomAssets/
├─ app/              # фронтенд (Vite + React + TS)
├─ server/           # бэкенд (Express REST API)
├─ seed/             # пример данных (формат импорта/экспорта)
├─ docs/             # SPEC/UI/DATA/DECISIONS/TESTS/COMPAT
├─ render.yaml        # Render Blueprint для бэкенда
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

### Бэкенд → Render
1. Залогинься на https://render.com (можно через GitHub).
2. New + → **Blueprint** → выбери этот GitHub-репозиторий → Render подхватит
   `render.yaml` и создаст сервис `room-assets-api` (папка `server/`).
3. В настройках сервиса (Environment) проверь/поправь `FRONTEND_ORIGINS` —
   впиши свой реальный GH Pages origin, например
   `https://<логин>.github.io,http://localhost:5173`.
4. После деплоя скопируй URL сервиса, например
   `https://room-assets-api.onrender.com`.

### Фронтенд → GitHub Pages
1. В репозитории: **Settings → Pages → Source → GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables** → добавь
   переменную `VITE_API_URL` = `https://room-assets-api.onrender.com/api`
   (адрес из предыдущего шага + `/api`).
3. Пуш в `main` → workflow `.github/workflows/deploy.yml` соберёт фронтенд и
   опубликует на GitHub Pages автоматически.
4. Итоговый адрес: `https://<логин>.github.io/<репозиторий>/`.

## CI/CD коротко

При пуше в `main`: GitHub Actions ставит зависимости фронтенда, гоняет юнит-
тесты, собирает `vite build` (с адресом бэкенда и базовым путём для Pages) и
публикует результат на GitHub Pages. Бэкенд деплоится отдельно самим Render —
он подключён к тому же репозиторию и переразворачивается при пуше в `main`
без участия GitHub Actions.

## Документация

- [`docs/SPEC.md`](docs/SPEC.md), [`docs/UI.md`](docs/UI.md),
  [`docs/DATA.md`](docs/DATA.md) (включая REST API),
  [`docs/DECISIONS.md`](docs/DECISIONS.md), [`docs/TESTS.md`](docs/TESTS.md),
  [`docs/COMPAT.md`](docs/COMPAT.md)
