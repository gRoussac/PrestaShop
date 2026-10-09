SHELL := /bin/bash
ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/..)

DOCKER_COMP = docker compose -f $(ROOT)/docker/docker-compose.yml --project-directory $(ROOT)
PHP_CONT =
PHP_CONT_WITH_LOGIN = bash

# Prefer container PHP when the stack is already up
DOCKER_RUNNING := $(shell $(DOCKER_COMP) ps -q 2>/dev/null)
ifneq ($(strip $(DOCKER_RUNNING)),)
	PHP_CONT = $(DOCKER_COMP) exec -T prestashop-git runuser -u www-data -g www-data --
	PHP_CONT_WITH_LOGIN = $(DOCKER_COMP) exec -T prestashop-git runuser -u www-data -g www-data -- bash -l
endif

PHP      = $(PHP_CONT) php
COMPOSER = $(PHP_CONT) composer
SYMFONY  = $(PHP_CONT) bin/console
