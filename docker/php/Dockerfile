# PHP 8.4 FPM. Bump patch when Hub ships a newer 8.4.x-fpm.
FROM php:8.4-fpm-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git unzip curl \
    libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev \
    libzip-dev libicu-dev libxml2-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
  && docker-php-ext-install \
    gd intl mysqli pdo_mysql zip bcmath soap \
  && rm -rf /var/lib/apt/lists/* \
  && sed -i \
    -e 's/^user = www-data/user = 1000/' \
    -e 's/^group = www-data/group = 1000/' \
    /usr/local/etc/php-fpm.d/www.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY php.ini /usr/local/etc/php/conf.d/gregoshop.ini

WORKDIR /var/www/html
