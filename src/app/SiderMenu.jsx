import {Component} from "react";
import {Menu, Icon} from "antd";
import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom'
import { SiderMenus } from "../system";
import { MenuMessage } from "../messages";
import { injectIntl} from 'react-intl';
import { PathUtil} from "../utils";

class SiderMenu extends Component {
    constructor(props) {
        super(props);
        this.state = this.initStatus(props)
    }

    initStatus = (props) => {
        //const { pathname } = props.location;
        const pathname = props.path;
        let state = {};

        if (props.collapsed) {
            state = {
                openKeys: [],
                selectedKeys: [pathname]
            }
        } else {
            let parentPath = PathUtil.getParent(pathname)
            state = {
                openKeys: parentPath !== pathname ? [parentPath] : [],
                selectedKeys: [pathname]
            }
        }
        return state;
    }

/*    componentWillReceiveProps(newProps) {
        if (this.props.collapsed !== newProps.collapsed) {
            this.setState(this.initStatus(newProps))
        }
    }*/

/*    menuClick = (e) => {
        this.setState({
            selectedKeys: [e.key]
        })
    }

    openMenu = (v) => {
        if (this.props.collapsed) {
            return
        }
        this.setState({
            openKeys: [v[v.length - 1]],
        });
    }*/

    renderMenuItem = ({key, title, icon, link, ...props}) => {
        let { intl } = this.props;
        return (
            <Menu.Item key={key || link} {...props}>
                <Link to={link || key}>
                    {icon && <Icon type={icon} />}
                    <span>{intl.formatMessage(MenuMessage[title])}</span>
                </Link>
            </Menu.Item>
        )
    }

    renderSubMenu = ({key, title, icon, link, sub, ...props}) => {
        let { intl } = this.props;
        return (
            <Menu.SubMenu key={key || link} title={
                <span>
                    {icon && <Icon type={icon} />}
                    <span>{intl.formatMessage(MenuMessage[title])}</span>
                </span>
            } {...props}>
                {sub && sub.map(item => this.renderMenuItem(item))}
            </Menu.SubMenu>
        )
    }

    render() {
        return (
            <Menu inlineCollapsed={this.props.collapsed} mode={this.props.collapsed ? 'vertical' : 'inline'} theme={this.props.theme} defaultSelectedKeys={this.state.selectedKeys} defaultOpenKeys={this.state.openKeys}>
                {SiderMenus && SiderMenus.map(item => item.sub && item.sub.length ? this.renderSubMenu(item) : this.renderMenuItem(item))}
            </Menu>
        )
    }
}

SiderMenu.propTypes = {
    onClick : PropTypes.func,
    menus : PropTypes.array,
    path : PropTypes.string,
}

/*const mapStateToProps = state => {
    return {
        theme: state.ui.siderTheme,
        collapsed: state.ui.collapsed,
    }
}*/

export default injectIntl(SiderMenu)

//export default withRouter(connect(mapStateToProps)(injectIntl(SiderMenu)))