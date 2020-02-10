#!/bin/sh

set -e

# Start PostgreSQL
export TEST_PG_DB_PORT=5433
export TEST_PG_DOCKER_NAME=test-opdb-pg
export TEST_PG_DB_NAME=test-opdb
export TEST_PG_USER=test-opdb
export TEST_PG_PASSWORD=test-opdb
export TEST_PG_DB_URL="postgres://$TEST_PG_USER:$TEST_PG_PASSWORD@127.0.0.1:$TEST_PG_DB_PORT/$TEST_PG_DB_NAME"

(docker kill $TEST_PG_DOCKER_NAME || true) > /dev/null 2> /dev/null
docker run \
  --name $TEST_PG_DOCKER_NAME \
  --detach --rm \
  -e POSTGRES_PASSWORD=$TEST_PG_PASSWORD \
  -e POSTGRES_USER=$TEST_PG_USER \
  -p $TEST_PG_DB_PORT:5432 \
  postgres \
  > /dev/null

# Start MySQL
export TEST_MYSQL_DB_PORT=3307
export TEST_MYSQL_DOCKER_NAME=test-opdb-mysql
export TEST_MYSQL_DB_NAME=test-opdb
export TEST_MYSQL_USER=test-opdb
export TEST_MYSQL_PASSWORD=test-opdb
export TEST_MYSQL_DB_URL="mysql://$TEST_MYSQL_USER:$TEST_MYSQL_PASSWORD@127.0.0.1:$TEST_MYSQL_DB_PORT/$TEST_MYSQL_DB_NAME"

(docker kill $TEST_MYSQL_DOCKER_NAME || true) > /dev/null 2> /dev/null
docker run \
  --name $TEST_MYSQL_DOCKER_NAME \
  --detach --rm \
  -e MYSQL_DATABASE=$TEST_MYSQL_DB_NAME \
  -e MYSQL_USER=$TEST_MYSQL_USER \
  -e TEST_MYSQL_PASSWORD=$TEST_MYSQL_PASSWORD \
  -p $TEST_MYSQL_DB_PORT:3306 \
  mysql \
  > /dev/null

sleep 5

# shellcheck disable=SC2068
yarn jest --config jest.config.js --runInBand $@

# Kill docker container
docker kill $TEST_PG_DOCKER_NAME > /dev/null
docker kill $TEST_MYSQL_DOCKER_NAME > /dev/null
