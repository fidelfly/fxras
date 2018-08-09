import {defineMessages} from "react-intl";

export const ExceptionMsg = defineMessages({
    name : {
        id: 'app.name',
        defaultMessage: 'Fxras Admin',
        description: 'Name of App'
    }
})

export const ErrorMsg = defineMessages({
    "invalid_grant" : {
        id: "invalid_grant",
        defaultMessage: 'Password Or User is wrong!',
        description: 'Info for Password & User Input'
    },
    "PASSWORD_UNCHANGE" : {
        id: "error.password.unchange",
        defaultMessage: "New password is same as the original password."
    },
    "INVALID_ORG_PASSWORD" : {
        id: "error.password.invalidOrgPwd",
        defaultMessage: "The original password is wrong"
    }
})

export const findErrorMessage = (error, defaultMsg)=> {
    if(error) {
        let msgId = '';
        if (typeof error === 'string') {
            msgId = error;
        } else if(error.code) {
            msgId = error.code;
        }
        if (msgId.length > 0) {
            return ErrorMsg[msgId] || ExceptionMsg[msgId] || {id: 'errorMsg_No_Key', defaultMessage: defaultMsg || error.toString()};
        } else {
            return {id: 'errorMsg_No_Key', defaultMessage: defaultMsg || error.toString()};
        }
    }
    return undefined;
}
