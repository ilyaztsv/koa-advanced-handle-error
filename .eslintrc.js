module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8
  },
  plugins: ['prettier', 'flowtype-errors'],
  extends: ['prettier', 'plugin:prettier/recommended'],
  env: {
    browser: false,
    node: true,
    jest: true
  },
  rules: {
    'flowtype-errors/show-errors': 2,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    indent: 0,
    semi: ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-var': 'error',
    'prettier/prettier': 'error',
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['warn', 'error'] }]
        : 'off'
  },
  overrides: [
    {
      files: ['__tests__/*.spec.js'],
      parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
      },
      env: { jest: true },
      globals: {}
    }
  ]
};
