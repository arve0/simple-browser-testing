const server = require('./server')
const puppeteer = require('puppeteer')
const { equals, notEqual } = require('assert');

let rootPath = __dirname
let port = 8888
let mainPage = `http://localhost:${port}/`
let browser = null
let page = null

before(async function () {
    this.timeout(5 * 1000) // starting browser may take more than 2 seconds
    await server.start(rootPath, port)
    browser = await puppeteer.launch({ devtools: true })
    page = (await browser.pages())[0]

    page.on('console', async function (msg) {
        if (msg.type() === 'error' && msg.args().length) {
            console.error("Browser console.error:")
            let error = await msg.args()[0].jsonValue()
            console.error(error)
        } else {
            console.log(msg._text)
        }
    })
})

beforeEach(async function () {
    await page.goto(mainPage)
})

after(function () {
    browser.close()
    server.shutdown()
})

it('should have an input element', async function () {
    let input = await page.$('input')
    notEqual(input, null)
})

it('should have element .not-on-page with text content "some text"', async function () {
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
