import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker';
import { AppContainer } from 'react-hot-loader';
import {LocaleProvider} from 'antd'
import { createStore, applyMiddleware } from 'redux';
import { addLocaleData, IntlProvider }from 'react-intl'
import thunk from 'redux-thunk';
import reducer from './reducers';
import Web from './router/web'
import { InitData } from './initialization'

const middleware = [thunk];
const store = createStore(reducer, InitData, applyMiddleware(...middleware));

const appLocale = window.appLocale;

addLocaleData(appLocale.data)

const render = Component => {
    ReactDOM.render(
        <Provider store={store}>
            <LocaleProvider locale={appLocale.antd}>
                <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
                    <AppContainer>
                        <Component store={store} />
                    </AppContainer>
                </IntlProvider>
            </LocaleProvider>
        </Provider>,
        document.getElementById('root')
    );
};

/*ReactDOM.render(
    <LocaleProvider locale={appLocale.antd}>
        <IntlProvider locle={appLocale.locale} messages={appLocale.messages}>
            <App />
        </IntlProvider>
    </LocaleProvider>,
    document.getElementById('root'));*/

render(Web);

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
        render(Web);
    })
}

registerServiceWorker();