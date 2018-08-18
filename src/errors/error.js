export class WsError extends Error {
    code;
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}

export class WsException extends WsError {
    status;
    constructor(status, code, message, data) {
        super(code, message);
        this.status = status;
        this.data = data;
    }
}
