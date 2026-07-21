# Runbook de despliegue — día 1

Pasos exactos, en orden, para pasar de "código en el repo" a "sistema corriendo en uclcampus.com".

## 0. Prerrequisitos de este runbook
- Dominio comprado (uclcampus.com)
- VPS creado (DigitalOcean/Hetzner), con Docker y Docker Compose instalados
- Acceso SSH al VPS

## 1. Apuntar el DNS
IMPORTANTE: `uclcampus.com` y `www` NO se tocan — la landing pública vive en
GitHub Pages (con el prerender multiidioma y su SEO) y ahí se queda. El VPS
solo sirve la API, el CRM y la Intranet en subdominios.

En Hostinger (hPanel → DNS de uclcampus.com, o vía API MCP), crear solo:
```
api.uclcampus.com      A   <IP_VPS>
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
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)"
echo "JWT_SECRET=$(openssl rand -base64 48)"
# pegar esos valores en infra/.env — CORS_ORIGIN y COOKIE_DOMAIN ya vienen
# rellenos en el .env.example con los subdominios correctos, revisar que
# coincidan con el dominio real antes de continuar.
```
El servidor falla al arrancar si falta cualquiera de `POSTGRES_PASSWORD`, `JWT_SECRET` o `CORS_ORIGIN` — es intencional, mejor que arrancar con un secreto público del repo.

## 4. Primer arranque (sin TLS todavía)
El bloque HTTPS de nginx necesita certificados que aún no existen — por eso el primer `up` es solo para tener HTTP funcionando y poder pasar el reto ACME de certbot en el paso 6.
```bash
docker compose --env-file .env up -d --build postgres api web-crm web-intranet
docker compose ps   # todos deben acabar "healthy"
```
Si algún servicio no llega a "healthy", revisar logs: `docker compose logs <servicio>`.
No levantar aún el contenedor `nginx` — sin certificados en `/etc/letsencrypt/live/uclcampus.com/`, fallará al arrancar (el bloque `listen 443 ssl` referencia archivos que todavía no existen).

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
`nginx.conf` (el definitivo) ya trae los bloques 443 con `ssl_certificate` apuntando a `/etc/letsencrypt/live/uclcampus.com/`, pero nginx no arranca si esos archivos no existen — hay que emitir los certificados primero con un config "bootstrap" que solo sirve el reto ACME.

```bash
# 6.1 Arrancar nginx con el config bootstrap (solo HTTP, sin TLS)
docker compose --env-file .env run -d --name nginx-bootstrap \
  -v $(pwd)/nginx/nginx.bootstrap.conf:/etc/nginx/nginx.conf:ro \
  -v certbot_www:/var/www/certbot \
  -p 80:80 nginx nginx -g "daemon off;"

# 6.2 Pedir el certificado (webroot, usa el volumen que nginx-bootstrap está sirviendo)
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d crm.uclcampus.com -d intranet.uclcampus.com -d api.uclcampus.com \
  --email <tu-email> --agree-tos --non-interactive

# 6.3 Parar el bootstrap y levantar el nginx definitivo (ya con 443 + certs reales)
docker stop nginx-bootstrap && docker rm nginx-bootstrap
docker compose --env-file .env up -d nginx
```
Verificar: `docker compose logs nginx` no debe mostrar errores de `ssl_certificate`.

### Renovación automática
Let's Encrypt caduca a los 90 días. Programar en el VPS (fuera de Docker, en el propio cron del sistema):
```bash
# crontab -e
17 3 * * 1  cd /ruta/al/repo/infra && docker compose run --rm certbot renew --webroot -w /var/www/certbot -q && docker compose restart nginx
```

## 7. Verificación final
- `curl -I https://crm.uclcampus.com/` → `200`, con cabecera `Strict-Transport-Security` presente
- `curl -X POST https://api.uclcampus.com/api/auth/login -d '{}' -H 'Content-Type: application/json'` → `400` con detalle de validación (confirma que la API responde a través del proxy)
- Login en https://crm.uclcampus.com y https://intranet.uclcampus.com con el admin creado en el paso 5
- Revisar que `docker compose logs -f` no muestre errores en bucle
- (Nota: `/health` del backend es solo para el healthcheck interno de Docker, nginx no lo expone públicamente a propósito)

## 8. Fase 2 — reconectar la landing (GitHub Pages) con la API del VPS
La landing sigue en GitHub Pages; una vez la API esté en vivo:
1. **Chatbot**: definir `VITE_API_BASE=https://api.uclcampus.com/api` en el build
   de la landing (en `.github/workflows/deploy-landing.yml`, paso de build) y
   poner `ANTHROPIC_API_KEY` (con saldo) en `infra/.env` del VPS. El widget de
   chat solo se monta cuando `VITE_API_BASE` existe (ver `Home.tsx`), así que
   con eso reaparece solo.
2. **Formulario de contacto**: hoy envía por FormSubmit (formsubmit.co) a
   info@uclcampus.com. Cuando la API esté en vivo, crear un endpoint
   `POST /api/contact` (con rate limit, como /api/chat) que envíe el email
   desde el propio dominio, y cambiar el fetch de
   `apps/web-lms/src/components/ContactForm.tsx` (la constante ENDPOINT).
3. `CORS_ORIGIN` de infra/.env ya incluye `https://uclcampus.com` — sin eso el
   navegador bloquearía las llamadas de la landing a api.uclcampus.com.

## Pendiente conocido (no bloquea el despliegue, pero falta)
- Pasarela de pago, SEO técnico/on-page, AEO, GDPR (alcance LMS original, no iniciado)
- Campos exactos de CRM e Intranet — pendientes de las respuestas del cliente al cuestionario
- Renovación automática de certbot (cron/systemd timer) — el comando del paso 6 es manual, hay que programarlo o usar `certbot renew` en un cron semanal
