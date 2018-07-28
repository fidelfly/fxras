import { combineReducers } from 'redux';
import { authVerified, tokenInfo } from './authorize'
import { userInfo, language} from "./reducers";
import ui from './ui'

export default combineReducers({
    language,
    authVerified,
    tokenInfo,
    userInfo,
    ui,
});