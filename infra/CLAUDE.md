# infra/

Orquestación Docker para despliegue en el VPS.

- `docker-compose.yml` — postgres + api + 3 frontends + nginx (reverse proxy)
- `nginx/nginx.conf` — enrutado por subdominio: uclcampus.com (LMS), crm.uclcampus.com, intranet.uclcampus.com. SSL vía certbot pendiente de activar una vez el DNS del dominio apunte al VPS.

Levantar todo: `docker compose --env-file ../.env up -d --build` desde esta carpeta (o desde el VPS tras clonar el repo).
