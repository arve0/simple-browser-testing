const { start, shutdown } = require('./server')
const { launch } = require('puppeteer')

launch({ devtools: true }).then(async (browser) => {
    await start()
    let page = await browser.newPage()

    page.on('console', (msg) => {
        if (msg._type === 'error') {
            console.error(msg._text)
        } else {
            console.log(msg._text)
        }
    })

    await page.goto('http://localhost:8888/client-tests.html')

    // wait for console output from browser before closing
    setTimeout(() => {
        browser.close()
        shutdown()
    }, 100)
})