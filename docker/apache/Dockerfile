# Apache httpd 2.4. Bump when Hub ships a newer 2.4.x.
FROM httpd:2.4-bookworm

RUN sed -i \
  -e 's/^#\(LoadModule .*mod_proxy.so\)/\1/' \
  -e 's/^#\(LoadModule .*mod_proxy_fcgi.so\)/\1/' \
  -e 's/^#\(LoadModule .*mod_rewrite.so\)/\1/' \
  -e 's/^#\(LoadModule .*mod_headers.so\)/\1/' \
  -e 's/^#\(LoadModule .*mod_expires.so\)/\1/' \
  -e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
  -e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
  /usr/local/apache2/conf/httpd.conf \
  && printf '\nInclude conf/extra/gregoshop.conf\n' >> /usr/local/apache2/conf/httpd.conf

COPY gregoshop.conf /usr/local/apache2/conf/extra/gregoshop.conf
COPY certs/ /usr/local/apache2/conf/certs/
