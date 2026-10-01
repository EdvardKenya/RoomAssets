# COMPAT — наблюдения

Шаблон для заполнения после реального прогона (сборка проверена автоматически
только в Linux-окружении сборки).

## Версии окружения
- Node.js: 22.12.0
- npm: 10.9.0

## Деплой
- GitHub Pages: URL вида `https://edvardkenya.github.io/RoomAssets/`
- Railway: URL вида `https://roomassets-production.up.railway.app/api`
- Учти cold start бесплатного тарифа Railway — первый запрос после простоя
  может идти несколько секунд, это нормально, не баг.

## CORS
- `FRONTEND_ORIGINS` на Railway должен содержать точный origin GH Pages
  **строго в нижнем регистре** (`https://<логин>.github.io`, без пути
  `/репозиторий/` — для CORS важен только scheme+host).
