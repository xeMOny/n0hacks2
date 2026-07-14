# Especificación CRM · Universidad Malta

**Versión:** 1.0 (confirmado 2026-07-10)  
**Estado:** Requisitos cerrados, pendiente dev

## Descripción general

Pipeline de leads → alumnos, con visibilidad compartida para comerciales y acceso completo para dirección. Integración automática con LMS cuando se matricula un alumno. Email marketing GDPR-compliant.

## Actores y permisos

| Rol | Crear lead | Editar lead | Ver todos | Ver reportes | Email marketing | Acceso completo |
|-----|-----------|-----------|---------|------------|-----------------|-----------------|
| Comercial | ✅ | ✅ propios | ✅ todos | ❌ | ✅ consentimiento | ❌ |
| Gestor Andorra | ✅ | ✅ | ✅ | ✅ | ✅ consentimiento | ❌ |
| Dirección | ✅ | ✅ | ✅ | ✅ | ✅ consentimiento | ✅ |

**Nota:** Sin restricción por territorio (todos ven todos los leads).

## Flujo de lead → alumno

```
1. Lead (origen: call, email, web)
   ├─ Datos básicos: nombre, email, teléfono, empresa/institución
   └─ Origen: manual/call/web form

2. Lead → Interés (comercial agrega nota/etapa)
   ├─ Etapas: Nuevo → Contactado → Interesado → Cotizado → Matriculado

3. Matrícula (lead clica en web LMS)
   ├─ Sistema crea alumno en LMS
   └─ CRM actualiza lead a "Matriculado"

4. Contrato (admin envía desde administración)
   └─ CRM registra fecha envío + firma
```

## Catálogo de cursos/títulos

Cada título (curso) tiene:
- Nombre
- Descripción
- Precio
- Duración (semanas/meses)
- Capacidad (cupos)
- Características especiales (examen, certificado, etc.)
- Disponibilidad (activo/inactivo)

**Nota:** No es un catálogo simple — cada título es independiente.

## Email marketing

- **Consentimiento:** sí/no/pendiente (GDPR compliant)
- **Integración:** Mailchimp/Brevo (por confirmar)
- **Automatizaciones (opcional):** +950 € → pipeline automático, email triggers
- **Datos sincronizados:** nombre, email, teléfono, etapa actual, título interesado

## Dashboard dirección

Acceso completo a:
- Resumen de leads por etapa
- Ingresos por título
- Actividad por comercial
- Reportes de conversión

## Pendientes de confirmar

- [ ] Integración exacta Mailchimp/Brevo — ¿campos adicionales? ¿lista de contactos por título?
- [ ] ¿Las campañas de email son por título específico o segmentadas por otra lógica?
- [ ] ¿Historial de lead (cuándo cambió de etapa) visible para todos o solo dirección?
