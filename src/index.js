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

const middleware = [thunk, logger];
const store = createStore(reducer, InitData, applyMiddleware(...middleware));

function logger({ getState }) {
    return next => action => {
        console.log('will dispatch', action)

        // 调用 middleware 链中下一个 middleware 的 dispatch。
        let returnValue = next(action)

        console.log('state after dispatch', getState())

        // 一般会是 action 本身，除非
        // 后面的 middleware 修改了它。
        return returnValue
    }
}
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