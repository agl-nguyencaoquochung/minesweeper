const isPrd = (process.env.NODE_ENV === 'producntion')

const webpack = require('webpack')
const path = require('path')
const pkg = require('./package.json')

const config = {
    mode: process.env.NODE_ENV || 'development',
    entry: `${__dirname}/src/assets/scripts/index.js`,
    output: {
        filename: 'assets/scripts/index.js?[contenthash]',
        path: `${__dirname}/dist`,
        publicPath: '/',
        assetModuleFilename: 'assets/images/[name][ext]?[contenthash]'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                VERSION: JSON.stringify(pkg.version),
            }
        })
    ],
    devtool: (isPrd) ? false : 'eval-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: [
                    `${__dirname}/node_modules`
                ],
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    `${__dirname}/node_modules`
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        alias: {
            '@': path.join(__dirname, 'src/assets/scripts'),
        },
    },
    stats: {
        errorDetails: true,
    },
    performance: {
        hints: false,
    },
    target: ['web', 'es5'],
    optimization: {
        minimize: true,
        // minimizer: [],
    },
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename],
        }
    },
}

module.exports = config
