import React from 'react';
import { Spin } from 'antd'

import { Redirect } from 'react-router-dom'

class Home extends React.Component {
    state = {
        systemChecking: true,
        authorized : false,
    };

    componentWillMount() {
        //check if user login
        setTimeout(() => this.setState({systemChecking: false, authorized: false}), 1000);
    }

    render() {
        if(this.state.systemChecking) {
            return <Spin size="large" style={{width: "100%", height: "100%", paddingTop: "10%"}} />
        }
        if(this.state.authorized) {
            return <Redirect to="/app/home" push />;
        } else {
            return <Redirect to="/login" push />
        }
    }
}

export default Home