export const SIDER_MENU_TOGGLE = "SIDER_MENU_TOGGLE";
export const SIDER_THEME_UPDATE = "SIDER_THEME_UPDATE";
export const SIDER_WIDTH_UPDATE = "SIDER_WIDTH_UPDATE";

export function setSiderTheme(theme) {
    return { type: SIDER_THEME_UPDATE, theme };
}

export function setSiderWidth(width) {
    return { type: SIDER_WIDTH_UPDATE, width };
}

export function toggleMenu() {
    return { type: SIDER_MENU_TOGGLE };
}
