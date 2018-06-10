import { Component } from './component.js'

// @ts-ignore
const root: HTMLElement = document.getElementById('root')

tape('it should render jsx to dom', t => {
    ReactDOM.render(<Component />, root)
    t.equal(root.children.length, 1)
    t.equal(root.children[0].textContent, 'text')
    t.end()
})


