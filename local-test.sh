npm run build

cd dist/opdb-relal
madge --circular local-test.js

node ./local-test.js
