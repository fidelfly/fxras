import {Component} from "react";
import { Menu, Icon } from "antd"
import { Link } from "react-router-dom"
import {appMessage} from "../messages";
import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types'

class AppHeader extends Component {
    render() {
        return (
            <Menu mode={"horizontal"} className={"App-Header-Menu"}>
                <Menu.SubMenu title={
                    <span>
                        <Icon type="user"/>
                        <span>{this.props.userInfo.name}</span>
                    </span>}>
                    <Menu.Item key={"logout"}>
                        <Link to={"/logout"}>
                            <Icon type={"logout"}/>
                            <span><FormattedMessage {...appMessage.logout}/></span>
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>

            </Menu>
        )
    }

}

AppHeader.propTypes = {
    userInfo: PropTypes.object,
}

export default AppHeader