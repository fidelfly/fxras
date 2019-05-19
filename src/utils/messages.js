const FormatMessage = (intl, message, params0, params1) => {
    let args = {};
    if (params0 || params1) {
        if (params0) {
            args = { ...params0 };
        }
        if (params1) {
            for (let key in params1) {
                args[key] = intl.formatMessage(params1[key]);
            }
        }
    }

    return intl.formatMessage(message, args);
};

export default { FormatMessage };
