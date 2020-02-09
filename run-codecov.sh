#!/bin/sh

sh ./run-codecov.sh

curl -s https://codecov.io/bash | bash -s -- -f ./coverage/clover.xml
