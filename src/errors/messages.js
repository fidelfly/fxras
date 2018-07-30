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
    }
})

export const findErrorMessage = (error)=> {
    if(error) {
        let msgId = '';
        if (typeof error === 'string') {
            msgId = error;
        } else if(error.code) {
            msgId = error.code;
        }
        if (msgId.length > 0) {
            return ErrorMsg[msgId] || ExceptionMsg[msgId] || {id: 'errorMsg_No_Key', defaultMessage: error.toString()};
        } else {
            return {id: 'errorMsg_No_Key', defaultMessage: error.toString()};
        }
    }
    return undefined;
}
