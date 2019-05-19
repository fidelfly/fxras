import { defineMessages } from "react-intl";

export const progressMessages = defineMessages({
    "backup.progress.backup": {
        id: "backup.progress.backup",
        defaultMessage: "Backup..., please wait. (About 5 minutes)",
    },
    "progress.grantlock": {
        id: "progress.grantlock",
        defaultMessage: "Asking for action lock...",
    },
    "backup.progress.readinfo": {
        id: "backup.progress.readinfo",
        defaultMessage: "Load backup information...",
    },
    "backup.delete.progress.removedb": {
        id: "backup.delete.progress.removedb",
        defaultMessage: "Remove backup data in database...",
    },
    "backup.delete.progress.removefile": {
        id: "backup.delete.progress.removefile",
        defaultMessage: "Remove backup files...",
    },
});

export function formatProgress(intl, message) {
    if (message) {
        if (typeof message === "string") {
            if (progressMessages[message]) {
                return intl.formatMessage(progressMessages[message]);
            } else {
                return message;
            }
        } else if (message.message) {
            if (progressMessages[message.message]) {
                return intl.formatMessage(progressMessages[message.message], message.data);
            } else {
                return message.message;
            }
        }
    }
    return undefined;
}
