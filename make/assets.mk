.PHONY: assets wait-assets admin front admin-default admin-new-theme front-core front-default install-ui

assets: ## Build all assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh all --force

install-ui: ## Build installer Vue UI into install-dev/theme (dev-only source: install-ui/)
	cd $(ROOT)/install-ui && npm ci && npm run build

wait-assets: ## Wait until assets are built
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/wait-build.sh

admin: ## Build all admin assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-default --force
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-new-theme --force

front: ## Build all front assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-core --force
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-default --force

admin-default: ## Build default admin theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-default --force

admin-new-theme: ## Build new admin theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-new-theme --force

front-core: ## Build core theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-core --force

front-default: ## Build FO default theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-default --force
