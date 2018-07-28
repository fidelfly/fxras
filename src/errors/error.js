export class WsError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

export class WsException extends WsError {
    status;
    constructor(status, code, message) {
        super(code, message);
        this.status = status;
    }
}
