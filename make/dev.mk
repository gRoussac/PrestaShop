.PHONY: install install-prestashop composer cc

install: composer cc assets ## Install PHP deps and build assets

install-prestashop: ## Fresh shop DB install (containers must be running)
	$(PHP_CONT) sh docker/install/database.sh

composer: ## Install PHP dependencies (as FPM uid when Docker is up)
	$(COMPOSER) install --no-interaction
ifneq ($(strip $(DOCKER_RUNNING)),)
	@$(MAKE) docker-fix-perms
endif

cc: ## Clear Symfony cache
	$(SYMFONY) cache:clear --no-warmup
