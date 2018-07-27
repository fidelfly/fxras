import React, { Component } from 'react';
import '../style/app.less';
import {FormattedMessage, defineMessages, injectIntl} from 'react-intl';
import { withAuthorizeCheck } from '../authorize'
import { Spin, Layout, Icon } from 'antd'
import { withRouter, Redirect } from 'react-router-dom'
import { AxiosUtil } from '../utils'
import ajax from '../ajax'
import { WsPath } from '../system'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateUser, toggleMenu } from "../actions";
import SiderMenu from './SiderMenu'
import AppHeader from './AppHeader'
import {appMessage} from "../messages";
import AppBreadcrumb from "./AppBreadcrumb";
const { Header, Sider, Content, Footer } = Layout;

const messages = defineMessages({
    userLoading : {
        id: 'app.user.loading',
        defaultMessage: "Loading User's Information",
        description: 'tip for loading'
    }

})

class App extends Component {
  state = {
     loading: true,
  }

  componentWillMount() {
      let { dispatch } = this.props;
      ajax.get(AxiosUtil.getURL(WsPath.Resource.User, {userId : this.props.userId})).then( data => {
        dispatch(updateUser(data));
      }).catch(ajax.showErrorMessage).finally(() => {
        this.setState({loading: false});
      });
  }

  toggle = () => {
      let { dispatch } = this.props;
      dispatch(toggleMenu())
  }

  render() {
    let {intl} = this.props;
    if (this.state.loading) {
      return <Spin size="large" style={{width: "100%", height: "100%", paddingTop: "10%"}} tip = {intl.formatMessage(messages.userLoading)}/>
    }
    return (
        <Layout className={"App"}>
            <Sider className={"App-Sider"} collapsed={this.props.collapsed} theme={this.props.siderTheme} width={this.props.siderWidth} trigger={null}>
                <div className="App-Logo"><FormattedMessage {...(this.props.collapsed ? appMessage.shortName : appMessage.name)}/></div>
                <SiderMenu theme={this.props.siderTheme} collapsed={this.props.collapsed} path={this.props.location.pathname}/>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} className={"App-Header"}>
                    <Icon
                        className="trigger"
                        type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <AppHeader userInfo={this.props.userInfo}/>
                </Header>
                <Content className={"App-Content"}>
                    <AppBreadcrumb path={this.props.location.pathname}/>
                </Content>
                <Footer className="App-Footer">
                    <FormattedMessage {...appMessage.copyright}/>
                </Footer>
            </Layout>
        </Layout>
    )
  }
}

App.propTypes = {
    userId: PropTypes.number,
    userInfo: PropTypes.object,
    siderTheme: PropTypes.oneOf(['dark', 'light']),
    siderWidth: PropTypes.number
}

const mapStateToProps = state => {
    return {
        userId: state.tokenInfo['user_id'],
        userInfo: state.userInfo,
        collapsed: state.ui.collapsed,
        siderTheme: state.ui.siderTheme,
        siderWidth: state.ui.siderWidth,
    }
}

export default withRouter(withAuthorizeCheck(injectIntl(connect(mapStateToProps)(App)), (props)=>(<Redirect to={{pathname: '/login', state: {from: props.location}}} />)));
