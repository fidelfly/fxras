import {Component} from "react";
import { Menu, Icon, Avatar } from "antd"
import { Link } from "react-router-dom"
import {appMessage} from "../messages";
import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types'
import {AxiosUtil} from "../utils"
import {WsPath} from "../system"

class AppHeader extends Component {
    render() {
        return (
            <Menu mode={"horizontal"} className={"App-Header-Menu"}>
                <Menu.SubMenu title={
                    <span>
                        {this.props.userInfo.avatar > 0 ?
                            <Avatar className={"Avatar"} src={AxiosUtil.getPath(WsPath.PublicResource.Asset, this.props.userInfo.avatar)}/>
                            :
                            <Avatar className={"Avatar"} icon={"user"}/>
                        }
                        <span className={"Avatar-Name"}>{this.props.userInfo.name}</span>
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