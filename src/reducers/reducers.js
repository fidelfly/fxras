import {USER_UPDATE, LANG_UPDATE, LOGOUT} from "../actions";

export function userInfo(userInfo = {}, action) {
    switch (action.type) {
        case USER_UPDATE:
            return action.userInfo;
        case LOGOUT:
            return {};
        default:
            return userInfo;
    }
}

export function language(langCode = "en", action) {
    switch (action.type) {
        case LANG_UPDATE:
            return action.language;
        default:
            return langCode
    }
}