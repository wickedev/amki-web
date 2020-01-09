const path = require('path')
const fs = require('fs')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder')
const babelLoaderFinder = makeLoaderFinder('babel-loader')
const {
    groupInfoTemplate,
    defaultInfoTemplate,
} = require('babel-plugin-logger')
const paths = require('razzle/config/paths')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { eslintConfig, babel } = require('./package.json')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const lessOption = {
    includePaths: [paths.appNodeModules],
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
}

const tsconfigPathsPlugin = new TsconfigPathsPlugin()

const typescriptPlugin = (baseConfig, { target, dev }) => {
    const config = Object.assign({}, baseConfig)

    const babelLoader = config.module.rules.find(babelLoaderFinder)
    if (!babelLoader) {
        throw new Error(`'babel-loader' was erased from config'`)
    }

    config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx']
    addPlugin(tsconfigPathsPlugin)(config)
    babelLoader.test = /\.(ts|tsx|js|jsx|mjs)$/
    babelLoader.use = babelLoader.use.map(u => {
        const plugins = []

        if (u.options.plugins != null) {
            plugins.push(...u.options.plugins)
        }

        if (babel.plugins != null) {
            plugins.push(...babel.plugins)
        }

        return {
            ...u,
            options: {
                ...u.options,
                ...babel,
                plugins,
            },
        }
    })

    if (target === 'web') {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin(
                Object.assign(
                    {},
                    {
                        async: true,
                        tsconfig: resolveApp('tsconfig.json'),
                        eslint: true,
                        eslintOptions: eslintConfig,
                        tslint: false,
                        watch: resolveApp('src'),
                        typeCheck: true,
                    },
                ),
            ),
        )
        if (dev) {
            config.output.pathinfo = false
            config.optimization = {
                removeAvailableModules: false,
                removeEmptyChunks: false,
                splitChunks: false,
            }
        }
    }

    return config
}

const getBabelLoader = config => {
    return config.module.rules
        .filter(rule => Array.isArray(rule.use))
        .flatMap(rule => rule.use)
        .find(u => {
            const isBabelLoader = u.loader === 'babel-loader'
            return isBabelLoader || babelLoaderFinder(u)
        })
}

const getPlugins = config => {
    return config.plugins
}

const addBabelPlugin = plugin => config => {
    const loader = getBabelLoader(config)

    if (!loader) {
        console.error(`babel loader not exist: ${loader}`)
        return
    }

    const options = loader.options
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

const addBabelPluginLogger = target => {
    const isWeb = target === 'web'
    return addBabelPlugin([
        'logger',
        {
            infoTemplate: isWeb ? groupInfoTemplate : defaultInfoTemplate,
        },
    ])
}

const fixBabelImportsAntD = target => config => {
    if (target === 'web') {
        return fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
        })(config)
    }
}

const removeDefinitionsOnNode = target => config => {
    if (target === 'node') {
        const definePlugin = getPlugins(config).filter(
            Plugin => Plugin.definitions,
        )[0]
        delete definePlugin.definitions['process.env.PORT']
    }
}

// noinspection JSUnusedLocalSymbols
module.exports = {
    modify(config, { target, dev }, webpack) {
        if (target === 'node') {
            config.externals = ['pg-native']
        }
        fixBabelImportsAntD(target)(config)
        addBabelPluginLogger(target)(config)
        removeDefinitionsOnNode(target)(config)
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
        typescriptPlugin,
    ],
}
