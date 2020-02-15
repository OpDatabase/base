#!/bin/sh

baseDir=$(pwd)

# @opdb/base
cd "$baseDir/dist/opdb-base"
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm publish --access public

# @opdb/postgres
cd "$baseDir/dist/opdb-postgres"
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm publish --access public

# @opdb/mysql
cd "$baseDir/dist/opdb-mysql"
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm publish --access public
