module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectSpread: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'import/prefer-default-export': 0,
  },
};
