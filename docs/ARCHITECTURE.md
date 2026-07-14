# Arquitectura · Malta Campus

Monorepo, un solo backend Express compartido por los 3 frontends, una sola base PostgreSQL. Justificación: ~10 usuarios internos máximo, un dev puede mantenerlo (ver CLAUDE.md raíz).

```
Malta/
  apps/
    web-lms/        React+TS — público + alumnos
    web-crm/         React+TS — interno, comercial
    web-intranet/    React+TS — interno, todos los roles
  server/            Node+Express+TS — API única, módulos por dominio
  infra/             docker-compose + nginx
  docs/
```

Roles (enum `user_role` en Postgres): admin, profesor, comercial, gestor_andorra, alumno.

## Pendiente (bloquea desarrollo de detalle, no el scaffold)
1. Cerrar con el usuario: campos exactos del CRM (`próximos pasos` #1 en CLAUDE.md raíz)
2. Cerrar con el usuario: estructura de roles/permisos de la Intranet (`próximos pasos` #2)
3. Dominio comprado → apuntar DNS al VPS → activar certbot en `infra/nginx/nginx.conf`
