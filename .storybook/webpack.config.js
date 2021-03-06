const fs = require('fs')
const path = require('path')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const createConfig = require('razzle/config/createConfig')
const paths = require('razzle/config/paths')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')

const createRazzleConfig = mode => {
    let razzle = {}

    if (fs.existsSync(paths.appRazzleConfig)) {
        try {
            razzle = require(resolveApp('razzle.config.js'))
        } catch (e) {
            process.exit(1)
        }
    }

    const env = mode === 'DEVELOPMENT' ? 'dev' : 'prod'
    const razzleConfig = createConfig('web', env, razzle, null)

    razzleConfig.module.rules = razzleConfig.module.rules
        .map(rule => {
            const include = isIterable(rule.include)
                ? [...rule.include, resolveApp('stories')]
                : rule.include
                ? [rule.include, resolveApp('stories')]
                : undefined

            if (include) {
                return { ...rule, include }
            }

            return rule
        })
        .filter(rules => !rules.loader || !rules.loader.includes('file-loader'))

    return razzleConfig
}

module.exports = async ({ config, mode }) => {
    const razzleConfig = createRazzleConfig(mode)

    config.resolve.extensions.push('.ts', '.tsx')

    if (!config.resolve.plugins) {
        config.resolve.plugins = []
    }

    config.resolve.plugins.push(new TsconfigPathsPlugin())

    const rules = razzleConfig.module.rules

    for (const rule of rules) {
        if (!rule.use) {
            continue
        }

        if (rule.test.toString().includes('tsx')) {
            rule.use.push({
                loader: 'react-docgen-typescript-loader',
                options: {
                    tsconfigPath: resolveApp('tsconfig.json'),
                },
            })
        }

        rule.use = rule.use.filter(
            u =>
                !(
                    typeof u === 'string' &&
                    u.includes('mini-css-extract-plugin')
                ),
        )
    }

    Object.assign(config.performance, {
        maxEntrypointSize: 2_000_000,
        maxAssetSize: 2_000_000,
    })

    return {
        ...config,
        module: {
            ...config.module,
            rules,
        },
    }
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false
    }
    return typeof obj[Symbol.iterator] === 'function'
}
