module.exports = {
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: 'module',
    },
    env: {
        browser: true,
        jquery: true,
        jest: true,
        node: true,
    },
    settings: {
        'import/resolver': 'webpack'
    },
    ignorePatterns: [
        'stylelintrc.js',
        'gulpfile.js',
        'webpack.config.js',
        'tasks/',
        'dist/',
        'node_modules/'
    ],
    rules: {
        'semi': 0,
        // 'no-console': 0,
        'no-unexpected-multiline': 'off',
        'no-empty-function': 'off',
        'quotes': ['error', 'single'],
        'indent': ['error', 4],
        'no-unused-vars': [
            2,
            {
                argsIgnorePattern : '^_',
            },
        ],
    },
    overrides: [
        {
            files: [
                '*.ts',
                '*.tsx',
            ],
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
            ],
            plugins: [
                '@typescript-eslint'
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: 'tsconfig.json',
                sourceType: 'module'
            },
            rules: {
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern : '^_',
                    },
                ],
            }
        }
    ]
}
