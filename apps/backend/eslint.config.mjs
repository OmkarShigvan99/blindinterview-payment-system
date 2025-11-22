import js from '@eslint/js';
import tseslint from 'typescript-eslint'; // ✅ Use full typescript-eslint config helper
import love from 'eslint-config-love';

export default [
    // Ignore patterns
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '*.config.js',
            '*.config.mjs',
            '**/*.d.ts',
            'scripts/**',
        ],
    },

    // Base JS rules
    js.configs.recommended,

    // "Love" opinionated config
    love,

    // TypeScript support
    ...tseslint.config({
        files: ['**/*.ts'],
        project: './tsconfig.json',
        tsconfigRootDir: new URL('.', import.meta.url),
        rules: {
            'prefer-destructuring': 'off',
            '@typescript-eslint/prefer-destructuring': 'error',
        },
    }),

    // ESLint config file itself should not be parsed as TypeScript
    {
        files: ['eslint.config.mjs'],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
    },
];
