#!/bin/sh

baseDir=$(pwd)

# Clean latest build
rm -rf ./dist
rm -rf ./src/base/node_modules
rm -rf ./src/adapter/postgres/node_modules

# Main files
yarn

# @opdb/base
cd ./src/base
yarn
yarn build
cd "$baseDir"
yarn cpx "./src/base/dist/**/*.{ts,js}" "./dist/opdb-base"
yarn cpx "./src/base/package.json" "./dist/opdb-base"
rm -rf ./src/base/dist

# @opdb/postgres
cd ./src/adapter/postgres
yarn
yarn build
cd "$baseDir"
yarn cpx "./src/adapter/postgres/dist/**/*.{ts,js}" "./dist/opdb-postgres"
yarn cpx "./src/adapter/postgres/package.json" "./dist/opdb-postgres"
rm -rf ./src/adapter/postgres/dist
