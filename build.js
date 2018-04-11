const fs = require('fs-path');

require('@babel/core').transformFile(
  'middleware/index.js',
  {},
  (err, result) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    try {
      fs.writeFileSync('lib/index.js', result.code);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
);
