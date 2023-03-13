/*
 * @Author: Mr-Nobody-li
 * @Date: 2023-03
 * @LastEditors: Mr-Nobody-li
 * @LastEditTime: 2023-03
 * @Description:eslint
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'comma-dangle': 'off',
  },
}
