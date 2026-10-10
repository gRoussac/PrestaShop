.PHONY: cs-fixer cs-fixer-dry phpstan scss-fixer es-linter

cs-fixer: ## Run php-cs-fixer
	$(COMPOSER) run php-cs-fixer

cs-fixer-dry: ## Run php-cs-fixer (dry-run)
	$(COMPOSER) run php-cs-fixer:dry

phpstan: ## Run PHPStan
	$(COMPOSER) run phpstan

scss-fixer: ## Run SCSS fixers
	$(PHP_CONT_WITH_LOGIN) -c "cd admin-dev/themes/new-theme && (test -d node_modules || npm install) && npm run scss-fix"
	$(PHP_CONT_WITH_LOGIN) -c "cd admin-dev/themes/default && (test -d node_modules || npm install) && npm run scss-fix"
	$(PHP_CONT_WITH_LOGIN) -c "cd themes/default && (test -d node_modules || npm install) && npm run scss-fix"

es-linter: ## Run ES lint-fix
	$(PHP_CONT_WITH_LOGIN) -c "cd admin-dev/themes/new-theme && (test -d node_modules || npm install) && npm run lint-fix"
	$(PHP_CONT_WITH_LOGIN) -c "cd admin-dev/themes/default && (test -d node_modules || npm install) && npm run lint-fix"
	$(PHP_CONT_WITH_LOGIN) -c "cd themes/default && (test -d node_modules || npm install) && npm run lint-fix"
	$(PHP_CONT_WITH_LOGIN) -c "cd themes && (test -d node_modules || npm install) && npm run lint-fix"
