import { combineReducers } from 'redux';
import { authVerified, tokenInfo } from './authorize'
import { userInfo, language} from "./reducers";
import ui from './ui'
import progress from './progress'

export default combineReducers({
    language,
    authVerified,
    tokenInfo,
    userInfo,
    ui,
    progress
});