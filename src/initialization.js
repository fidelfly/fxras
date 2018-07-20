import { Params, CookieKeys } from './system'
import util, {Cookies} from './utils'

function getLang() {
    var lang = util.getQueryVariable(Params.LangCode);
    if(!lang || lang.length === 0) {
        lang = Cookies.get(CookieKeys.LangCode);
    }

    if (!lang || lang.length === 0) {
        lang = 'en-US';
    }
    return lang;
}

function getClientCode(validate) {
    if (validate) {
        //validate the access info
    }
    return Cookies.get(CookieKeys.ClientCode);
}

var InitData = {
    locale : getLang(),
    clientCode: getClientCode(),
    authVerified: false,
}

export  {
    InitData
}
