# Proyecto Universidad Malta · Marca A

**Estado:** Dominio comprado y portada (landing) en vivo en uclcampus.com. VPS del backend LMS+CRM+Intranet pausado por decisión de coste (2026-07-14).
**Contacto:** onyhackplayer@gmail.com · n0hacks · 2026
**Dominio:** uclcampus.com — comprado y gestionado en Hostinger (activo hasta 2027-07-14)

## Estado del despliegue (actualizado 2026-07-14)

- **Portada (landing):** en vivo en `http://uclcampus.com`, desplegada gratis en GitHub Pages desde el repo público [`xeMOny/n0hacks2`](https://github.com/xeMOny/n0hacks2) (build estático de `apps/web-lms`, solo `Home.tsx`; el repo se renombró desde `uclcampus-landing`, ya no vive ahí). Contenido con textos/precios de cursos y teléfono aún placeholder — pendiente sustituir con datos reales.
- **DNS (Hostinger):** registros `ALIAS @` y `CNAME www` apuntan a `xemony.github.io`. HTTPS de GitHub Pages puede tardar hasta 24h en aprovisionarse tras el cambio de DNS; mientras tanto sirve por `http://`.
- **Auto-deploy:** `.github/workflows/deploy-landing.yml` reconstruye y publica la portada en cada push a `apps/web-lms/**` (usa GitHub Actions + Pages, no requiere VPS).
- **VPS (LMS+CRM+Intranet completo):** NO comprado. Se cotizó Hostinger VPS (KVM1 ~5,49€/mes, KVM2 ~7,79€/mes) como alternativa más barata al plan original (DigitalOcean/Hetzner 25€/mes), pero el usuario pidió pausar la compra — solo quería dominio + portada por ahora. Retomar cuando se necesite desplegar el backend Node/Postgres/Docker real.
- **Fix técnico aplicado:** `apps/web-lms` no tenía Tailwind configurado pese a que `Home.tsx` usa sus clases — se añadió `tailwind.config.js`, `postcss.config.js` y directivas `@tailwind` en `src/index.css`. También se corrigió la versión de `lucide-react` (estaba en `^1.24.0`, con exports rotos para build de producción; se fijó a `^0.263.1`).

## Resumen

Plataforma educativa integral (LMS + CRM + Intranet) desde cero para ~10 usuarios internos máximo (admin, profesor, comercial, gestor Andorra).

## Presupuesto aprobado

| Componente | Setup | Mantenimiento |
|-----------|-------|---------------|
| LMS | 8.750 € | 380 €/mes (ops, opcional) + 650 €/mes (SEO, opcional) |
| CRM | 4.400 € | 150 €/mes |
| Intranet | 5.100 € | 120 €/mes |
| **Total setup** | **18.250 €** | - |
| Hosting (VPS) | - | 25 €/mes |
| **Mantenimiento obligatorio total** | - | **295 €/mes** |

## Timeline

7-9 semanas (~2 meses), 1-2 devs full-time:
- Semanas 1-5: LMS
- Semanas 4-8: CRM (solapado)
- Semanas 6-9: Intranet + integraciones

## Tech stack (decidido)

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Hosting: VPS (DigitalOcean/Hetzner), 25 €/mes
- Deploy: Docker automático
- SSL/TLS incluido
- Animaciones: framer-motion (instalado, dependencia estándar del frontend)

Justificación: JS full-stack (un dev puede mantenerlo), PostgreSQL potente para reportes CRM y GDPR compliant, VPS propio = datos del cliente sin vendor lock-in.

## Estructura del repo (scaffold creado)

```
apps/web-lms/        Vite+React+TS — público + área privada alumnos
apps/web-crm/         Vite+React+TS — interno, comercial
apps/web-intranet/    Vite+React+TS — interno, todos los roles
server/               Node+Express+TS — API única, módulos /api/{auth,lms,crm,intranet}
infra/                docker-compose.yml + nginx (reverse proxy, subdominios)
docs/ARCHITECTURE.md  detalle de arquitectura y pendientes
```

Monorepo, un backend compartido, una sola Postgres — ver detalle y justificación en `docs/ARCHITECTURE.md`. Cada subcarpeta tiene su propio CLAUDE.md. Schema de BD en `server/postgres/schema.sql` es placeholder: pendiente cerrar campos exactos de CRM e Intranet (ver Próximos pasos).

## Módulos

**LMS (8.750 €, 4-5 semanas):** registro/área privada de alumnos, catálogo de cursos, tests/evaluaciones, pasarela de pago, panel admin, SEO técnico + on-page, AEO (ChatGPT/Perplexity/Google AI), GDPR.

**CRM (4.400 €):** pipeline leads/alumnos, integración con LMS, email marketing GDPR-compliant (Mailchimp/Brevo), reportes para dirección, acceso total dirección + comerciales + gestor Andorra. Opcionales: +950 € automatizaciones email/pipeline, +650 € dashboard KPIs.

**Intranet (5.100 €):** portal privado con roles/permisos flexibles, gestión documental por departamentos, tareas individuales y conjuntas, conexión con LMS+CRM. Opcionales: +800 € gestión de tareas, +600 € integración CRM en tiempo real, +500 € comunicaciones internas.

## Requisitos confirmados (respondidos 2026-07-10)

### CRM
- **Etapas del proceso:** Lead (call/email) → info (comercial) → matrícula web → contrato (admin)
- **Visibilidad de leads:** todos los comerciales ven todos los leads (SIN restricción por territorio)
- **Catálogo:** múltiples títulos, cada uno con precio y características distintas
- **Usuarios:** comercial, gestor Andorra, **dirección (acceso completo)**
- **Email marketing:** SÍ, requiere consentimiento GDPR + integración Mailchimp/Brevo
- **Dashboard dirección:** acceso completo a todos los datos (no solo lectura)

### Intranet
- **Documentos:** variados (contratos, material docente, plantillas, actas)
- **Estructura:** carpetas por departamento
- **Permisos:** role-based, flexible — algunos roles ven varias carpetas, otros una sola (configurable post-launch)
- **Tareas:** individuales Y conjuntas (varios asignados)
- **Notificaciones:** [PENDIENTE ACLARAR] diferencia entre tareas de alumnos (campus virtual, solo admin/profesor) vs intranet staff
- **Subida de documentos:** en campus virtual solo admin/profesor; en intranet [PENDIENTE CERRAR]

## Opcionales post go-live

- Backups: incluido diario 30 días; +60 €/mes geo-redundancia UE 90 días; +140 €/mes PITR continuo.
- SLA: incluido 99% uptime <24h; +120 €/mes 99,5% <8h; +280 €/mes 99,9% <1h 24/7.

## Próximos pasos

1. ✅ Definir requisitos exactos del CRM → **COMPLETADO** (ver sección "Requisitos confirmados")
2. ✅ Definir estructura exacta de la Intranet → **COMPLETADO** (ver sección "Requisitos confirmados")
3. **PENDIENTE ACLARAR:** permisos de subida de documentos en Intranet (¿solo admin o todos?)
4. **PENDIENTE ACLARAR:** notificaciones — ¿por email cuando se asigna tarea/sube doc en Intranet?
5. ✅ Registrar dominio uclcampus.com → **COMPLETADO** (Hostinger)
6. ✅ Portada en vivo (GitHub Pages + DNS) → **COMPLETADO** (ver "Estado del despliegue")
7. **PENDIENTE:** decidir proveedor y comprar VPS (Hostinger KVM2 ~7,79€/mes recomendado, o DigitalOcean/Hetzner 25€/mes) para desplegar LMS+CRM+Intranet completo con Docker+Postgres
8. `npm install` en `server/` y en cada `apps/*`, levantar con `docker compose` desde `infra/` (una vez haya VPS)
9. Sustituir contenido placeholder de la portada (cursos, precios, teléfono) por datos reales
