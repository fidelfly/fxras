import {defineMessages} from "react-intl";

export const ExceptionMsg = defineMessages({
    name : {
        id: 'app.name',
        defaultMessage: 'M18 SAAS Admin',
        description: 'Name of App'
    }
})

export const ErrorMsg = defineMessages({

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
