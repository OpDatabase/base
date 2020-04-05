#!/bin/sh

baseDir=$(pwd)

# Clean latest build
rm -rf ./dist
rm -rf ./src/base/node_modules
rm -rf ./src/adapter/postgres/node_modules

# Main files
npm i

# @opdb/base
cd ./src/base
npm i
npm run build
cd "$baseDir"
cpx "./src/base/dist/**/*.{ts,js}" "./dist/opdb-base"
cpx "./src/base/package.json" "./dist/opdb-base"
cpx "./src/base/README.md" "./dist/opdb-base"
cpx "./src/base/CHANGELOG.md" "./dist/opdb-base"
cpx "./src/base/CHANGELOG.json" "./dist/opdb-base"
rm -rf ./src/base/dist

# cpx "./dist/opdb-base/**/*" "./src/adapter/postgres/node_modules/@opdb/base"
# cpx "./dist/opdb-base/**/*" "./src/adapter/mysql/node_modules/@opdb/base"

# @opdb/postgres
cd ./src/adapter/postgres
npm link ../../../dist/opdb-base
npm i
npm run build
cd "$baseDir"
cpx "./src/adapter/postgres/dist/**/*.{ts,js}" "./dist/opdb-postgres"
cpx "./src/adapter/postgres/package.json" "./dist/opdb-postgres"
cpx "./src/adapter/postgres/README.md" "./dist/opdb-postgres"
cpx "./src/adapter/postgres/CHANGELOG.md" "./dist/opdb-postgres"
cpx "./src/adapter/postgres/CHANGELOG.json" "./dist/opdb-postgres"
rm -rf ./src/adapter/postgres/dist

# @opdb/mysql
cd ./src/adapter/mysql
npm link ../../../dist/opdb-base
npm i
npm run build
cd "$baseDir"
cpx "./src/adapter/mysql/dist/**/*.{ts,js}" "./dist/opdb-mysql"
cpx "./src/adapter/mysql/package.json" "./dist/opdb-mysql"
cpx "./src/adapter/mysql/README.md" "./dist/opdb-mysql"
cpx "./src/adapter/mysql/CHANGELOG.md" "./dist/opdb-mysql"
cpx "./src/adapter/mysql/CHANGELOG.json" "./dist/opdb-mysql"
rm -rf ./src/adapter/mysql/dist
