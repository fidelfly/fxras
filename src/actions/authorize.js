export const GRANT_TOKEN = "GRANT_TOKEN";
export const CLEAR_TOKEN = "CLEAR_TOKEN";

export const LOGOUT = "LOGOUT";

export function grantToken(tokenInfo) {
    return { type: GRANT_TOKEN, tokenInfo };
}

export function clearToken() {
    return { type: CLEAR_TOKEN };
}

export function logout() {
    return { type: LOGOUT };
}
