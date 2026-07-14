# apps/web-crm

Frontend interno de uso comercial. Pipeline de leads, asignación por territorio (Malta/Andorra).

Stack: Vite + React + TypeScript + react-router-dom + framer-motion (instalado por defecto).
Consume la API en `server/` vía `src/api/client.ts` (`VITE_API_BASE`, por defecto `/api`).

Arrancar local: `npm install && npm run dev`
