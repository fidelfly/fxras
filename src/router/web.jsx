import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from '../Home'
import App from "../app/App";
import Login from "../pages/Login"
import '../style/index.less'


export default () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/app" component={App} />
            <Route exact path="/login" component={Login} />
        </Switch>
    </Router>
)