export const ProtectedPrefix = "/fxgos"

export const getProtectedPath = function (path) {
    if(path && path.length > 0) {
        if(path.startsWith('/')) {
            return ProtectedPrefix + path;
        } else {
            return ProtectedPrefix + '/' + path;
        }
    }
    return path;
}

export const OAuth = {
    authorize : getProtectedPath('authorize'), //"/fxgos/authorize",
    token : getProtectedPath('token') // "/fxgos/token"
}

export const Resource = {
    User : getProtectedPath('user') //"/fxgos/user"
}

export const Service = {
    logout : getProtectedPath('logout') //"/fxgos/logout"
}

export const isProtected = function (url) {
    if(url.startsWith(ProtectedPrefix) && url !== OAuth.token) {
        return true;
    }
    return false;
}

export default {OAuth, Resource, Service, ProtectedPrefix, getProtectedPath, isProtected}
