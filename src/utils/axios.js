
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
            return parseParam(data)
        }
        return data;
    }]
}

const parseParam = (param, key) => {
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
            paramStr += parseParam(param[i], k)
        }
    }
    return paramStr;
}

export default {JSONRequestConfig, FormRequestConfig}