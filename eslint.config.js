import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import playwright from 'eslint-plugin-playwright'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import security from 'eslint-plugin-security'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // Testes unitários
  {
    files: [
      'src/**/__tests__/**/*.{ts,tsx}',
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      'unused-imports': unusedImports,
      sonarjs,
      unicorn,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-undef': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },

  // Código fonte principal
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/**/__tests__/**',
      'src/**/*.test.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'src/test/**',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
      'unused-imports': unusedImports,
      react,
      'jsx-a11y': jsxA11y,
      sonarjs,
      unicorn,
      security,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // React
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',

      // Accessibility
      ...jsxA11y.configs.recommended.rules,
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/label-has-associated-control': 'error',

      // Code Quality (SonarJS)
      'sonarjs/cognitive-complexity': ['error', 10],
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/no-redundant-boolean': 'error',

      // Clean Code (Unicorn)
      'unicorn/better-regex': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-modern-math-apis': 'error',

      // Security
      'security/detect-object-injection': 'off',
      'security/detect-unsafe-regex': 'warn',
      'security/detect-buffer-noassert': 'error',

      // SOLID / Clean Architecture
      'max-lines': ['error', 500],
      'max-lines-per-function': ['error', 80],
      'max-params': ['error', 5],
      complexity: ['error', 10],
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      'no-duplicate-imports': 'error',
      'no-console': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Testes E2E Playwright
  {
    files: ['tests/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      'unused-imports': unusedImports,
      sonarjs,
      playwright,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      ...playwright.configs['flat/recommended'].rules,
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'no-console': 'off',
      'playwright/no-conditional-in-test': 'off',
      'playwright/no-conditional-expect': 'off',
      'playwright/no-skipped-test': 'off',
    },
  },
]
