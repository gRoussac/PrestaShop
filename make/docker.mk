.PHONY: docker-build docker-up docker-start docker-stop docker-restart docker-down docker-logs docker-sh docker-fix-perms

docker-build: ## Build Docker images
	COMPOSE_BAKE=true $(DOCKER_COMP) build --pull --no-cache

docker-up: ## Start containers (detached)
	$(DOCKER_COMP) up --detach --remove-orphans

docker-start: docker-build docker-up ## Build and start containers

docker-stop: ## Stop containers (keep them)
	$(DOCKER_COMP) stop

docker-restart: docker-stop docker-up ## Restart containers

docker-down: ## Stop and remove containers
	$(DOCKER_COMP) down --remove-orphans

docker-logs: ## Follow container logs
	$(DOCKER_COMP) logs --follow

docker-sh: ## Shell in the PHP container (uid 1000, same as FPM)
	@$(DOCKER_COMP) exec -it -u $(PHP_UID):$(PHP_GID) $(PHP_SERVICE) bash

# Root-owned vendor/modules from a root composer break the web installer write checks.
docker-fix-perms: ## chown shop writable trees to PHP-FPM uid/gid (1000)
	$(DOCKER_COMP) exec -T $(PHP_SERVICE) chown -R $(PHP_UID):$(PHP_GID) \
		modules themes var app/config img download upload config translations mails override vendor
