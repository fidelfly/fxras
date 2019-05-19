export const USER_UPDATE = "USER_UPDATE";
export const LANG_UPDATE = "LANG_UPDATE";

export function updateUser(userInfo) {
    return { type: USER_UPDATE, userInfo };
}

export function updateLang(language) {
    return { type: LANG_UPDATE, language };
}
