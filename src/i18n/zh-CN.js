import antdZh from "antd/lib/locale-provider/zh_CN";
import appLocaleData from "react-intl/locale-data/zh";
import zhMessages from "../locales/zh.json";

window.appLocale = window.appLocale || {};

window.appLocale["zh"] = {
    messages: {
        ...zhMessages,
    },
    antd: antdZh,
    locale: "zh-CN",
    data: appLocaleData,
};
