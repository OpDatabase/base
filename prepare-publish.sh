#!/bin/sh

git config user.email "marvin.scharle@conclurer.com"
git config user.name "Marvin Scharle"
git remote set-url origin "https://$GIT_USERNAME:$GIT_ACCESS_TOKEN@github.com/OpDatabase/base.git"
