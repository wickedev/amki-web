const path = require('path')
const fs = require('fs')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder')
const babelLoaderFinder = makeLoaderFinder('babel-loader')
const paths = require('razzle/config/paths')
const { eslintConfig } = require('./package.json')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const lessOption = {
    includePaths: [paths.appNodeModules],
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
}

// noinspection JSValidateTypes
const tsconfigPathsPlugin = new TsconfigPathsPlugin()

// noinspection JSUnusedLocalSymbols
module.exports = {
    modify(config, { target, dev }, webpack) {
        addPlugin(tsconfigPathsPlugin)(config)
        addBabelPlugin([
            'babel-plugin-auto-logger',
            {
                sourceMatcher: '.*ts(x)?$',
            },
        ])(config)
        addBabelPlugin(['babel-plugin-console'])(config)
        addBabelPlugin(['babel-plugin-macros'])(config)

        if (target === 'web') {
            fixBabelImports('import', {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true,
            })(config)
        }

        return config
    },
    plugins: [
        {
            name: 'less',
            options: {
                less: {
                    dev: Object.assign(lessOption, {
                        sourceMap: true,
                    }),
                    prod: Object.assign(lessOption, {
                        sourceMap: false,
                    }),
                },
            },
        },
        {
            name: 'typescript',
            options: {
                useBabel: true,
                tsLoader: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
                forkTsChecker: {
                    async: true,
                    tsconfig: resolveApp('tsconfig.json'),
                    eslint: true,
                    eslintOptions: eslintConfig,
                    tslint: false,
                    watch: resolveApp('src'),
                    typeCheck: true,
                },
            },
        },
    ],
}

const getBabelLoader = config => {
    return config.module.rules
        .filter(rule => Array.isArray(rule.use))
        .flatMap(rule => rule.use)
        .find(babelLoaderFinder)
}

const addBabelPlugin = plugin => config => {
    const options = getBabelLoader(config).options
    options.plugins = options.plugins ? [...options.plugins, plugin] : [plugin]
    return config
}

const fixBabelImports = (libraryName, options) =>
    addBabelPlugin([
        'import',
        Object.assign({}, options),
        `fix-${options.libraryName}-imports`,
    ])

const addPlugin = plugin => config => {
    const resolve = config.resolve
    resolve.plugins = resolve.plugins ? [...resolve.plugins, plugin] : [plugin]
    return config
}
