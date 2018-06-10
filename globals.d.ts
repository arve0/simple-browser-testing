import __tape from 'tape';
import __React from 'react';
import __ReactDOM from 'react-dom';

declare global {
    const tape: typeof __tape;
    const React: typeof __React;
    const ReactDOM: typeof __ReactDOM;
}