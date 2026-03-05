#!/bin/sh
set -e
# Create storage dirs for uploads (e.g. hero background); fix permissions when using host-mounted volume
mkdir -p /var/www/html/storage/app/public/hero /var/www/html/storage/app/public/about /var/www/html/storage/app/public/artists /var/www/html/storage/app/public/works /var/www/html/storage/app/public/info
chown -R www-data:www-data /var/www/html/storage
# Symlink public/storage -> storage/app/public so /storage/hero/xxx.jpg is served
php artisan storage:link 2>/dev/null || true
exec gosu www-data "$@"
