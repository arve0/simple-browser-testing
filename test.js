const { start, shutdown } = require('./server')
const { launch } = require('puppeteer')
const { equals, notEqual } = require('assert');

let port = 8888
let mainPage = `http://localhost:${port}/`
let browser = null
let page = null

before(() => launch({ devtools: true }).then(async (b) => {
    browser = b
    await start(port)
    page = (await browser.pages())[0]

    page.on('console', async msg => {
        if (msg.type() === 'error') {
            console.error("Browser console.error:")
            let error = await msg.args()[0].jsonValue()
            console.error(error)
        } else {
            console.log(msg._text)
        }
    })
}))

beforeEach(async () => await page.goto(mainPage))

after(() => {
    browser.close()
    shutdown()
})

it('should have an input element', async () => {
    let input = await page.$('input')
    notEqual(input, null)
})

it('should have element .not-on-page with text content "some text"', async () => {
    let input = await page.$('input')
    await input.type('qwerty')
    await sleep(300)
    await input.press('Enter')

    await page.waitFor('.not-on-page')

    let elementText = await page.$eval('.not-on-page', el => el.textContent)

    equals(elementText, 'some text')
})

function sleep (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}