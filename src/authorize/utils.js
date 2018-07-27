import { AxiosUtil, Cookies } from '../utils'
import ajax from '../ajax'
import { WsPath, CookieKeys, StorageKeys } from '../system'
import {WsError} from "../errors";


const basicAuthKey = makeBasicAuth("awsadmin", "awsadmin123456")

function makeBasicAuth(user, password) {
    var authKey = user + ':' + password;
    return "Basic " + btoa(authKey);
}

export function getAccessToken() {
    return Cookies.get(CookieKeys.AccessToken)
}

export function getAuthorizeToken() {
    return Cookies.get(CookieKeys.TokenType) + ' ' + getAccessToken()
}

function getRefreshToken() {
    return localStorage.getItem(StorageKeys.RefreshToken)
}

function getTokenExpired() {
    return localStorage.getItem(StorageKeys.TokenExpired)
}

export function getUserID() {
    return localStorage.getItem(StorageKeys.UserID)
}

function setToken(data) {
    Cookies.set(CookieKeys.AccessToken, data["access_token"]);
    Cookies.set(CookieKeys.TokenType, data["token_type"])
    if (data["refresh_token"]) {
        localStorage.setItem(StorageKeys.RefreshToken, data["refresh_token"])
    }
    localStorage.setItem(StorageKeys.TokenExpired, new Date().getTime() + data["expires_in"] * 1000)
    localStorage.setItem(StorageKeys.UserID, data["user_id"])
    return data;
}

function clearToken(error) {
    Cookies.remove(CookieKeys.AccessToken);
    Cookies.remove(CookieKeys.TokenType);
    localStorage.removeItem(StorageKeys.RefreshToken);
    localStorage.removeItem(StorageKeys.TokenExpired);
    localStorage.removeItem(StorageKeys.UserID);
    if (error) {
        return Promise.reject(error)
    }
}

export function requestToken(formdata) {
    if (!formdata || !formdata["username"] || !formdata["password"]) {
        return new Promise(function (resolve, reject) {
            reject(new Error("No Username Or Password"));
        });
    }
    formdata["grant_type"] = "password";
    formdata["scope"] = "all";
    let ajaxConfig = {...AxiosUtil.FormRequestConfig, headers: {Authorization : basicAuthKey}, withAuthInject: false}
    return ajax.post(WsPath.OAuth.token, formdata, ajaxConfig).then(setToken);
}

export function refreshToken() {
    let key = getRefreshToken();
    if (key && key.length > 0) {
        let ajaxConfig = {...AxiosUtil.FormRequestConfig, headers: {Authorization : basicAuthKey}, withAuthInject: false}
        return ajax.post(WsPath.OAuth.token, {"access_token": getAccessToken(), "grant_type" : "refresh_token", "scope" : "all", "refresh_token" : key}, ajaxConfig).then(setToken).catch(clearToken);
    }
}

export function isAuthorized() {
    let key = getAccessToken();
    return key && key.length > 0;
}

export function isTokenValid() {
    let expiredValue = getTokenExpired()
    if(expiredValue && expiredValue.length > 0) {
        let expiredTime = Number(expiredValue);
        if (new Date().getTime() >= expiredTime) {
            return false;
        }
        return true;
    }
    return false;
}

export function fillAuthorizeHeader(header) {
    if (header && !header["Authorization"]) {
        let accessToken = getAuthorizeToken();
        if (accessToken) {
            header["Authorization"] = accessToken;
        }
    }
    return header
}

export const UnauthorizedCode = "UNAUTHORIZED"
export const TokenExpiredCode = "TOKENEXPIRED"

export function checkAuthorizeBeforeAjax(url) {
    return new Promise(function (resolve, reject) {
        if(isProtected(url)) {
            if (isAuthorized()) {
                if (!isTokenValid()) {
                    return refreshToken();
                }
            } else {
                reject(new WsError(UnauthorizedCode, `${url} is under protected, You should grant authorized first`));
            }
        }
        resolve();
    })
}

export function isProtected(url) {
    if(url.startsWith("/admin") && url !== '/admin/token') {
        return true;
    }
    return false;
}

export function logout() {
    clearToken();
}

//export default {getAccessToken, validateAuthorize, isAuthorized}

if (!isAuthorized()) {
    clearToken();
}



