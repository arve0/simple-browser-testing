const server = require('./server')
const configuration = require('./package.json')
const puppeteer = configuration.devDependencies.puppeteer
    ? require('puppeteer')
    : require('puppeteer-firefox');

// configuration
const rootPath = __dirname  // which folder to serve over http
const port = 8888  // which port to use for http server
const mainPage = `http://localhost:${port}/`
const headless = false  // false: show browser, true: hide browser
const slowMo = true  // true: each browser action will take 100 milliseconds
    ? 100
    : 0

// globals
let browser = null
let page = null

before(async function () {
    this.timeout(5 * 1000) // starting browser may take more than 2 seconds

    await server.start(rootPath, port)
    browser = await puppeteer.launch({ headless, slowMo })
    page = (await browser.pages())[0]

    page.on('console', async function (msg) {
        if (msg.type() === 'error' && msg.args().length) {
            let args = await Promise.all(msg.args().map(arg => arg.jsonValue()))
            console.error("Browser console.error:", ...args)
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

describe('tests', function () {
    this.timeout(slowMo ? 0 : 2000)

    it('typing in regular input element', async function () {
        await waitFor({ text: 'regular', click: true })
        await page.keyboard.type('asdf')
        await waitFor({ text: 'asdf' })
    })

    it('typing in shadowed input element', async function () {
        await waitFor({ text: 'shadowed', click: true })
        await page.keyboard.type('qwert')
        await waitFor({ text: 'qwert' })
    })

    it('typing in iframed input element', async function () {
        await waitFor({ text: 'iframe', click: true })
        await page.keyboard.type('1234')
        await waitFor({ text: '1234' })
    })


    it('should fail', async function () {
        await waitFor({ text: 'non existent text', timeout: 100 })
    })
})

/**
 * Waits for a visible element containing given text, possibly clicks it.
 *
 * @param {object} params - What to wait for, in which selector, if it should be clicked and how long to wait.
 * @param {string} params.text - What text to wait for.
 * @param {string} params.selector - What selector to use, defaults to any element: `*`.
 * @param {bool} params.click - Wheter to click when found.
 * @param {number} params.timeout - How long to wait in milliseconds.
 */
async function waitFor({ text, selector = '*', click = false, timeout = 1000 }) {
    const start = Date.now()

    while ((Date.now() - start) < timeout) {
        let frames = await page.frames()
        let scopes = [page, ...frames]
        for (let scope of scopes) {
            let result = await scope.evaluate(pageFunction, text, selector, click)
            if (result) {
                return true
            }
        }
    }

    throw new Error(`'${text}' not found on page in selector '${selector}', waited ${timeout} milliseconds.`)

    function pageFunction (text, selector, click) {
        let match = findElement(text)

        if (match) {
            if (click) {
                match.click()
            }
            return true
        }
        return false

        function findElement(text) {
            let matchingElements = Array.from(document.querySelectorAll(selector))
                .filter(element => element.textContent.includes(text))
                .sort((a, b) => a.textContent.length - b.textContent.length) // shortest text first, e.g. "best" search result

            if (matchingElements.length > 0 && matchingElements[0].offsetParent !== null) {
                return matchingElements[0]
            }

            let shadowedElements = Array.from(document.querySelectorAll(selector))
                .filter(element => element.shadowRoot)
                .flatMap(element => Array.from(element.shadowRoot.querySelectorAll(selector)))
                .filter(element => element.textContent.includes(text))
                .sort((a, b) => a.textContent.length - b.textContent.length)

            if (shadowedElements.length > 0 && shadowedElements[0].offsetParent !== null) {
                return shadowedElements[0]
            }

            return null
        }
    }
}