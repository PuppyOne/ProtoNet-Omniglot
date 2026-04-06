import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import pluginRouter from '@tanstack/eslint-plugin-router';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default defineConfig([
  globalIgnores(['**/*.gen.*', 'src/client']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginRouter.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      ...reactHooks.configs.r,

      // 命名规范
      '@typescript-eslint/naming-convention': [
        'error',

        // 默认：变量 / 函数 camelCase
        {
          selector: 'variableLike',
          format: ['camelCase', 'PascalCase'],
        },

        // 类型：PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },

        // const 允许 UPPER_CASE
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
          filter: {
            regex: '^Route$',
            match: false,
          },
        },

        // 函数（兼容 React 组件）
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },

        // 参数允许前导 _
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },

        // 泛型
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
        },
      ],
    },
  },

  {
    plugins: { 'simple-import-sort': simpleImportSort, import: importPlugin },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': [
        'error',
        { count: 2, exactCount: true, considerComments: true },
      ],
      'import/no-duplicates': 'error',
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',

        // 变量声明后空一行
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },

        // 指令（如 'use strict'）后空一行
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },

        // 具名函数声明空一行
        { blankLine: 'always', prev: '*', next: 'function' },

        // 类型声明前空一行
        { blankLine: 'always', prev: '*', next: 'interface' },
        { blankLine: 'always', prev: '*', next: 'enum' },
      ],
      '@stylistic/jsx-self-closing-comp': 'error',
    },
  },

  // 文件命名规则
  {
    files: ['**/*.ts'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: { kebabCase: true },
        },
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: { pascalCase: true },
          ignore: ['^(__root|main)\\.tsx$'],
        },
      ],
    },
  },
]);
