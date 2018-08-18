import AxiosUtil from "../utils/axios";
import authorize from "../authorize";
import {WebsocketObject} from "./websocket";


export function createProgress(url, data, config) {
    if (!config.withAuthInject) {
        return sendProgressRequest(url, data, config)
    } else {
        return injectProgressAuth(url, data, config)
    }
}

function injectProgressAuth(url, data, config) {
    return authorize.checkAuthorizeBeforeAjax(url).then(() => {
        return sendProgressRequest(url, data, config)
    }).catch((error) => {
        if(error &&error.code &&error.code === authorize.TokenExpiredCode) {
            return authorize.refreshToken().then((data) => {
                return sendProgressRequest(url, data, config);
            })
        }
        return Promise.reject(error);
    })
}

function sendProgressRequest(url, data, config) {
    return new Promise(function (resolve, reject) {
        let webUrl = AxiosUtil.getURL(url, data);
        webUrl = authorize.fillAuthorizeUrl(webUrl);
        config = config || {}
        if(config.onmessage) {
            let orgFunc = config.onmessage
            config.onmessage = function (evt) {
                orgFunc.apply(this, [evt]);
                if(!this.key && evt.data) {
                    data = JSON.parse(evt.data)
                    if (data.progressKey) {
                        this.key = data.progressKey;
                        resolve(this);
                    }
                }
            }
        } else {
            config.onmessage = function (evt) {
                if(!this.key && evt.data) {
                    data = JSON.parse(evt.data)
                    if (data.progressKey) {
                        this.key = data.progressKey;
                        resolve(this);
                    }
                }
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