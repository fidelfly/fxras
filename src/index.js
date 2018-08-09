import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.less';
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import {WebApp} from './router'
import { InitData } from './initialization'

const middleware = [thunk];
const store = createStore(reducer, InitData, applyMiddleware(...middleware));

const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <Component/>
        </Provider>,
        document.getElementById('root')
    );
};


render(WebApp);

if (module.hot) {
    const orgError = console.error; // eslint-disable-line no-console
    console.error = (...args) => { // eslint-disable-line no-console
        if (args && args.length === 1 && typeof args[0] === 'string' && args[0].indexOf('You cannot change <Router routes>;') > -1) {
            // React route changed
        } else {
            orgError.apply(console, args);
        }
    };
    module.hot.accept('./router/web', () => {
        render(WebApp);
    })
}

registerServiceWorker();