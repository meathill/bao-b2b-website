module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript',
  ],
  rules: {
    semi: 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': ['error', {
      "anonymous": "always",
      "named": "never",
    }],
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/semi': ['error', 'always', { omitLastInOneLineBlock: true }],
  },
};
