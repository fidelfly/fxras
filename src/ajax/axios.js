import axios from 'axios';
import {AxiosUtil} from '../utils'
import {message} from 'antd';
import authorize from '../authorize'
import { WsError, WsException } from '../errors'

const DefaultRequestConfig = AxiosUtil.JSONRequestConfig

export const resolveData = (res) => {
    let data = res.data;
    if (data && (data.errorCode || data.error)) {
        return Promise.reject(new WsError(data.errorCode || data.error, data.errorMessage || data["error_description"]));
    }
    return data;
}

export const resolveError = (error) => {
    let status = error.response.status;
    let data = error.response.data;
    if(data) {
        if (data.errorCode || data.error) {
            return Promise.reject(new WsException(status, data.errorCode || data.error, data.errorMessage || data["error_description"]))
        } else {
            return Promise.reject(new WsException(status, `Server(${status})`, data.toString()))
        }
    }
    return Promise.reject(error)
}

export const showErrorMessage = (error) => {
    if(error && error.code && error.message) {
        message.error(error.message);
    } else {
        Promise.reject(error)
    }
}

axios.interceptors.response.use(resolveData, resolveError)

axios.interceptors.request.use(function(config) {
    config = config || {}
    let headers = config.headers || {};
    config.headers = authorize.fillAuthorizeHeader(headers);
    return config;
}, function(error) {
    return Promise.reject(error);
})

export const post = (url, data, config = DefaultRequestConfig) => {
    if(config.withAuthInject === false) {
        return axios.post(url, data, config);
    }
    return authRequest("post", url, data, config);
}

export const get = (url, config = DefaultRequestConfig) => {
    if(config.withAuthInject === false) {
        return axios.get(url, config)
    }
    return authRequest("get", url, undefined, config);
}

const authRequest = (method, url, data, config = DefaultRequestConfig) => {
    return authorize.checkAuthorizeBeforeAjax(url).then(() => {
        return request(method, url, data, config)
    }).catch((error) => {
        if(error &&error.code &&error.code === authorize.TokenExpiredCode) {
            return authorize.refreshToken().then((data) => {
                return request(method, url, data, config);
            })
        }
        return Promise.reject(error);
    })
}

const request = (method, url, data, config = DefaultRequestConfig) => {
    method = method.toUpperCase();
    if (method === 'GET') {
        return axios.get(url, config)
    } else if (method === 'POST') {
        return axios.post(url, data, config)
    } else if (method === 'DELETE') {
        return axios.delete(url, config)
    } else if (method === 'PUT') {
        return axios.put(url, data, config);
    }
}

export const axiosUpload = (config) => {
    let axiosConfig = {
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            if(config.onProgress) {
                config.onProgress.call(this, {percent : percentCompleted});
            }
        }
    }
    var data = new FormData();
    data.append(config.filename, config.file);
    request(config.method || 'POST', config.action, data, axiosConfig).then(res => {
        if(config.onSuccess) {
            config.onSuccess.call(this, res);
        }
    }).catch(error => {
        if(config.onError) {
            config.onError.call(this, error);
        }
    })
}

/*
export const createWebSocket = (url, config) => {
    if (!url.startsWith('ws')) {
        url = 'ws://' + window.location.host + (url.startsWith('/') ? '' : '/') + url;
    }
    let accessToken = localStorage.getItem("access-token");
    if(accessToken) {
        if (url.indexOf('?') > 0) {
            url += '&';
        } else {
            url += '?';
        }
        url += 'token='+ encodeURIComponent(accessToken)
    }
    let ws = new WebSocket(url);

    ws.onmessage = function(event) {
        if(event.data === 'unauthorized') {
            localStorage.removeItem("access-token");
            localStorage.removeItem("tokenId");
            history.push('/login');
            return;
        }
        if(config.onmessage) {
            config.onmessage(event)
        }

    }

    if(config.onerror){
        ws.onerror = config.onerror;
    };

    if(config.onopen) {
        ws.onopen = config.onopen;
    }

    if(config.onclose) {
        ws.onclose = config.onclose;
    }

    return ws;
}*/
