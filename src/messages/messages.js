import {defineMessages} from "react-intl";

export const appMessage = defineMessages({
    name : {
        id: 'app.name',
        defaultMessage: 'Fxstart Admin',
        description: 'Name of App'
    },
    shortName : {
        id: 'app.name.short',
        defaultMessage: 'Fxstart',
        description: 'Short Name of App'
    },
    copyright : {
        id: 'app.copyright',
        defaultMessage: 'Fxstart Admin © lyismydg 2018',
        description: 'Copyright description'
    },
    logout : {
        id: 'app.logout',
        defaultMessage: 'Logout',
    },
    userCode : {
        id: 'user.code',
        defaultMessage: 'User Code',
        description: 'User Code',
    },
    userName : {
        id: 'user.name',
        defaultMessage: 'User Name',
        description: 'User Name'
    },
    submit : {
        id: "submit",
        defaultMessage: "Submit",
    },
    cancel : {
        id: "cancel",
        defaultMessage: "Cancel",
    },
    updateSuccess : {
        id: "update.success",
        defaultMessage: "Update successfully."
    },
    updateFailed : {
        id: "update.failed",
        defaultMessage: "Update failed."
    },
    originalPwd: {
        id: "password.original",
        defaultMessage: "Original Password"
    },
    newPwd: {
        id: "password.new",
        defaultMessage: "New Password"
    }
})
