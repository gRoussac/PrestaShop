.PHONY: install install-prestashop composer cc

install: composer cc assets ## Install PHP deps and build assets

install-prestashop: ## Fresh shop DB install (containers must be running)
	$(PHP_CONT) docker/install/database.sh

composer: ## Install PHP dependencies
	$(COMPOSER) install --no-interaction

cc: ## Clear Symfony cache
	$(SYMFONY) cache:clear --no-warmup
