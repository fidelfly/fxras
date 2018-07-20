import React from 'react';
import { Cookies } from '../utils'
import ajax from '../ajax'
import { Spin } from 'antd'
import { WsPath } from '../system'
import { connect } from 'react-redux';

export const AuthorizeCookie = "Authorize-Access-Key"

function getAccessKey() {
    return Cookies.get(AuthorizeCookie)
}

function validateAuthorize(positive, negative) {
    let key = getAccessKey();
    if (!key || key.length === 0) {
        return false;
    }
    ajax.post(WsPath.OAuth, key).then(()=> {
        if(positive) {
            positive();
        }
    }).catch(() => {
        if (negative) {
            negative();
        }
    });
}

function isAuthorized() {
    let key = getAccessKey();
    return key && key.length > 0;
}

export default {getAccessKey, validateAuthorize, isAuthorized}

const mapStateToProps = state => {
    return {
        authVerify: !state.authVerified,
    }
}

export function withAuthorizeCheck(AuthComponent, UnAuthComponent) {
    let authComponent = class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authChecking : false,
            }
        }

        componentWillMount() {
            if (isAuthorized() && this.props.authVerify) {
                this.setState({authChecking: true})
                validateAuthorize(()=> {
                   this.setState({authChecking: false})
                }, ()=> {
                    this.setState({authChecking: false})
                });
            }
        }

        render() {
            if(this.state.authChecking) {
                return <Spin size="large" style={{width: "100%", height: "100%", paddingTop: "10%"}} />
            }
            let {authVerify, ...otherProps} = this.props;
            if (isAuthorized()) {
                return <AuthComponent {...otherProps}/>
            } else {
                return <UnAuthComponent {...otherProps}/>
            }
        }

    }

    return connect(mapStateToProps)(authComponent);
}
