export const ProtectedPrefix = "/fxgos"
export const PublicPrefix = "/public"

export const getProtectedPath = function (path, ...params) {
    if(path && path.length > 0) {
        if(path.startsWith('/')) {
            path = ProtectedPrefix + path;
        } else {
            path = ProtectedPrefix + '/' + path;
        }
        if(params && params.length > 0) {
            for(let i = 0; i < params.length; i++) {
                path += "/" + params[i].toString()
            }
        }
    }
    return path;
}

export const getPublicPath = function (path, ...params) {
    if(path && path.length > 0) {
        if(path.startsWith('/')) {
            return PublicPrefix + path;
        } else {
            return PublicPrefix + '/' + path;
        }
        if(params && params.length > 0) {
            for(let i = 0; i < params.length; i++) {
                path += "/" + params[i].toString()
            }
        }
    }
    return path;
}

export const OAuth = {
    authorize : getProtectedPath('authorize'), //"/fxgos/authorize",
    token : getProtectedPath('token') // "/fxgos/token"
}

export const Resource = {
    User : getProtectedPath('user'), //"/fxgos/user"
    Module : getProtectedPath('module'),
    Asset : getProtectedPath('asset'),
    WebSocket: "/admin/websocket",
    Progress : "/admin/progress",
}

export const PublicResource = {
    Asset : getPublicPath('asset')
}

export const Service = {
    logout : getProtectedPath('logout'), //"/fxgos/logout"
    password : getProtectedPath('password')
}

export const isProtected = function (url) {
    if(url.startsWith("/websocket") || (url.startsWith(ProtectedPrefix) && url !== OAuth.token)) {
        return true;
    }
    return false;
}


export default {OAuth, Resource, Service, PublicResource, ProtectedPrefix, getProtectedPath, getPublicPath, isProtected}
