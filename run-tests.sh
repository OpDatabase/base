#!/bin/sh

set -e

export TEST_PG_DB_PORT=5433
export TEST_PG_DB_NAME=test-opdb
export TEST_PG_USER=test-opdb
export TEST_PG_PASSWORD=test-opdb
export TEST_PG_DB_URL="postgres://$TEST_PG_USER:$TEST_PG_PASSWORD@127.0.0.1:$TEST_PG_DB_PORT/$TEST_PG_DB_NAME"

(docker kill $TEST_PG_DB_NAME || true) > /dev/null 2> /dev/null
docker run \
  --name $TEST_PG_DB_NAME \
  --detach --rm \
  -e POSTGRES_PASSWORD=$TEST_PG_PASSWORD \
  -e POSTGRES_USER=$TEST_PG_USER \
  -p $TEST_PG_DB_PORT:5432 \
  postgres \
  > /dev/null

sleep 5

# shellcheck disable=SC2068
yarn jest --config jest.config.js --runInBand $@

docker kill $TEST_PG_DB_NAME > /dev/null
