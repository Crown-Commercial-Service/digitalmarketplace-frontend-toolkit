SHELL := /bin/bash
VIRTUALENV_ROOT := $(shell [ -z $$VIRTUAL_ENV ] && echo $$(pwd)/venv || echo $$VIRTUAL_ENV)

virtualenv:
	[ -z $$VIRTUAL_ENV ] && [ ! -d venv ] && virtualenv -p python3 venv || true

requirements: virtualenv
	${VIRTUALENV_ROOT}/bin/pip install -r pages_builder/requirements.txt

npm_install:
	npm install

npm_copy:
	npm run copy

npm_clean:
	npm run clean

test: npm_install
	npm test

generate_pages: requirements npm_install npm_clean npm_copy
	${VIRTUALENV_ROOT}/bin/python pages_builder/generate_pages.py

serve_pages: generate_pages
	cd pages && ${VIRTUALENV_ROOT}/bin/python ../server.py

watch_for_changes: generate_pages
	${VIRTUALENV_ROOT}/bin/python pages_builder/watch_for_changes.py
