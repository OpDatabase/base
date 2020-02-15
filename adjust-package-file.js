const fs = require('fs');
const path = require('path');

(async function() {
  const mainPackageJson = require('./package.json');
  const targetFile = process.argv[2];
  console.log(`Updating target file: ${targetFile}`);

  // Update package.json
  const targetFilePath = path.resolve(process.cwd(), targetFile);
  const jsonPayload = require(targetFilePath);
  jsonPayload.version = mainPackageJson.version;

  // Update dependencies
  for (const dependency of ['@opdb/base']) {
    if (jsonPayload.dependencies && jsonPayload.dependencies[dependency] != null) {
      jsonPayload.dependencies[dependency] = `^${mainPackageJson.version}`;
    }
    if (jsonPayload.peerDependencies && jsonPayload.peerDependencies[dependency] != null) {
      jsonPayload.peerDependencies[dependency] = `^${mainPackageJson.version}`;
    }
    if (jsonPayload.devDependencies && jsonPayload.devDependencies[dependency] != null) {
      jsonPayload.devDependencies[dependency] = `^${mainPackageJson.version}`;
    }
  }

  // Write file
  fs.writeFileSync(targetFilePath, JSON.stringify(jsonPayload));
})().catch(err => {
  console.error(err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
