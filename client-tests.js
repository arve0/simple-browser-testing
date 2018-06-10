const test = require('tape')

test('it should pass', t => {
    t.pass('passing test')
    t.end()
})

test('it should fail', t => {
    t.fail('failing test')
    t.end()
})

test('deep equal', t => {
    t.deepEqual({ a: 1 }, { b: 2 })
    t.end()
})