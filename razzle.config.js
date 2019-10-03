const path = require('path')
const fs = require('fs')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { eslintConfig } = require('./package.json')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const protoRule = {
    include: [resolveApp('src')],
    test: /\.proto$/,
    use: [
        {
            loader: 'webpack-grpc-web-loader',
            options: {
                protoPath: [resolveApp('src/protos')],
            },
        },
    ],
}

// noinspection JSUnusedLocalSymbols
module.exports = {
    modify(config, { target, dev }, webpack) {
        if (config.resolve.plugins == null) {
            config.resolve.plugins = []
        }

        if (config.module.rules == null) {
            config.module.rules = []
        }

        config.resolve.plugins.push(new TsconfigPathsPlugin())
        config.module.rules.push(protoRule)

        return config
    },
    plugins: [
        {
            name: 'typescript',
            options: {
                useBabel: false,
                tsLoader: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
                forkTsChecker: {
                    async: true,
                    tsconfig: './tsconfig.json',
                    eslint: true,
                    eslintOptions: eslintConfig,
                    tslint: false,
                    watch: './src',
                    typeCheck: true,
                },
            },
        },
    ],
}
