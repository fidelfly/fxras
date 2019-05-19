import { Component } from "react";
import { Spin, Icon } from "antd";
import { Link, Redirect } from "react-router-dom";
import { injectIntl, defineMessages, FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import auth from "../authorize";
import "../style/logout.less";
import React from "react";
import PropTypes from "prop-types";
import ajax from "../ajax";
import AxiosUtil from "../utils/axios";
import WsPath from "../system/webservice";
import { logout } from "../actions";

const messages = defineMessages({
    logoutLoading: {
        id: "app.logout.loading",
        defaultMessage: "You are leaving...",
        description: "tip for logout",
    },
    returnToLogin: {
        id: "app.logout.return",
        defaultMessage: "Return to login",
        description: "tip to login",
    },
});

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logout: !props.userInfo || !auth.isAuthorized() || !auth.isTokenValid(),
        };
    }
    componentWillMount() {
        if (!this.state.logout) {
            let { dispatch } = this.props;
            ajax.post(AxiosUtil.getURL(WsPath.Service.logout))
                .then((data) => {
                    dispatch(logout());
                    auth.logout();
                    this.setState({ logout: true });
                })
                .catch(ajax.showErrorMessage);
        }
    }

    render() {
        if (this.props.userInfo) {
            let { intl } = this.props;
            if (this.state.logout) {
                return (
                    <div className="Logout">
                        <Link to="/login">
                            <Icon type={"login"} />
                            <FormattedMessage {...messages.returnToLogin} />
                        </Link>
                    </div>
                );
            } else {
                return (
                    <Spin
                        size="large"
                        style={{ width: "100%", height: "100%", paddingTop: "10%" }}
                        tip={intl.formatMessage(messages.logoutLoading)}
                    />
                );
            }
        } else {
            return <Redirect to="/login" />;
        }
    }
}

Logout.propTypes = {
    userInfo: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
    };
};

export default injectIntl(connect(mapStateToProps)(Logout));
