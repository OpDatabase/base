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
yarn cpx "./src/base/README.md" "./dist/opdb-base"
yarn cpx "./src/base/CHANGELOG.md" "./dist/opdb-base"
yarn cpx "./src/base/CHANGELOG.json" "./dist/opdb-base"
rm -rf ./src/base/dist

# @opdb/postgres
cd ./src/adapter/postgres
yarn
yarn build
cd "$baseDir"
yarn cpx "./src/adapter/postgres/dist/**/*.{ts,js}" "./dist/opdb-postgres"
yarn cpx "./src/adapter/postgres/package.json" "./dist/opdb-postgres"
yarn cpx "./src/adapter/postgres/README.md" "./dist/opdb-postgres"
yarn cpx "./src/adapter/postgres/CHANGELOG.md" "./dist/opdb-postgres"
yarn cpx "./src/adapter/postgres/CHANGELOG.json" "./dist/opdb-postgres"
rm -rf ./src/adapter/postgres/dist

# @opdb/mysql
cd ./src/adapter/mysql
yarn
yarn build
cd "$baseDir"
yarn cpx "./src/adapter/mysql/dist/**/*.{ts,js}" "./dist/opdb-mysql"
yarn cpx "./src/adapter/mysql/package.json" "./dist/opdb-mysql"
yarn cpx "./src/adapter/mysql/README.md" "./dist/opdb-mysql"
yarn cpx "./src/adapter/mysql/CHANGELOG.md" "./dist/opdb-mysql"
yarn cpx "./src/adapter/mysql/CHANGELOG.json" "./dist/opdb-mysql"
rm -rf ./src/adapter/mysql/dist
