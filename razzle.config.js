const { eslintConfig } = require('./package.json')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
    modify(config, { target, dev }, webpack) {
        if (config.resolve.plugins == null) {
            config.resolve.plugins = []
        }

        config.resolve.plugins.push(new TsconfigPathsPlugin())
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
