import { Component } from './component.js';
// @ts-ignore
const root = document.getElementById('root');
tape('it should render jsx to dom', t => {
    ReactDOM.render(React.createElement(Component, null), root);
    t.equal(root.children.length, 1);
    t.equal(root.children[0].textContent, 'text');
    t.end();
});
