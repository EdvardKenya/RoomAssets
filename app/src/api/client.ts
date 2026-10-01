import axios from "axios";

// В dev берётся из .env.development, в проде — из переменной окружения CI
// (см. .github/workflows/deploy.yml и README).
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});
