install:
	install-deps

install-deps:
	npm ci

build:
	npm run build

dev:
	npm run dev

start:
	npm run start

lint:
	npx eslint .