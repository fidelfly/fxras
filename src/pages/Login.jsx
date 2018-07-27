import React from 'react';
import { Form, Icon, Input, Button, Alert } from 'antd';
import { Redirect } from 'react-router-dom'
import auth, { withAuthorizeCheck } from '../authorize'
import {injectIntl, FormattedMessage, defineMessages} from "react-intl";
import { appMessage} from "../messages";
import { findErrorMessage } from "../errors";
import { grantToken } from "../actions";

const loginMessage = defineMessages({
    user : {
        id: 'login.user',
        defaultMessage: 'User Name',
        description: 'Placeholder for user name input'
    },
    userWarning: {
        id: 'login.user.warning',
        defaultMessage: 'Please input User Name',
        description: ''
    },
    password : {
        id: 'login.pwd',
        defaultMessage: 'Password',
        description: 'Placeholder for password input'
    },
    pwdWarning: {
        id: 'login.pwd.warning',
        defaultMessage: 'Please input password!',
        description: ''
    }

})

const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = (e) => {
        let { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                auth.requestToken(values).then(data => {
                    dispatch(grantToken(data))
                }).catch(err => {
                    this.setState({error : err})
                })
            }
        });
    };

    clearError = (e) => {
        this.setState({error: null});
    };

    render() {
        const { intl } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span><FormattedMessage {...appMessage.name}/></span>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: intl.formatMessage(loginMessage.userWarning) }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder={intl.formatMessage(loginMessage.user)} onChange={this.clearError} />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: intl.formatMessage(loginMessage.pwdWarning) }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={intl.formatMessage(loginMessage.password)} onChange={this.clearError} />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                <FormattedMessage id={"login.loginBtn"} defaultMessage={"Login"}/>
                            </Button>
                        </FormItem>
                    </Form>
                    {this.state.error && <Alert message={ intl.formatMessage(findErrorMessage(this.state.error)) } className="login-error" type="error" />}
                </div>
            </div>

        );
    }
}


export default withAuthorizeCheck((props)=> {
    const {from} = props.location.state || {from: {pathname: '/app/home'}}
    return (<Redirect to={from} />)
}, injectIntl(Form.create()(Login)));