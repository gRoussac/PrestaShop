SHELL := /bin/bash
ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/..)

DOCKER_COMP = docker compose -f $(ROOT)/docker/docker-compose.yml --project-directory $(ROOT)
PHP_SERVICE = php
PHP_CONT =
PHP_CONT_WITH_LOGIN = bash

# PHP-FPM runs as uid/gid 1000 (see docker/php/Dockerfile). Exec as that user so
# composer/npm do not leave root-owned trees that break the web installer.
PHP_UID ?= 1000
PHP_GID ?= 1000

# Prefer container PHP when the stack is already up
DOCKER_RUNNING := $(shell $(DOCKER_COMP) ps -q $(PHP_SERVICE) 2>/dev/null)
ifneq ($(strip $(DOCKER_RUNNING)),)
	PHP_CONT = $(DOCKER_COMP) exec -T -u $(PHP_UID):$(PHP_GID) $(PHP_SERVICE)
	PHP_CONT_WITH_LOGIN = $(DOCKER_COMP) exec -T -u $(PHP_UID):$(PHP_GID) $(PHP_SERVICE) bash
endif

PHP      = $(PHP_CONT) php
COMPOSER = $(PHP_CONT) composer
SYMFONY  = $(PHP_CONT) bin/console
