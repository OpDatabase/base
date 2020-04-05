#!/bin/sh

baseDir=$(pwd)

# @opdb/base
cd "$baseDir/src/base"
yarn link

# @opdb/postgres
cd "$baseDir/src/adapter/postgres"
yarn link "@opdb/base"

# @opdb/mysql
cd "$baseDir/src/adapter/mysql"
yarn link "@opdb/base"
