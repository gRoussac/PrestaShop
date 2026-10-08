# gRoussac / PrestaShop (personal fork)

This repository is a **personal fork** of [PrestaShop/PrestaShop](https://github.com/PrestaShop/PrestaShop). It is not the official PrestaShop project.

PrestaShop is a very extensible e-commerce platform, both through modules and themes. Developers can override the default components and behaviors. **That is the purpose of this fork:** customize and override core components and behaviors for personal / shop use, while tracking upstream `9.2.x` on the integration branch `dev`.

## What this fork is for

- Track upstream PrestaShop `9.2.x` on branch `dev`
- Carry shop-oriented fixes and overrides (installer, cookies, FO/BO behavior, and related core changes)
- Keep local work separate from official PrestaShop contribution flow

## What this fork is not

- Not the canonical source for PrestaShop releases
- Not a drop-in substitute for the [official download](https://www.prestashop-project.org/releases/)
- Not where upstream issues or security reports should go by default

For the official product, docs, and community, use the [PrestaShop project](https://www.prestashop-project.org/) and [upstream repository](https://github.com/PrestaShop/PrestaShop).

## Branches

| Branch | Role |
| --- | --- |
| `dev` | Default integration branch (based on upstream `9.2.x`) |
| `9.2.x` | Mirror of upstream `9.2.x` |
| `feat/*`, `fix/*`, `docs/*`, `chore/*` | Topic branches opened as PRs into `dev` |

## Requirements

Same baseline as upstream PrestaShop 9:

- PHP 8.1+
- MySQL 5.6+ (or MariaDB / Percona equivalent)
- Apache or Nginx

See upstream [system requirements](https://devdocs.prestashop-project.org/9/basics/installation/system-requirements/).

## Local development

Development notes for this tree: [DEVELOPMENT.md](./DEVELOPMENT.md).

Docker quick start (same Makefile targets as upstream):

```bash
make docker-start
```

- Front office: `http://localhost:8001`
- Back office: `http://localhost:8001/admin-dev`

Default demo credentials (change them in real use):

- Email: `demo@prestashop.com`
- Password: `Pr3st4Sh0P`

## Overrides and extensibility

This fork leans on PrestaShop’s extension model:

- **Modules** and **themes** for shop-facing customization
- **Core overrides** (`override/`) and targeted core changes when default components or behaviors must differ from stock PrestaShop

Prefer overrides and modules when they are enough. Touch core only when the change belongs in this personal fork’s integration branch.

Official references:

- [Modules](https://devdocs.prestashop-project.org/9/modules/)
- [Themes](https://devdocs.prestashop-project.org/9/themes/)
- [DevDocs](https://devdocs.prestashop-project.org/)

## Upstream and security

- Upstream bugs and contributions: [PrestaShop/PrestaShop](https://github.com/PrestaShop/PrestaShop)
- Security: follow the [PrestaShop Bug Bounty / responsible disclosure](https://www.prestashop-project.org/security/bug-bounty/) process on the official project

## License

Same license terms as upstream PrestaShop. See [`docs/licenses`](./licenses/).
