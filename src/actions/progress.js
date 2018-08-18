export const PROGRESS_ACTIVE = 'PROGRESS_ACTIVE'
export function progressActive(code, initData, info) {
    return {
        type: PROGRESS_ACTIVE,
        code,
        data : initData,
        info
    }
}

export const PROGRESS_UPDATE = 'PROGRESS_UPDATE'
export function progressUpdate(code, data) {
    return {
        type: PROGRESS_UPDATE,
        code,
        data,
    }
}

export const PROGRESS_CLEAR = 'PROGRESS_CLEAR'
export function progressClear(code) {
    return {
        type: PROGRESS_CLEAR,
        code
    }
}