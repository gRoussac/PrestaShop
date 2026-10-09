.PHONY: assets wait-assets admin front admin-default admin-new-theme front-core front-classic front-hummingbird

assets: ## Build all assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh all --force

wait-assets: ## Wait until assets are built
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/wait-build.sh

admin: ## Build all admin assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-default --force
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-new-theme --force

front: ## Build all front assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-core --force
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-classic --force
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-hummingbird --force

admin-default: ## Build default admin theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-default --force

admin-new-theme: ## Build new admin theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh admin-new-theme --force

front-core: ## Build core theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-core --force

front-classic: ## Build classic theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-classic --force

front-hummingbird: ## Build hummingbird theme assets
	$(PHP_CONT_WITH_LOGIN) ./tools/assets/build.sh front-hummingbird --force
