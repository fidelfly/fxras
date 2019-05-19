import React from "react";
import { Spin } from "antd";
import { connect } from "react-redux";

import * as auth from "./utils";
import { grantToken, clearToken } from "../actions";

const mapStateToProps = (state) => {
    return {
        authVerify: !state.authVerified,
    };
};

export default function withAuthorizeCheck(AuthComponent, UnAuthComponent) {
    let authComponent = class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authChecking: false,
            };
        }

        componentWillMount() {
            if (auth.isAuthorized() && (!auth.isTokenValid() || this.props.authVerify)) {
                let { dispatch } = this.props;
                this.setState({ authChecking: true });
                auth.refreshToken()
                    .then((data) => {
                        dispatch(grantToken(data));
                        this.setState({ authChecking: false });
                    })
                    .catch(() => {
                        dispatch(clearToken());
                        this.setState({ authChecking: false });
                    });
            }
        }

        render() {
            if (this.state.authChecking) {
                return <Spin size="large" style={{ width: "100%", height: "100%", paddingTop: "10%" }} />;
            }
            let { authVerify, ...otherProps } = this.props;
            if (auth.isAuthorized() && auth.isTokenValid()) {
                return <AuthComponent {...otherProps} />;
            } else {
                return <UnAuthComponent {...otherProps} />;
            }
        }
    };
    return connect(mapStateToProps)(authComponent);
}
