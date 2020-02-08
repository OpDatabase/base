#!/bin/sh

set -e

export DB_PORT=5433
export DB_NAME=test-opdb
export POSTGRES_USER=test-opdb
export POSTGRES_PASSWORD=test-opdb

(docker kill $DB_NAME || true) > /dev/null 2> /dev/null
docker run \
  --name $DB_NAME \
  --detach --rm \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_USER=$POSTGRES_USER \
  -p $DB_PORT:5432 \
  postgres \
  > /dev/null

sleep 5

# postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
export DATABASE_URL="postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@127.0.0.1:$DB_PORT/${DB_NAME}"

# shellcheck disable=SC2068
DATABASE_LOGGING="error,warn" yarn jest --config jest.config.js --runInBand $@

docker kill $DB_NAME > /dev/null
