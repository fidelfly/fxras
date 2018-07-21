import React from 'react';
import { Spin } from 'antd'
import { connect } from 'react-redux';

import * as auth from './utils'

const mapStateToProps = state => {
    return {
        authVerify: !state.authVerified,
    }
}

export default function withAuthorizeCheck(AuthComponent, UnAuthComponent) {
    let authComponent = class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authChecking : false,
            }
        }

        componentWillMount() {
            if (auth.isAuthorized() && this.props.authVerify) {
                this.setState({authChecking: true})
                auth.validateAuthorize(()=> {
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
            if (auth.isAuthorized()) {
                return <AuthComponent {...otherProps}/>
            } else {
                return <UnAuthComponent {...otherProps}/>
            }
        }

    }
    return connect(mapStateToProps)(authComponent);
}