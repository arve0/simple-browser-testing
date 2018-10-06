# simple browser testing
This is a dead simple setup of end-to-end testing with chrome headless using

- [puppeteer](https://www.npmjs.com/package/puppeteer/) and
- [mocha](https://www.npmjs.com/package/mocha).

It basically

1. Starts a webserver
2. Loads chromium through puppeteer
4. Runs tests with mocha

## usage
```sh
git clone https://github.com/arve0/simple-browser-testing browser-tests
rm -fr browser-tests/.git
cd browser-tests
npm install
npm test
```

You should get one test passing and one test failing:
```sh
$ npm test

> simple-browser-testing@1.0.0 test /Users/arve/git/simple-browser-testing
> mocha test.js



Server: Listening on port 8888
Server: 200 - GET: /
  ✓ should have an input element (58ms)
Server: 200 - GET: /
  1) should have element .not-on-page with text content "some text"

  1 passing (3s)
  1 failing

  1) should have element .not-on-page with text content "some text":
     Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/Users/arve/git/simple-browser-testing/test.js)




npm ERR! Test failed.  See above for more details.
```

## react
See the [react branch](https://github.com/arve0/simple-browser-testing/tree/react) if you want to test React.

It tries to have a minimal setup with support for JSX through typescript (no webpack, etc).

