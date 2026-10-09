.PHONY: docker-build docker-up docker-start docker-restart docker-down docker-logs docker-sh

docker-build: ## Build Docker images
	COMPOSE_BAKE=true $(DOCKER_COMP) build --pull --no-cache

docker-up: ## Start containers (detached)
	$(DOCKER_COMP) up --detach --force-recreate --remove-orphans

docker-start: docker-build docker-up ## Build and start containers

docker-restart: docker-down docker-start ## Restart containers

docker-down: ## Stop containers
	$(DOCKER_COMP) down --remove-orphans

docker-logs: ## Follow container logs
	$(DOCKER_COMP) logs --follow

docker-sh: ## Shell as www-data in the PHP container
	@$(DOCKER_COMP) exec -it prestashop-git runuser -u www-data -g www-data -- bash -l
