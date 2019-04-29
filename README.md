# simple browser testing
This is a dead simple setup of end-to-end testing with firefox/chrome headless using

- [puppeteer](https://www.npmjs.com/package/puppeteer/) and
- [mocha](https://www.npmjs.com/package/mocha).

It basically

1. Starts a webserver
2. Loads firefox or chromium through puppeteer
3. Runs tests with mocha

## usage
[Copy contents](https://github.com/Rich-Harris/degit) of this repository to `browser-tests`,
install depdendecies and run tests:

```sh
npx degit arve0/simple-browser-testing browser-tests
cd browser-tests
npm install
npm test
```

You should get three tests passing and one test failing:
```sh
$ npm test

> simple-browser-testing@1.0.0 test /Users/arve/git/simple-browser-testing
> mocha test.js



Server: Listening on port 8888
  tests
    ✓ typing in regular input element
    ✓ typing in shadowed input element
    ✓ typing in iframed input element
    1) should fail


  3 passing (1s)
  1 failing

  1) tests
       should fail:
     Error: 'non existent text' not found on page in selector '*', waited 100 milliseconds.
      at waitFor (test.js:89:11)
      at process._tickCallback (internal/process/next_tick.js:68:7)
```

## how does the tests look like?
```js
it('should be able to click text, type characters and wait for text', async function () {
    await waitFor({ text: 'regular', click: true })
    await page.keyboard.type('asdf')
    await waitFor({ text: 'asdf' })
})
```

## configuration
Read top of [test.js](test.js):

```js
// configuration
const rootPath = __dirname  // which folder to serve over http
const port = 8888  // which port to use for http server
const mainPage = `http://localhost:${port}/`
const headless = false  // false: show browser, true: hide browser
const slowMo = false  // true: each browser action will take 100 milliseconds
    ? 100
    : 0
```

### using chromium instead of firefox
1. Alter `package.json` to use `puppeteer`:

  ```json
    "devDependencies": {
      "puppeteer": "*",
      "mocha": "*"
    },
  ```

2. Refresh dependencies:

  ```sh
  npm install && npm prune
  ```

3. Run tests:

  ```sh
  npm test
  ```