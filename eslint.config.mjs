// eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

// Assign the configuration array to a named variable
const config = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    ...compat.extends('plugin:prettier/recommended'),
    {
        rules: {
            'arrow-body-style': ['error', 'as-needed'],
            'no-else-return': ['error'],
            curly: ['error', 'multi-line'],
            'max-len': ['error', { code: 120 }],
            quotes: ['error', 'single', { avoidEscape: true }],
            'object-shorthand': ['error', 'always'],
            'no-extra-parens': ['error', 'functions'],
            'arrow-spacing': ['error', { before: true, after: true }],
            'consistent-return': ['error'],
            'no-unused-vars': 'off', // Disable default rule to avoid overlap
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'], // Align with Prettier
            indent: 'off', // Prettier handles indentation
            'prettier/prettier': ['error', { tabWidth: 4 }],
            'arrow-parens': ['error', 'as-needed'], // Match Prettier's arrowParens
        },
    },
    {
        files: ['*.ts', '*.tsx'],
        languageOptions: {
            parser: typescriptParser,
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Allow _t or _r
            '@typescript-eslint/explicit-function-return-type': ['warn'],
        },
    },
];

export default config;
