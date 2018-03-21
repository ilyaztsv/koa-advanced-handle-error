import flow from 'rollup-plugin-flow';

export default {
  onwarn: (warning, next) => {
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
    next(warning);
  },
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    exports: 'named'
  },
  treeshake: {
    pureExternalModules: true
  },
  external: ['koa'],
  plugins: [flow({ pretty: true })]
};
