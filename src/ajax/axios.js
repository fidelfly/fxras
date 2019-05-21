import axios from "axios";
import { AxiosUtil } from "../utils";
import { message } from "antd";
import authorize from "../authorize";
import { WsError, WsException } from "../errors";

const DefaultRequestConfig = AxiosUtil.JSONRequestConfig;

export const resolveData = (res) => {
    let data = res.data;
    if (data && (data.errorCode || data.error)) {
        return Promise.reject(
            new WsError(data.errorCode || data.error, data.errorMessage || data["error_description"], data.data)
        );
    }
    return data;
};

export const resolveError = (error) => {
    let status = error.response.status;
    let data = error.response.data;
    if (data) {
        if (data.errorCode || data.error) {
            return Promise.reject(
                new WsException(
                    status,
                    data.errorCode || data.error,
                    data.errorMessage || data["error_description"],
                    data.data
                )
            );
        } else {
            return Promise.reject(new WsException(status, `Server(${status})`, data.toString()));
        }
    }
    return Promise.reject(error);
};

export const showErrorMessage = (error) => {
    if (error && error.code && error.message) {
        message.error(error.message);
    } else {
        Promise.reject(error);
    }
};

axios.interceptors.response.use(resolveData, resolveError);

axios.interceptors.request.use(
    function(config) {
        config = config || {};
        let headers = config.headers || {};
        config.headers = authorize.fillAuthorizeHeader(headers);
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

export const post = (url, data, config = DefaultRequestConfig) => {
    if (config.withAuthInject === false) {
        return axios.post(url, data, config);
    }
    return authRequest("post", url, data, config);
};

export const get = (url, config = DefaultRequestConfig) => {
    if (config.withAuthInject === false) {
        return axios.get(url, config);
    }
    return authRequest("get", url, undefined, config);
};

export const del = (url, config = DefaultRequestConfig) => {
    if (config.withAuthInject === false) {
        return axios.delete(url, config);
    }
    return authRequest("delete", url, undefined, config);
};

const authRequest = (method, url, data, config = DefaultRequestConfig) => {
    return authorize
        .checkAuthorizeBeforeAjax(url)
        .then(() => {
            return request(method, url, data, config);
        })
        .catch((error) => {
            if (error && error.code) {
                if (error.code === authorize.TokenExpiredCode) {
                    return authorize.refreshToken().then(() => {
                        config.headers = authorize.removeAuthorizeHeader(config.headers);
                        return request(method, url, data, config);
                    });
                } else if (error.code === authorize.UnauthorizedCode) {
                    window.location = "/";
                }
            }
            return Promise.reject(error);
        });
};

const request = (method, url, data, config = DefaultRequestConfig) => {
    method = method.toUpperCase();
    if (method === "GET") {
        return axios.get(url, config);
    } else if (method === "POST") {
        return axios.post(url, data, config);
    } else if (method === "DELETE") {
        return axios.delete(url, config);
    } else if (method === "PUT") {
        return axios.put(url, data, config);
    }
};

export const upload = ({ action, data, file, filename, headers, onError, onProgress, onSuccess, withCredentials }) => {
    const formData = new FormData();
    if (data) {
        Object.keys(data).map((key) => {
            formData.append(key, data[key]);
            return key;
        });
    }

    formData.append(filename, file);
    let config = {
        withCredentials,
        headers,
        onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
        },
    };
    authRequest("POST", action, formData, config)
        .then((response) => {
            onSuccess(response, file);
        })
        .catch(onError);

    return {
        abort() {
            console.log("upload progress is aborted."); //eslint-disable-line
        },
    };
};
