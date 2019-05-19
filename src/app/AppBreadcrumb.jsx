import { Component } from "react";
import { Icon, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import React from "react";
import PropTypes from "prop-types";
import { SiderMenus } from "../system";
import { MenuMessage } from "../messages";
import { PathUtil } from "../utils";

class AppBreadcrumb extends Component {
    resolveMenuInfo = (path) => {
        let paths = PathUtil.resolvePath(path);
        let menuInfo = [];
        let menus = SiderMenus;
        if (path !== "/app/home") {
            let homeInfo = menus.find((item) => item.key === "/app/home");
            menuInfo.push(homeInfo);
        }
        let menuKey = "";
        for (let i = 0; i < paths.length; i++) {
            menuKey += PathUtil.Separator + paths[i];
            let menuItem = menus.find((item) => item.key === menuKey);
            if (menuItem !== undefined) {
                if (menuItem.sub) {
                    let { sub, ...itemProps } = menuItem;
                    itemProps.folder = true;
                    menuInfo.push(itemProps);
                    menus = sub;
                } else {
                    if (menuKey === path) {
                        menuItem = { ...menuItem };
                        menuItem.last = true;
                    }
                    menuInfo.push(menuItem);
                }
            }
        }
        return menuInfo;
    };
    render() {
        let menuInfo = this.resolveMenuInfo(this.props.path);
        return (
            <Breadcrumb className={"App-Breadcrumb"}>
                {menuInfo.map((item) => {
                    if (item.folder || item.last) {
                        return (
                            <Breadcrumb.Item key={item.key}>
                                {item.icon && <Icon type={item.icon} />}
                                <FormattedMessage {...MenuMessage[item.title]} />
                            </Breadcrumb.Item>
                        );
                    } else {
                        return (
                            <Breadcrumb.Item key={item.key || item.link}>
                                <Link to={item.link || item.key}>
                                    {item.icon && <Icon type={item.icon} />}
                                    <FormattedMessage {...MenuMessage[item.title]} />
                                </Link>
                            </Breadcrumb.Item>
                        );
                    }
                })}
            </Breadcrumb>
        );
    }
}

AppBreadcrumb.propTypes = {
    path: PropTypes.string,
};

export default AppBreadcrumb;
