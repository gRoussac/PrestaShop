# install-ui

Vue 3 + Vite source for the web installer. **Build-only** — not served, not included in release zips.

```bash
make install-ui
# or: cd install-ui && npm ci && npm run build
```

Output is committed under `install-dev/theme/` (`js/install-app.js`, `css/install-app.css`). The install path never runs `npm`.

Do not expose this directory on a web server. A root `.htaccess` denies HTTP access if the tree is uploaded by mistake.
