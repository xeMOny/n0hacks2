# Runbook de despliegue — día 1

Pasos exactos, en orden, para pasar de "código en el repo" a "sistema corriendo en uclcampus.com".

## 0. Prerrequisitos de este runbook
- Dominio comprado (uclcampus.com)
- VPS creado (DigitalOcean/Hetzner), con Docker y Docker Compose instalados
- Acceso SSH al VPS

## 1. Apuntar el DNS
En el panel del registrador, crear registros A apuntando a la IP del VPS:
```
uclcampus.com        A   <IP_VPS>
www.uclcampus.com     A   <IP_VPS>
crm.uclcampus.com      A   <IP_VPS>
intranet.uclcampus.com A   <IP_VPS>
```
La propagación puede tardar de minutos a un par de horas.

## 2. Clonar el repo en el VPS
```bash
git clone <url-del-repo> malta && cd malta
```

## 3. Generar secretos reales (nunca usar los de .env.example)
```bash
cd infra
cp ../.env.example .env
# sustituir los valores por otros generados, no dejar "changeme":
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)" 
echo "JWT_SECRET=$(openssl rand -base64 32)"
# pegar esos valores en infra/.env
```

## 4. Levantar los contenedores
```bash
docker compose --env-file .env up -d --build
docker compose ps   # todos deben acabar "healthy"
```
Si algún servicio no llega a "healthy", revisar logs: `docker compose logs <servicio>`.

## 5. Crear el primer usuario admin
Sin este paso nadie puede entrar a CRM/Intranet — el endpoint de creación de usuarios exige rol admin y todavía no existe ninguno.
```bash
docker compose run --rm \
  -e ADMIN_EMAIL=admin@uclcampus.com \
  -e ADMIN_PASSWORD="<password fuerte>" \
  api npm run seed:admin
```
Debe imprimir `Admin creado: admin@uclcampus.com`. Si se ejecuta dos veces, la segunda dice "Ya existe un admin" y no hace nada (es seguro).

## 6. Activar SSL (una vez el DNS ya resuelve al VPS)
```bash
docker run -it --rm \
  -v $(pwd)/nginx/certbot-etc:/etc/letsencrypt \
  -v $(pwd)/nginx/certbot-www:/var/www/certbot \
  -p 80:80 certbot/certbot certonly --standalone \
  -d uclcampus.com -d www.uclcampus.com -d crm.uclcampus.com -d intranet.uclcampus.com
```
Después, actualizar `nginx/nginx.conf` para servir en 443 con los certificados generados (bloques `listen 443 ssl;` + `ssl_certificate`/`ssl_certificate_key`) y recargar nginx: `docker compose restart nginx`.

## 7. Verificación final
- `curl https://uclcampus.com/api/health` → `{"status":"ok"}`
- Login en https://crm.uclcampus.com con el admin creado en el paso 5
- Revisar que `docker compose logs -f` no muestre errores en bucle

## Pendiente conocido (no bloquea el despliegue, pero falta)
- Pasarela de pago, SEO técnico/on-page, AEO, GDPR (alcance LMS original, no iniciado)
- Campos exactos de CRM e Intranet — pendientes de las respuestas del cliente al cuestionario
- Renovación automática de certbot (cron/systemd timer) — el comando del paso 6 es manual, hay que programarlo o usar `certbot renew` en un cron semanal
