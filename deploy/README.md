# SORA Tattoo – serverio paruošimas ir deployment

Serveris: Ubuntu 24.04, Nginx, PHP 8.2+, MySQL, Laravel API. Domenas: **api.soratattoo.de**.

---

## 1. Pirmas prisijungimas

```bash
ssh root@<SERVER_IP>
# arba jei sukūrei user: ssh deploy@<SERVER_IP>
```

Pakeisk `<SERVER_IP>` į savo serverio IPv4 (pvz. iš Hetzner Cloud).

---

## 2. Atnaujinti sistemą ir įdiegti pagrindinius paketus

```bash
apt update && apt upgrade -y
apt install -y curl git unzip software-properties-common
```

---

## 3. PHP 8.2+

```bash
add-apt-repository -y ppa:ondrej/php
apt update
apt install -y php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip php8.2-gd
php -v
```

---

## 4. Composer

```bash
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
composer -V
```

---

## 5. MySQL

```bash
apt install -y mysql-server
mysql_secure_installation
# Nustatyk root slaptažodį, atsakymus į klausimus gali palikti default (Y).
```

Sukurti DB ir vartotoją Laravel:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE sora_tattoo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sora'@'localhost' IDENTIFIED BY 'TavoSlaptasSlaptazodis';
GRANT ALL PRIVILEGES ON sora_tattoo.* TO 'sora'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 6. Nginx + SSL (Let's Encrypt)

```bash
apt install -y nginx certbot python3-certbot-nginx
```

**Rate limit (apsauga nuo botų):** į `http { }` bloką pridėk include. Redaguok `/etc/nginx/nginx.conf`:

```bash
nano /etc/nginx/nginx.conf
```

Viduje `http {` ... `}` pridėk vieną eilutę (pvz. po `include /etc/nginx/mime.types;`):

```
include /etc/nginx/snippets/sora-rate-limit.conf;
```

Sukurk snippet ir vhost:

```bash
mkdir -p /etc/nginx/snippets
# Nukopijuok deploy/nginx/snippet-rate-limit.conf → /etc/nginx/snippets/sora-rate-limit.conf
```

Nukopijuok Nginx vhost į `/etc/nginx/sites-available/api.soratattoo.de.conf`, įjunk, paleisk certbot:

```bash
ln -s /etc/nginx/sites-available/api.soratattoo.de.conf /etc/nginx/sites-enabled/
# Ištrink default jei nori: rm /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
certbot --nginx -d api.soratattoo.de
```

Certbot pridės HTTPS ir redirect 80→443. **Po certbot** atidaryk tą patį vhost failą ir **443 server {} bloke** (po `server_name`) pridėk rate limit:

```
limit_req zone=api_limit burst=20 nodelay;
limit_req_status 429;
```

Tada `nginx -t && systemctl reload nginx`.

---

## 7. Laravel projekto deploy

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/boriskip/sora-tattoo.git repo
cd repo/backend
```

Arba deploy tik `backend/` (rsync iš savo kompo):

```bash
# Iš savo kompo (lokaliai):
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='storage/logs/*' --exclude='.env' ./backend/ root@<SERVER_IP>:/var/www/sora-tattoo-api/
```

Serveryje:

```bash
cd /var/www/sora-tattoo-api   # arba /var/www/repo/backend
cp .env.example .env
nano .env
```

`.env` pavyzdys (produkcijai):

```env
APP_NAME="SORA Tattoo API"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.soratattoo.de

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sora_tattoo
DB_USERNAME=sora
DB_PASSWORD=TavoSlaptasSlaptazodis

# Frontend (CORS jau įtrauktas config/cors.php)
# Session / Sanctum – palik default arba nustatyk domain
SESSION_DOMAIN=api.soratattoo.de
SANCTUM_STATEFUL_DOMAINS=soratattoo.de,www.soratattoo.de
```

```bash
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
php artisan config:cache
php artisan route:cache
```

Jei naudoji `storage/app/public` (nuotraukos ir t.t.):

```bash
php artisan storage:link
```

---

## 8. Fail2ban (apsauga nuo brute-force)

```bash
apt install -y fail2ban
```

Nukopijuok konfigą iš šio repo:

```bash
# Iš projekto (jei clone į /var/www/repo):
cp /var/www/repo/deploy/fail2ban/jail.local /etc/fail2ban/jail.d/sora-tattoo.conf
# arba ranka sukurti /etc/fail2ban/jail.d/sora-tattoo.conf pagal deploy/fail2ban/jail.local
```

Tada:

```bash
systemctl enable fail2ban
systemctl start fail2ban
systemctl status fail2ban
fail2ban-client status sshd
```

---

## 9. Apsauga nuo botų (Nginx rate limit + Fail2ban)

- **Rate limiting** jau įtrauktas į `deploy/nginx/snippet-rate-limit.conf` – įtrauk tą `include` į savo Nginx server {} bloką.
- **Fail2ban** nginx jails (optional): naudok `deploy/fail2ban/nginx-limit-req.conf` ir `filter`, jei nori blokuoti IP, kurie viršija limitą.

Žiūrėk failus:
- `deploy/nginx/api.soratattoo.de.conf`
- `deploy/nginx/snippet-rate-limit.conf`
- `deploy/fail2ban/jail.local`

---

## 10. DNS

Įsitikink, kad **api.soratattoo.de** A įrašas nukreiptas į šio serverio IPv4 (Hetzner serverio IP).

---

## 11. Naudingos komandos

```bash
# Nginx logai
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Laravel logai
tail -f /var/www/sora-tattoo-api/storage/logs/laravel.log

# Fail2ban
fail2ban-client status
fail2ban-client status sshd
fail2ban-client set sshd unbanip <IP>

# PHP-FPM restart
systemctl restart php8.2-fpm
```

---

## Failų vieta repozitorijoje

| Kas | Kur |
|-----|-----|
| Nginx vhost pavyzdys | `deploy/nginx/api.soratattoo.de.conf` |
| Rate limit (bot apsauga) | `deploy/nginx/snippet-rate-limit.conf` |
| Fail2ban jail | `deploy/fail2ban/jail.local` |
| Fail2ban nginx filter (optional) | `deploy/fail2ban/nginx-limit-req.conf` |
| Nginx bot block (optional)      | `deploy/nginx/snippet-block-bots.conf` (map į http {}, if į server {}) |
