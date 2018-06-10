# simple browser testing
This is a minimal setup of testing in chrome headless using

- [typescript](https://www.typescriptlang.org)
- [puppeteer](https://www.npmjs.com/package/puppeteer/)
- [tape](https://www.npmjs.com/package/tape)
- [tap-dot](https://www.npmjs.com/package/tap-dot) ([patched](https://github.com/arve0/tap-dot/commit/68064386cb4210911f8ad31347bd0f30ce30c8b2) to support stack trace)

It basically

1. Builds client side code (`*.tsx`) with typescript

    - `React`, `ReactDOM` and `tape` are defined as globals in [globals.d.ts](globals.d.ts)
    - Modules are resolved client-side (**no** need for a bundler like webpack)
    - Import dependencies with ES2015 syntax: `import Component from './Component.js'`

2. Starts a webserver
3. Loads chromium through puppeteer
4. Pipes output from chromium to terminal console
5. Pipes [TAP](https://testanything.org) output through tap-dot

## usage
```sh
git clone https://github.com/arve0/simple-browser-testing browser-tests
cd browser-tests
git checkout react
rm -fr .git
npm install
npm test
```

You should get one test passing:
```sh
$ npm test

> simple-browser-testing@1.0.0 test /Users/arve/git/react-animate-on-change/browser-tests
> npm run build-client && node test.js | tap-dot


> simple-browser-testing@1.0.0 build-client /Users/arve/git/react-animate-on-change/browser-tests
> tsc -p tsconfig.tsx.json


  ..

  1 tests
  2 passed

  Pass!
```

## even simpler setup
See the [master branch](https://github.com/arve0/simple-browser-testing/).
