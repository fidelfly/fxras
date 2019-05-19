import { defineMessages } from "react-intl";
import { actions } from "../messages";

export const ExceptionMsg = defineMessages({
    name: {
        id: "app.name",
        defaultMessage: "Fxras Admin",
        description: "Name of App",
    },
});

export const ErrorMsg = defineMessages({
    invalid_grant: {
        id: "invalid_grant",
        defaultMessage: "Password Or User is wrong!",
        description: "Info for Password & User Input",
    },
    PASSWORD_UNCHANGE: {
        id: "error.password.unchange",
        defaultMessage: "New password is same as the original password.",
    },
    INVALID_ORG_PASSWORD: {
        id: "error.password.invalidOrgPwd",
        defaultMessage: "The original password is wrong",
    },
    NOT_SUPPORT: {
        id: "error.function.not.support",
        defaultMessage: "This function is not supported!",
    },
    RESOURCE_LOCKED: {
        id: "error.resource.locked",
        defaultMessage: "{user} is doing {action}, please try again later.",
    },
});

export const ErrorMsgFormatter = {
    RESOURCE_LOCKED: (intl, err, msg) => {
        let data = err.data;
        if (data) {
            if (actions[data.action]) {
                data.action = intl.formatMessage(actions[data.action]);
            }
        }
        return intl.formatMessage(msg, data);
    },
};

export const findErrorMessage = (error, defaultMsg) => {
    if (error) {
        let msgId = "";
        if (typeof error === "string") {
            msgId = error;
        } else if (error.code) {
            msgId = error.code;
        }
        if (msgId.length > 0) {
            return (
                ErrorMsg[msgId] ||
                ExceptionMsg[msgId] || { id: "errorMsg_No_Key", defaultMessage: defaultMsg || error.toString() }
            );
        } else {
            return { id: "errorMsg_No_Key", defaultMessage: defaultMsg || error.toString() };
        }
    }
    return undefined;
};

export const formatErrorMessage = (intl, err, defaultMsg) => {
    let msg = findErrorMessage(err, defaultMsg);
    if (err.code) {
        let formatter = ErrorMsgFormatter[err.code];
        if (formatter) {
            return formatter(intl, err, msg);
        }
    }
    return intl.formatMessage(msg, err.data || {});
};
