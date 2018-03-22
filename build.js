const fs = require('fs-path');

require('@babel/core').transformFile(
  'index.js',
  {
    plugins: ['@babel/plugin-transform-flow-strip-types']
  },
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