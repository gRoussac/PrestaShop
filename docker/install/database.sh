#!/bin/sh
set -e

php "${PS_FOLDER_INSTALL:-install-dev}/index_cli.php" \
  --db_server="${DB_SERVER:-mysql}:${DB_PORT:-3306}" \
  --db_user="${DB_USER:-root}" \
  --db_password="${DB_PASSWD:-prestashop}" \
  --db_name="${DB_NAME:-prestashop}" \
  --prefix="${DB_PREFIX:-ps_}" \
  --domain="${PS_DOMAIN:-localhost:8001}" \
  --ssl="${PS_ENABLE_SSL:-0}" \
  --firstname="${ADMIN_FIRSTNAME:-John}" \
  --lastname="${ADMIN_LASTNAME:-Doe}" \
  --email="${ADMIN_MAIL:-demo@prestashop.com}" \
  --password="${ADMIN_PASSWD:-Pr3st4Sh0P}" \
  --language="${PS_LANGUAGE:-en}" \
  --country="${PS_COUNTRY:-fr}" \
  --all_languages="${PS_ALL_LANGUAGES:-0}" \
  --newsletter=0 \
  --send_email=0 \
  --fixtures="${PS_INSTALL_DEMO_PRODUCTS:-1}"
