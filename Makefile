SHELL := /bin/bash
VIRTUALENV_ROOT := $(shell [ -z $$VIRTUAL_ENV ] && echo $$(pwd)/venv || echo $$VIRTUAL_ENV)

virtualenv:
	[ -z $$VIRTUAL_ENV ] && [ ! -d venv ] && virtualenv venv || true

requirements: virtualenv
	${VIRTUALENV_ROOT}/bin/pip install -r pages_builder/requirements.txt

generate_pages: requirements
	${VIRTUALENV_ROOT}/bin/python pages_builder/generate_pages.py

serve_pages: generate_pages
	cd pages && ${VIRTUALENV_ROOT}/bin/python -m SimpleHTTPServer

watch_for_changes: generate_pages
	${VIRTUALENV_ROOT}/bin/python pages_builder/watch_for_changes.py
