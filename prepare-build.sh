#!/bin/sh

baseDir=$(pwd)

# @opdb/base
cd "$baseDir/dist/opdb-base"
yarn link

# @opdb/postgres
cd "$baseDir/dist/opdb-postgres"
yarn link "@opdb/base"

# @opdb/mysql
cd "$baseDir/dist/opdb-mysql"
yarn link "@opdb/base"
