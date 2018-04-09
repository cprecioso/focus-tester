next := npx next
serve := npx serve
watch := npx watch
netlify := npx netlify-cli

.PHONY: all
all: export

.PHONY: clean
clean:
	rm -rf out .next

.PHONY: bootstrap
bootstrap: node_modules

node_modules: package.json
	yarn install

.PHONY: dev
dev: node_modules
	$(next) dev

.PHONY: build
build: .next/BUILD_ID
.next/BUILD_ID: node_modules next.config.js pages/* src/**/*
	$(next) build

.PHONY: start
start: .next/BUILD_ID
	$(next) start

.PHONY: export
export: out
out: .next/BUILD_ID
	$(next) export

.PHONY: serve
serve: out
	$(serve) out

.PHONY: watch
watch:
	$(watch) make pages

.PHONY: deploy
deploy: out
	$(netlify) deploy -p out
