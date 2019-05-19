import { Params, StorageKeys } from "./system";
import util from "./utils";

function getLang() {
    var lang = util.getQueryVariable(Params.LangCode);
    if (!lang || lang.length === 0) {
        lang = localStorage.getItem(StorageKeys.LangCode);
    }

    if (!lang || lang.length === 0) {
        lang = "en";
    }
    return lang;
}

/*function getClientCode(validate) {
    if (validate) {
        //validate the access info
    }
    return localStorage.getItem(StorageKeys.ClientCode);
}*/

var myLang = getLang();
if (!window.appLocale[myLang]) {
    //Append locale script
}
var InitData = {
    language: myLang,
    authVerified: false,
    tokenInfo: {},
    userInfo: {},
    ui: {
        collapsed: false,
        siderTheme: "light",
        siderWidth: 250,
    },
    progress: {},
};

export { InitData };
