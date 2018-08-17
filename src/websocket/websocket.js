import authorize from '../authorize'
import {AxiosUtil} from '../utils'

export function createWebsocket(url, data, config) {
    if (!config.withAuthInject) {
        return sendWebsocketRequest(url, data, config)
    } else {
        return injectWebsocketAuth(url, data, config)
    }
}

function injectWebsocketAuth(url, data, config) {
    return authorize.checkAuthorizeBeforeAjax(url).then(() => {
        return sendWebsocketRequest(url, data, config)
    }).catch((error) => {
        if(error &&error.code &&error.code === authorize.TokenExpiredCode) {
            return authorize.refreshToken().then((data) => {
                return sendWebsocketRequest(url, data, config);
            })
        }
        return Promise.reject(error);
    })
}

function sendWebsocketRequest(url, data, config) {
    return new Promise(function (resolve, reject) {
        let webUrl = AxiosUtil.getURL(url, data);
        webUrl = authorize.fillAuthorizeUrl(webUrl);
        config = config || {}
        if(config.onopen) {
            let orgFunc = config.onopen
            config.onopen = function (...args) {
                orgFunc.apply(this, args)
                resolve(this);
            }
        } else {
            config.onopen = function (...args) {
                resolve(this);
            }
        }
        if(config.onerror) {
            let orgFunc = config.onerror
            config.onerror = function (...args) {
                orgFunc.apply(this, args)
                if(!this.isReady()) {
                    reject(this)
                }
            }
        } else {
            config.onerror = function (...args) {
                if(!this.isReady()) {
                    reject(this)
                }
            }
        }

        let wsObj = new WebsocketObject(webUrl, config);
        wsObj.setup();
    });
}

export class WebsocketObject {
    constructor(url, config) {
        this.url = url;
        this.ready = false;
        this.config = config || {ssl : false}
    }

    getUrl() {
        return this.url;
    }

    isReady() {
        return this.ready;
    }

    setup() {
        let webUrl = "";
        if(this.url.startsWith("wss://") || this.url.startsWith("ws://")) {
            webUrl = this.url;
        } else if(this.url.startsWith("/")) {
            webUrl = (this.config.ssl ? 'wss://' : 'ws://') + window.location.host + this.url
        } else {
            webUrl = (this.config.ssl ? 'wss://' : 'ws://') + window.location.host + window.location.pathname + '/' + this.url
        }
        this.ws = new WebSocket(webUrl)
        this.ws.onopen = this.onopen.bind(this);
        this.ws.onclose = this.onclose.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onmessage = this.onmessage.bind(this);
    }

    onopen(...args) {
        this.ready = true;
        if(this.config.onopen) {
            this.config.onopen.apply(this, args)
        }
    }

    onclose(...args) {
        this.ready = false;
        if(this.config.onclose) {
            this.config.onclose.apply(this, args)
        }
    }

    onerror(...args) {
        if(this.config.onerror) {
            this.config.onerror.apply(this, args)
        }
    }

    onmessage(...args) {
        if(this.config.onmessage) {
            this.config.onmessage.apply(this, args)
        }
    }
}