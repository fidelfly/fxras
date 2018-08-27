import React from 'react';
import { Switch, Route} from 'react-router-dom';
import { AppHome, UserPage, Password } from '../content'
import {ProgressDemo} from '../example'
export default class AppRouter extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/app/home" component={AppHome} />
                <Route exact path="/app/profile/user" component={UserPage}/>
                <Route exact path="/app/profile/password" component={Password}/>
                <Route exact path="/app/demo/progress" component={ProgressDemo}/>
            </Switch>
        )
    }
}