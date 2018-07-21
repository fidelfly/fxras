import React, { Component } from 'react';
import './App.css';
import { FormattedMessage, defineMessages } from 'react-intl';
import { withAuthorizeCheck } from '../authorize'
import { Button } from 'antd'
import { Redirect } from 'react-router-dom'

const messages = defineMessages({

})

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type={"primary"}><FormattedMessage id={"button"} defaultMessage={"Button Default"}/></Button>
      </div>
    );
  }
}

export default withAuthorizeCheck(App, (props)=>(<Redirect to={{pathname: '/login', state: {from: props.location}}} />));
