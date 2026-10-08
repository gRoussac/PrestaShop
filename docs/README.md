# GregoShop (personal fork)

This repository is a **personal fork** of [PrestaShop/PrestaShop](https://github.com/PrestaShop/PrestaShop). It is not the official PrestaShop project.

PrestaShop is a e-commerce platform, both through modules and themes. Developers can override the default components and behaviors. **That is the purpose of this fork:** customize and override core components and behaviors for personal / shop use, while tracking upstream `9.x.x` on the integration branch `dev`.

## What this fork is for

- Track upstream PrestaShop `9.x.x` on branch `dev`
- Carry shop-oriented fixes and overrides (installer, cookies, FO/BO behavior, and related core changes)

## What this fork is not

- Not the canonical source for PrestaShop releases

## Branches

| Branch                                 | Role                                                   |
| -------------------------------------- | ------------------------------------------------------ |
| `dev`                                  | Default integration branch (based on upstream `9.x.x`) |
| `9.2.x`                                | Mirror of upstream `9.2.x`                             |
| `feat/*`, `fix/*`, `docs/*`, `chore/*` | Topic branches opened as PRs into `dev`                |

## Requirements

Same baseline as upstream PrestaShop 9:

- PHP 8.1+
- MySQL 5.6+ (or MariaDB / Percona equivalent)
- Apache or Nginx

## License

Same license terms as upstream PrestaShop. See [LICENSE](../LICENSE).
