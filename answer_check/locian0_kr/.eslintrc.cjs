module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    camelcase: 'off',
    'import/first': 'off',
    indent: 'off',
    'multiline-ternary': 'off',
    'prefer-regex-literals': 'off',
    semi: 'off',
    'space-before-function-paren': 'off',
    'no-labels': 'off'
  }
}
