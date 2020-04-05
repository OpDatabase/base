const fs = require('fs');
const danger = require('danger');

// Check if all beachball changes have been applied
if (fs.existsSync('./change') && fs.readdirSync('./change').length > 0) {
  danger.fail(`There are pending beachball changes. To apply them, run: "yarn beachball bump"!`);
}

