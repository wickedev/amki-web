import puppeteer, { Browser, Page } from 'puppeteer'
import fs from 'fs-extra'

describe('app', () => {
    let page: Page
    let browser: Browser

    beforeEach(async () => {
        browser = await puppeteer.launch()
        page = await browser.newPage()
        await page.goto('http://localhost:3000')
        await fs.mkdirp('screenshot')
    })

    test('screenshot', async () => {
        await page.screenshot({ path: 'screenshot/example.png' })
    })

    afterEach(async () => {
        await browser.close()
    })
})
