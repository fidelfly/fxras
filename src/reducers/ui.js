import {SIDER_MENU_TOGGLE, SIDER_THEME_UPDATE, SIDER_WIDTH_UPDATE} from "../actions";
import { combineReducers } from 'redux';

function collapsed( collapse = false, action) {
    switch (action.type) {
        case SIDER_MENU_TOGGLE:
            return !collapse;
        default:
            return collapse
    }
}

function siderTheme( theme = 'light', action) {
    switch (action.type) {
        case SIDER_THEME_UPDATE:
            return action.theme;
        default:
            return theme;
    }
}

function siderWidth( width = "250", action) {
    switch (action.type) {
        case SIDER_WIDTH_UPDATE:
            return action.width;
        default:
            return width;
    }
}

export default combineReducers({
    collapsed,
    siderTheme,
    siderWidth,
})