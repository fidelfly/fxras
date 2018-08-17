import {Component} from "react";
import { Menu, Icon, Avatar, Badge, Drawer, List } from "antd"
import { Link } from "react-router-dom"
import {appMessage} from "../messages";
import {FormattedMessage} from "react-intl";
import React from "react";
import PropTypes from 'prop-types'
import {AxiosUtil} from "../utils"
import {WsPath} from "../system"
import {ProgressBar} from "../components";
import {injectIntl} from 'react-intl'

class AppHeader extends Component {
    state = {
        showDrawer: false,
    }

    showDrawer = () => {
        this.setState({showDrawer: true})
    }

    closeDrawer = () => {
        this.setState({showDrawer: false})
    }

    render() {
        let pks = Object.keys(this.props.progress)
        let {intl} = this.props
        return (
            <Menu mode={"horizontal"} className={"App-Header-Menu"}>
                <Menu.Item key={"progress"}>
                    <a onClick={this.showDrawer}>
                        <Badge count={pks.length}>
                            <Icon type={"switcher"} title={intl.formatMessage(appMessage.backgroundProgress)}/>
                        </Badge>
                    </a>
                    <Drawer
                        title={<div><FormattedMessage {...appMessage.backgroundProgress}/>{"( " + pks.length + " )"}</div>}
                        width={520}
                        closable={true}
                        onClose={this.closeDrawer}
                        visible={this.state.showDrawer}
                    >
                        {pks.length === 0 && <div><FormattedMessage id={"progress.empty"} defaultMessage={"No Progress Running..."}/></div>}
                        {pks.length > 0 &&
                        <div>
                            <List dataSource={pks} renderItem={item => {
                                return (
                                    <List.Item key={item}>
                                        <ProgressBar code={item} style={{flexGrow: 1}} messagePos={"top"}/>
                                    </List.Item>
                                )
                            }} />
                        </div>
                        }
                    </Drawer>
                </Menu.Item>
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
    progress: PropTypes.object,
}

export default injectIntl(AppHeader)