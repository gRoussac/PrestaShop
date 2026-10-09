# Layout (GNU Make includes):
#   make/common.mk   - shared variables / Docker PHP detection
#   make/docker.mk   - Compose lifecycle
#   make/dev.mk      - install, Composer, cache
#   make/assets.mk   - FO / BO asset builds
#   make/test.mk     - PHP tests
#   make/quality.mk  - CS, PHPStan, SCSS/ES lint

include make/common.mk
include make/docker.mk
include make/dev.mk
include make/assets.mk
include make/test.mk
include make/quality.mk

.DEFAULT_GOAL := help

.PHONY: help

help: ## List available targets
	@grep -hE '(^[a-zA-Z0-9_./-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'
