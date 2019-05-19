import * as utils from "./utilities";
import Cookies from "./cookies";
import AxiosUtil from "./axios";
import MessageUtil from "./messages";
export * from "./path";
export * from "./progress";

var utilities = { ...utils };

export { Cookies, AxiosUtil, MessageUtil };

export default utilities;
