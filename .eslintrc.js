module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  globals: {
    IS_DEVELOPMENT: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  parser: '@babel/eslint-parser',
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
};
