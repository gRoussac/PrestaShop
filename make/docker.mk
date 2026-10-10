.PHONY: docker-build docker-up docker-start docker-stop docker-restart docker-down docker-logs docker-sh

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

docker-sh: ## Shell in the PHP container
	@$(DOCKER_COMP) exec -it $(PHP_SERVICE) bash
