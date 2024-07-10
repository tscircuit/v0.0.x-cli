module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    ignorePatterns: ['**/node_modules/**', 'dist/**'],
    rules: {
      // Add any custom rules here
    },
  };