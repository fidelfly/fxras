import React from 'react';
import { Form, Icon, Input, Button, Alert } from 'antd';
import { Redirect } from 'react-router-dom'
import ajax from "../ajax";
import { AxiosUtil } from '../utils'
import { withAuthorizeCheck } from '../authorize'

const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                ajax.post('/auth/token', values, AxiosUtil.FormRequestConfig).then(ajax.checkResponse).then(data => {
                    if (data.tokenId) {
                        localStorage.setItem("tokenId", data.tokenId);
                    }
                    this.setState({isAuthorized: localStorage.getItem("access-token") !== null});
                }).catch(err => {
                    this.setState({error: {errorCode: err.errorCode, errorMessage: err.errorMessage}})
                })
            }
        });
    };

    clearError = (e) => {
        this.setState({error: null});
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>M18 Admin</span>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('user', {
                                rules: [{ required: true, message: 'Please input User Name' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="User Name" onChange={this.clearError} />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('pwd', {
                                rules: [{ required: true, message: 'Please input password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" onChange={this.clearError} />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                Login
                            </Button>
                        </FormItem>
                    </Form>
                    {this.state.error && <Alert message={this.state.error.errorMessage} className="login-error" type="error" />}
                </div>
            </div>

        );
    }
}


export default withAuthorizeCheck((props)=> {
    const {from} = props.location.state || {from: {pathname: '/app/home'}}
    return (<Redirect to={from} />)
}, Form.create()(Login));