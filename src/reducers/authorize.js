import { GRANT_TOKEN, CLEAR_TOKEN, LOGOUT } from "../actions";

export function authVerified(verified = false, action) {
    switch (action.type) {
        case GRANT_TOKEN:
            return true;
        case LOGOUT:
        case CLEAR_TOKEN:
            return false;
        default:
            return verified;
    }
}

export function tokenInfo(token = {}, action) {
    switch (action.type) {
        case GRANT_TOKEN:
            return action.tokenInfo;
        case LOGOUT:
        case CLEAR_TOKEN:
            return {};
        default:
            return token;
    }
}
