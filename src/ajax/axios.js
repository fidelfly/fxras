import axios from 'axios';
import {AxiosUtil} from '../utils'
import {message} from 'antd';
import authorize from '../authorize'
import { WsError, WsException } from '../errors'

export const get = ({url, msg = 'Interface Error', headers}) =>
    axios.get(url, headers).then(res => res.data).catch(err => {
        console.log(err);
        message.warn(msg);
    });

const DefaultRequestConfig = AxiosUtil.JSONRequestConfig

const refreshToken = (res) => {
    let token = res.headers['access-token'];
    if (token) {
        localStorage.setItem('access-token', token)
    }
}

export const resolveData = (res) => {
    let data = res.data;
    if (data && data.errorCode) {
        return Promise.reject(new WsError(data.errorCode, data.errorMessage));
    }
    return data;
}

export const resolveError = (error) => {
    let status = error.response.status;
    let data = error.response.data;
    return Promise.reject(new WsException(status, data.error, data.error_description))
}

/*export const checkResponse = (res) => {
    if(res.errorCode != null) {
        return Promise.reject(res)
    }
    return res;
}*/

/*const errorCatch = (err) => {
    refreshToken(err.response);
    console.log(err);
    //message.warn(err)
    return err
}*/

axios.interceptors.response.use(resolveData, resolveError)

axios.interceptors.request.use(function(config) {
    let accessToken = authorize.getAccessToken();
    if (accessToken) {
        config = config || {}
        let headers = config.headers || {};
        headers['Access-Token'] = accessToken;
        config.headers = headers;
    }
    return config;
}, function(error) {
    return Promise.reject(error);
})

export const post = (url, data, config = DefaultRequestConfig) => {
    return axios.post(url, data, config)
}

export const request = (method, url, data, config = DefaultRequestConfig) => {
    method = method.toUpperCase();
    if (method === 'GET') {
        return axios.get(url, config)
    } else if (method === 'POST') {
        return axios.post(url, data, config)
    } else if (method === 'DELETE') {
        config.data = data;
        return axios.delete(url, config)
    } else if (method === 'PUT') {
        return axios.put(url, data, config);
    } else if (method === 'OPTIONS') {
        config.method = 'OPTIONS';
        config.url = url;
        config.data = data;
        return axios.request(config)
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
