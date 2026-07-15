import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Solo afecta a "vite dev": en producción /api lo sirve el reverse proxy
    // (nginx, ver infra/). Sin esto, cualquier llamada de apiFetch() se queda
    // en el propio Vite y devuelve 404 en vez de llegar a server/.
    proxy: { "/api": "http://localhost:4123" },
  },
  build: {
    assetsDir: ".",
  },
});
