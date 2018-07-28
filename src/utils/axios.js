
const JSONRequestConfig = {
    headers: {'Content-Type': 'application/json;charset=udf-8'},
    transformRequest: [function (data) {
        if (data === undefined) {
            return '';
        } else if (typeof data === 'string') {
            return data;
        }
        return JSON.stringify(data);
    }]
}

const FormRequestConfig = {
    transformRequest: [function (data) {
        if (typeof data === "object") {
            return decodeParam(data)
        }
        return data;
    }]
}

const getURL = (path, params) => {
    if (params) {
        let paramText = decodeParams(params);
        if(paramText.length > 0) {
            return path + '?' + paramText;
        }
    }
    return path;
}

const decodeParams = (params) => {
    var paramText = '';
    for(let key in params) {
        let value = params[key]
        if (value) {
            if(paramText.length > 0) {
                paramText += '&';
            }
            paramText += decodeParam(value, key);
        }
    }
    return paramText;
}

const decodeParam = (param, key) => {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t === 'string' || t === 'number' || t === 'boolean') {
        paramStr += key + '=' + encodeURIComponent(param);
    } else {
        for (let i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            if (paramStr) {
                paramStr += '&';
            }
            paramStr += decodeParam(param[i], k)
        }
    }
    return paramStr;
}

export default {JSONRequestConfig, FormRequestConfig, decodeParams, getURL}