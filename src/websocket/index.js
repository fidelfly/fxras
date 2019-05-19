import AxiosUtil from "../utils/axios";
import * as WsUtil from "./websocket";
import * as ProgressUtil from "./progress";

export { WsUtil };

var websocketManager = new Map();

export default {
    getWebsocket(url, data) {
        return new Promise(function(resolve, reject) {
            let webUrl = AxiosUtil.getURL(url, data);
            let wsObj = websocketManager.get(webUrl);
            if (wsObj) {
                resolve(wsObj);
            } else {
                resolve(
                    WsUtil.createWebsocket(webUrl, undefined, {
                        ssl: true,
                        onopen: function(...args) {
                            websocketManager.set(webUrl, this);
                        },
                    })
                );
            }
        });
    },
    createProgress(url, data, wsConfig) {
        return new Promise(function(resolve, reject) {
            let webUrl = AxiosUtil.getURL(url, data);
            let wsObj = websocketManager.get(webUrl);
            if (wsObj) {
                resolve(wsObj);
            } else {
                resolve(
                    ProgressUtil.createProgress(webUrl, undefined, {
                        ssl: true,
                        onopen: function(...args) {
                            websocketManager.set(webUrl, this);
                        },
                        ...wsConfig,
                    })
                );
            }
        });
    },
};
