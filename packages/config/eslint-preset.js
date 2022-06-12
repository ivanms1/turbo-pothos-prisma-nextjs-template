module.exports = {
  extends: ['next', 'prettier'],
  plugins: ['@typescript-eslint'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
      react: {
        version: 'detect',
      },
      'import/ignore': ['node_modules'],
    },
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
};
