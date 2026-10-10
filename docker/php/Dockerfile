# PHP 8.4 FPM. Bump patch when Hub ships a newer 8.4.x-fpm.
# ICU is built from upstream sources so intl matches Symfony's bundled data (78.3).
# Debian bookworm only ships ICU 72.x, which fails the PrestaShop web installer check.
FROM php:8.4-fpm-bookworm

ARG ICU_VERSION=78.3
ARG ICU_TAG=release-78.3
ARG ICU_TARBALL=icu4c-78.3-sources.tgz

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git unzip curl ca-certificates make g++ \
    libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev \
    libzip-dev libxml2-dev \
  && curl -fsSL -o /tmp/icu.tgz \
    "https://github.com/unicode-org/icu/releases/download/${ICU_TAG}/${ICU_TARBALL}" \
  && mkdir -p /tmp/icu-src \
  && tar -xzf /tmp/icu.tgz -C /tmp/icu-src \
  && cd /tmp/icu-src/icu/source \
  && ./configure --prefix=/usr/local --disable-samples --disable-tests \
  && make -j"$(nproc)" \
  && make install \
  && echo /usr/local/lib > /etc/ld.so.conf.d/local-icu.conf \
  && ldconfig \
  && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
  && PKG_CONFIG_PATH=/usr/local/lib/pkgconfig docker-php-ext-configure intl \
  && PKG_CONFIG_PATH=/usr/local/lib/pkgconfig docker-php-ext-install \
    gd intl mysqli pdo_mysql zip bcmath soap \
  && rm -rf /tmp/icu-src /tmp/icu.tgz /var/lib/apt/lists/* \
  && sed -i \
    -e 's/^user = www-data/user = 1000/' \
    -e 's/^group = www-data/group = 1000/' \
    /usr/local/etc/php-fpm.d/www.conf \
  && (getent group 1000 >/dev/null || groupadd --gid 1000 app) \
  && (id -u 1000 >/dev/null 2>&1 || useradd --uid 1000 --gid 1000 --home-dir /var/www --shell /bin/bash app)

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY php.ini /usr/local/etc/php/conf.d/gregoshop.ini

WORKDIR /var/www/html
