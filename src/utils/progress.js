import { progressActive, progressClear, progressUpdate } from "../actions";
import websocket from "../websocket";
import { WsPath } from "../system";
export function startProgress(code, initData, info) {
    return (dispatch) => {
        dispatch(progressActive(code, initData, info));
        return websocket.createProgress(WsPath.Resource.Progress, undefined, {
            onmessage: function(evt) {
                if (this.key && evt.data) {
                    let progress = JSON.parse(evt.data);
                    if (progress.code) {
                        let { code, ...data } = progress;
                        dispatch(progressUpdate(code, data));
                    }
                }
            },
        });
    };
}

export function clearProgress(code) {
    return (dispatch) => {
        dispatch(progressClear(code));
    };
}

export const makeCancelable = (promise) => {
    let hasCanceled_ = false;

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then(
            (val) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
            (error) => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
};

export function attachCancelablePromise(promise, target) {
    let cancelablePromise = makeCancelable(promise);
    if (target) {
        target.acp = target.acp || [];
        target.acp.push(cancelablePromise);
    }
    return cancelablePromise;
}

export function cancelAttachedPromise(target, unattach) {
    if (target) {
        if (target.acp && target.acp.length > 0) {
            for (let p of target.acp) {
                p.cancel();
            }
            if (unattach) {
                delete target.acp;
            }
        }
    }
}
