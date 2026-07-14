# Especificación Intranet · Universidad Malta

**Versión:** 1.0 (confirmado 2026-07-10)  
**Estado:** Requisitos base cerrados, detalles flexibles post-launch

## Descripción general

Portal privado para personal interno con gestión documental por departamentos, tareas individuales y conjuntas, y permisos configurables por rol. Integración con LMS y CRM.

## Estructura de documentos

### Carpetas por departamento

Departamentos previstos (flexible):
- Administración
- Académico
- Comercial
- Soporte (Andorra)
- [Otros a definir según estructura real]

Cada carpeta puede contener: contratos, material docente, plantillas, actas, etc.

### Permisos: Role-based flexible

Los permisos se configuran **por rol**, no por usuario individual.

**Ejemplos (configurables post-launch):**
- Rol "Admin": ve todas las carpetas
- Rol "Profesor": ve Académico + Administración
- Rol "Comercial": ve Comercial + Administración
- Rol "Gestor Andorra": ve Soporte + Administración

Cada rol puede tener acceso a una carpeta (restricción simple) o varias (permiso flexible).

## Gestión de tareas

### Tipos de tareas

1. **Individuales:** asignadas a 1 persona
2. **Conjuntas/equipo:** asignadas a múltiples personas

### Ciclo de vida

- Crear tarea
- Asignar a persona(s)
- Cambiar estado (nuevo/en progreso/completado)
- Comentarios/notas

### Notificaciones (PENDIENTE ACLARAR)

Dos escenarios posibles — **confirmación pendiente:**
- Opción A: notificación por email cuando se asigna tarea / sube doc en Intranet
- Opción B: solo notificaciones in-app, sin email

## Diferencia: Campus Virtual vs Intranet

| Feature | Campus Virtual (LMS) | Intranet (Staff) |
|---------|---------------------|------------------|
| Documentos | Material docente | Contratos, plantillas, actas |
| Subida | Solo admin/profesor | **[PENDIENTE CERRAR]** |
| Tareas | Evaluaciones/exámenes | Tareas internas conjuntas |
| Acceso | Alumnos + staff | Solo staff |

## Opcional post go-live

- (+800 €) Gestión de tareas avanzada (dependencias, plazos, prioridades)
- (+600 €) Integración CRM en tiempo real (mostrar leads/alumnos en Intranet)
- (+500 €) Comunicaciones internas (chat, anuncios)

## Pendientes de confirmar

- [ ] Permisos de subida de documentos en Intranet — ¿solo admin? ¿admin + profesor? ¿todos?
- [ ] Notificaciones por email — ¿sí/no en tareas y documentos?
- [ ] Historial de cambios en documentos — ¿visible para todos o solo admin?
- [ ] Versioning de documentos — ¿mantener historial de cambios?
- [ ] Roles exactos — más allá de admin/profesor/comercial/gestor
