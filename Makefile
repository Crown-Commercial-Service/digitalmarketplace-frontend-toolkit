SHELL := /bin/bash

virtualenv:
	[ -z $$VIRTUAL_ENV ] && virtualenv venv || true

requirements: virtualenv
	pip install -r pages_builder/requirements.txt

generate_pages: requirements
	python pages_builder/generate_pages.py

serve_pages: generate_pages
	cd pages && python -m SimpleHTTPServer

watch_for_changes: generate_pages
	python pages_builder/watch_for_changes.py
