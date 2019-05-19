import { PROGRESS_ACTIVE, PROGRESS_CLEAR, PROGRESS_UPDATE } from "../actions";

export default function progress(progress = {}, action) {
    switch (action.type) {
        case PROGRESS_ACTIVE:
            return activeProgress(progress, action);
        case PROGRESS_UPDATE:
            return updateProgress(progress, action);
        case PROGRESS_CLEAR:
            return clearProgress(progress, action);
        default:
            return progress;
    }
}

function activeProgress(progress, action) {
    let newProgress = { ...progress };
    newProgress[action.code] = {
        data: action.data || { status: "active", percent: 0 },
        info: action.info || {},
    };
    return newProgress;
}

function updateProgress(progress, action) {
    let newProgress = { ...progress };
    let myProgress = newProgress[action.code];
    if (myProgress) {
        newProgress[action.code].data = action.data;
        return newProgress;
    }
    return progress;
}

function clearProgress(progress, action) {
    let newProgress = { ...progress };
    if (newProgress[action.code]) {
        delete newProgress[action.code];
    }
    return newProgress;
}
