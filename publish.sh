#!/bin/sh

baseDir=$(pwd)

# @opdb/base
cd "$baseDir/dist/opdb-base"
npm publish

# @opdb/postgres
cd "$baseDir/dist/opdb-postgres"
npm publish

# @opdb/mysql
cd "$baseDir/dist/opdb-mysql"
npm publish
