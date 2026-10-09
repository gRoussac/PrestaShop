.PHONY: test test-unit test-integration test-integration-behaviour test-api-module

test: ## Run all tests
	$(COMPOSER) run test-all

test-unit: ## Run unit tests
	$(COMPOSER) run unit-tests

test-integration: ## Run integration tests
	$(COMPOSER) run integration-tests

test-integration-behaviour: ## Run behaviour tests
	$(COMPOSER) run integration-behaviour-tests

test-api-module: ## Run API module tests
	$(COMPOSER) run api-module-tests
