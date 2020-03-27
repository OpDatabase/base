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
node ./adjust-package-file.js ./dist/opdb-base/package.json
rm -rf ./src/base/dist

# @opdb/postgres
cd ./src/adapter/postgres
yarn
yarn build
cd "$baseDir"
yarn cpx "./src/adapter/postgres/dist/**/*.{ts,js}" "./dist/opdb-postgres"
yarn cpx "./src/adapter/postgres/package.json" "./dist/opdb-postgres"
yarn cpx "./src/adapter/postgres/README.md" "./dist/opdb-postgres"
node ./adjust-package-file.js ./dist/opdb-postgres/package.json
rm -rf ./src/adapter/postgres/dist

# @opdb/mysql
cd ./src/adapter/mysql
yarn
yarn build
cd "$baseDir"
yarn cpx "./src/adapter/mysql/dist/**/*.{ts,js}" "./dist/opdb-mysql"
yarn cpx "./src/adapter/mysql/package.json" "./dist/opdb-mysql"
yarn cpx "./src/adapter/mysql/README.md" "./dist/opdb-mysql"
node ./adjust-package-file.js ./dist/opdb-mysql/package.json
rm -rf ./src/adapter/mysql/dist

# @opdb/orm
cd ./src/orm
yarn
yarn build
cd "$baseDir"
yarn cpx "./src/orm/dist/**/*.{ts,js}" "./dist/opdb-orm"
yarn cpx "./src/orm/**/*._ts" "./dist/opdb-orm"
yarn cpx "./src/orm/package.json" "./dist/opdb-orm"
yarn cpx "./src/orm/README.md" "./dist/opdb-orm"
node ./adjust-package-file.js ./dist/opdb-orm/package.json
rm -rf ./src/orm/dist
