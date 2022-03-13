/* eslint-disable sort-keys */
module.exports = {
  extends: 'eslint:recommended',
  env: {
    'es6': true,
    browser: true,
  },
  ignorePatterns: ['dist'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 'esnext',
    'sourceType': 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn'],
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'comma-dangle': [1, 'always-multiline'],
    'curly': ['error', 'all'],
    'func-names': ['error', 'never'],
    'function-paren-newline': ['error', 'consistent'],
    'generator-star-spacing': ['error', {
      after: true,
      before: false,
    }],
    'id-blacklist': ['error', 'getDerivedStateFromProps'],
    'import/no-cycle': 'off',
    'import/no-named-as-default': 'off',
    // TODO: Consider re-enabling when perf improves
    'import/no-named-as-default-member': 'off',
    // TODO: Consider re-enabling when perf improves
    'import/prefer-default-export': ['off'],
    // This breaks our custom Link component. If/When we redo the Link component, we can revise this
    'jsx-a11y/anchor-is-valid': ['off'],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'max-len': ['warn', {
      code: 120,
      tabWidth: 4,
    }],
    'no-confusing-arrow': 'off',
    'no-console': ['warn'],
    'no-continue': ['off'],
    'no-debugger': ['off'],
    'no-fallthrough': ['error', { 'commentPattern': 'break[\\s\\w]*omitted' }],
    'no-multiple-empty-lines': ['error', {
      max: 1,
      maxEOF: 1,
    }],
    'no-param-reassign': ['error', {
      ignorePropertyModificationsFor: ['draft'],
    }],
    'no-plusplus': 'off',
    'no-restricted-syntax': ['off'],
    'no-sequences': 'warn',
    'no-undef': 'off',
    'no-underscore-dangle': ['off'],
    'no-unused-vars': 'off',
    'no-trailing-spaces': 'warn',
    'object-curly-newline': ['error', {
      consistent: true,
      multiline: true,
    }],
    'operator-linebreak': ['error', 'after'],
    'quotes': [2, 'single', 'avoid-escape'],
    'semi': 'warn',
    'sort-keys': ['off'],
    'yoda': ['off'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.ts',
          '.json',
        ],
      },
    },
  },
};
