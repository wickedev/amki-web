import { Application } from 'server'

let currentApp: Application

Application.bootstrap().then(app => {
    currentApp = app
    currentApp.start().then()
})

if (module.hot) {
    console.log('✅  Server-side HMR Enabled!')

    module.hot.accept('./server', () => {
        console.log('🔁  HMR Reloading `./server`...')

        try {
            const { Application } = require('./server')
            currentApp.reset()
            Application.bootstrap().then((app: Application) => {
                currentApp = app
            })
        } catch (error) {
            console.error(error)
        }
    })
}
