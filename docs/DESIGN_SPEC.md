# Design & UX Spec · Universidad Malta

**Versión:** 1.0 (base + preguntas pendientes)  
**Estado:** Requisitos iniciales cerrados, design details pendiente

## Resumen de requisitos derivados

Basado en CRM_SPEC.md, INTRANET_SPEC.md y CLAUDE.md.

### Aplicaciones y audiencias

| App | Audiencia | Complejidad | Prioridad |
|-----|-----------|-----------|-----------|
| **Campus Virtual (LMS)** | Alumnos + admin/profesor | Media | 1 |
| **CRM** | Comerciales + gestor Andorra + dirección | Alta | 2 |
| **Intranet** | Staff (todos los roles) | Media | 3 |

### Flujos principales

**Campus Virtual:**
- Login → Dashboard alumno → Catálogo cursos → Matrícula → Área privada (contenido, tareas, tests)
- Admin: panel de control (alumnos, cursos, reportes)

**CRM:**
- Login → Dashboard (mi pipeline) → Lista leads → Detalle lead → Email/notas → Reportes (para dirección)
- Flujos diferenciados: comercial (operacional) vs dirección (reportes/análisis)

**Intranet:**
- Login → Dashboard → Documentos (por carpeta/rol) → Tareas (mis tareas/asignadas)
- Flujos: búsqueda de docs, subida, creación de tareas

## Tono y estilo (PENDIENTE CONFIRMAR)

- **Tono:** ¿Formal/corporativo o moderno/educativo?
- **Paleta color:** ¿Colores corporativos existentes de la universidad?
- **Logo/branding:** ¿Tenéis guidelines de marca?
- **Tipografía:** ¿Preferencia de fuentes?

## Accesibilidad y compliance

- **WCAG 2.1 AA:** requerimiento (educación + GDPR = accesibilidad crítica)
- **Idioma:** español por defecto; ¿soporte multiidioma?
- **Dispositivos:** desktop primario; mobile secundario (estudiantes móvil, staff desktop)

## Componentes visuales recurrentes

Basado en flujos:

### Tablas/listas
- Leads (CRM): nombre, email, etapa, fecha contacto, acciones
- Alumnos (LMS): nombre, email, curso, progreso, acciones
- Documentos (Intranet): nombre, departamento, fecha, tags, acciones
- Tareas (Intranet): asignado a, descripción, plazo, estado

### Formularios
- Crear/editar lead: nombre, email, teléfono, empresa, origen, notas
- Crear tarea: título, descripción, asignados, plazo, prioridad
- Subir documento: archivo, carpeta, tags, permisos

### Dashboards
- Comercial: resumen pipeline, últimos leads, KPIs
- Dirección: conversión, ingresos, actividad por comercial
- Admin LMS: matrícula, progreso cursos, reportes

## Autenticación

- Login único (federated con LMS/CRM/Intranet)
- 2FA (¿obligatorio o opcional?)
- SSO externo (¿Google/Microsoft para staff?)

## Preguntas de diseño PENDIENTE RESPONDER

### Brand & Visual
- [ ] ¿Tenéis manual de marca actual o logo oficial?
- [ ] ¿Paleta de colores corporativos?
- [ ] ¿Tipografía preferida (sans-serif, serif)?
- [ ] ¿Estilo visual: minimalista, colorido, corporativo?

### UX & Flujos
- [ ] Campus Virtual: ¿mostrar catálogo de cursos antes de login o después?
- [ ] CRM: ¿bulk actions en leads (cambiar etapa múltiples, asignar, etc.)?
- [ ] Intranet: ¿búsqueda full-text en documentos?
- [ ] Notificaciones: ¿in-app + email o solo in-app?
- [ ] Historial de cambios: ¿quién cambió qué, cuándo?

### Dispositivos & Responsive
- [ ] ¿Prioridad mobile-first o desktop-first?
- [ ] ¿Tablets (iPad) es caso de uso importante?
- [ ] ¿Aplicación nativa (iOS/Android) o web-only?

### Accesibilidad & Internacionalización
- [ ] ¿WCAG 2.1 AA obligatorio?
- [ ] ¿Soporte para daltonismo (simulador)?
- [ ] ¿Soporte multiidioma (inglés, francés, catalán)?
- [ ] ¿Soporte para lectores de pantalla?

### Integraciones externas
- [ ] Mailchimp/Brevo en CRM: ¿widget embedding o solo sync de datos?
- [ ] Google Analytics / Matomo para reportes de uso?
- [ ] Slack webhooks para notificaciones?

### Rendimiento & SEO
- [ ] Campus Virtual: ¿SEO en página pública?
- [ ] Tiempo de carga objetivo (>3s aceptable?)
- [ ] Analítica de usuario (Mixpanel, Segment)?

### Seguridad & Compliance
- [ ] ¿Encriptación de datos en tránsito (TLS) + en reposo?
- [ ] ¿Logs de auditoría para admin/dirección?
- [ ] ¿Retention de datos personales (cuántos meses/años)?
- [ ] ¿Derecho al olvido (GDPR delete)?

## Notas para desarrollo

- Usar **framer-motion** para animaciones consistentes (ya está en stack)
- React + TypeScript: ¿UI library? (Tailwind ya está, considerar shadcn/ui para componentes)
- Diseño system para mantener consistencia entre apps (aunque sean 3 apps, mismo look&feel)
- Dark mode: ¿soporte?

## Siguientes pasos

1. Responder preguntas de diseño arriba
2. Crear wireframes/prototipos de flujos principales (Figma)
3. Design tokens (colores, tipografía, spacing)
4. Component library (botones, inputs, cards, etc.)
