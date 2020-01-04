import http from 'http'

let app = require('./server').default
let currentApp = app
const server = http.createServer(app)
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log('🚀 started')
    console.log(`🚀 server listening on ${port}`)
})

if (module.hot) {
    console.log('✅  Server-side HMR Enabled!')

    module.hot.accept('./server', () => {
        console.log('🔁  HMR Reloading `./server`...')

        try {
            app = require('./server').default
            server.removeListener('request', currentApp)
            server.on('request', app)
            currentApp = app
        } catch (error) {
            console.error(error)
        }
    })
}
