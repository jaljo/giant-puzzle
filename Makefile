.PHONY:
cp-env:
	cp .env.dist .env

.PHONY:
install-deps:
	docker-compose run --rm app yarn install

.PHONY:
dev: cp-env install-deps

.PHONY:
start:
	docker-compose up

.PHONY:
test:
	docker-compose run --rm app yarn test

.PHONY:
build:
	docker-compose run --rm app yarn build
