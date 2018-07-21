import { AxiosUtil, Cookies } from '../utils'
import ajax from '../ajax'
import { WsPath, CookieKeys } from '../system'


const basicAuthKey = makeBasicAuth("awsadmin", "awsadmin123456")

function makeBasicAuth(user, password) {
    var authKey = user + ':' + password;
    return "Basic " + btoa(authKey);
}

export function getAccessToken() {
    return Cookies.get(CookieKeys.AccessToken)
}

export function getUserID() {
    return Cookies.get(CookieKeys.UserID)
}

export function requestToken(formdata) {
    if (!formdata || !formdata["username"] || !formdata["password"]) {
        return new Promise(function (resolve, reject) {
            reject(new Error("No Username Or Password"));
        });
    }
    formdata["grant_type"] = "password";
    formdata["scope"] = "all";
    let ajaxConfig = {...AxiosUtil.FormRequestConfig, headers: {Authorization : basicAuthKey}}
    return ajax.post(WsPath.OAuth.token, formdata, ajaxConfig).then((data) => {
        Cookies.set(CookieKeys.AccessToken, data["access_token"]);
        Cookies.set(CookieKeys.UserID, data["user_id"])
    });
}

export function validateAuthorize(positive, negative) {
    let key = getAccessToken();
    if (!key || key.length === 0) {
        return false;
    }
    ajax.post(WsPath.OAuth, key).then(()=> {
        if(positive) {
            positive();
        }
    }).catch(() => {
        if (negative) {
            negative();
        }
    });
}

export function isAuthorized() {
    let key = getAccessToken();
    return key && key.length > 0;
}

//export default {getAccessToken, validateAuthorize, isAuthorized}




