import http, { Server } from 'http'
import { APIRouter } from 'routers'
import { App } from '~/App'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import express from 'express'
import { renderToString } from 'react-dom/server'
import path from 'path'
import { getUserRepository } from '~/repositories/user-repository'
import { UserRouter } from '~/routers/user-routers'

console.log(process.env)

const port = process.env.PORT || 3000
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST!)
const RAZZLE_PUBLIC_DIR = path.join(__dirname, 'public')

export class Application {
    public app: express.Application
    public server?: Server

    public static bootstrap(): Promise<Application> {
        return (async () => {
            const userRepository = await getUserRepository()
            const userRouter = new UserRouter(userRepository)
            const apiRouter = new APIRouter(userRouter)
            return new Application(apiRouter)
        })()
    }

    constructor(apiRouter: APIRouter) {
        this.app = express()
            .disable('x-powered-by')
            .use(express.static(RAZZLE_PUBLIC_DIR))
            .use('/api', apiRouter.router)
            .get('/*', (req, res) => {
                const context: { url?: string } = {}
                const markup = renderToString(
                    <StaticRouter context={context} location={req.url}>
                        <App />
                    </StaticRouter>,
                )

                if (context.url) {
                    res.redirect(context.url)
                } else {
                    res.status(200).send(`
                <!doctype html>
                <html lang="">
                <head>
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta charset="utf-8" />
                    <title>Welcome to Razzle</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    ${
                        assets.client.css
                            ? `<link rel="stylesheet" href="${assets.client.css}">`
                            : ''
                    }
                    ${
                        process.env.NODE_ENV === 'production'
                            ? `<script src="${assets.client.js}" defer></script>`
                            : `<script src="${assets.client.js}" defer crossorigin></script>`
                    }
                </head>
                <body>
                    <div id="root">${markup}</div>
                </body>
            </html>
        `)
                }
            })
    }

    public async start() {
        this.server = http.createServer(this.app)
        this.server.listen(port, () => {
            console.log('🚀 started')
            console.log(`🚀 server listening on ${port}`)
        })
    }

    public reset() {
        if (this.server) {
            this.server!.removeListener('request', this.app)
        }
    }
}
