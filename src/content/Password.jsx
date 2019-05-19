import React, { Component } from "react";
import { Button, Form, Input, message } from "antd";
import { appMessage } from "../messages";
import { defineMessages, FormattedMessage, injectIntl } from "react-intl";
import ajax from "../ajax";
import WsPath from "../system/webservice";
import AxiosUtil from "../utils/axios";
import "../style/password.less";
import { findErrorMessage } from "../errors";
const myMessages = defineMessages({
    orgPwdWarning: {
        id: "password.original.warning",
        defaultMessage: "Please input original password.",
    },
    newPwdWarning: {
        id: "password.new.warning",
        defaultMessage: "Please input new password.",
    },
});

class Password extends Component {
    state = {
        updating: false,
    };

    handleSubmit = (e) => {
        let { intl } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                ajax.post(WsPath.Service.password, values, AxiosUtil.FormRequestConfig)
                    .then((data) => {
                        message.success(intl.formatMessage(appMessage.updateSuccess));
                    })
                    .catch((err) => {
                        //message.error(intl.formatMessage(appMessage.updateFailed))
                        message.error(
                            intl.formatMessage(findErrorMessage(err, intl.formatMessage(appMessage.updateFailed)))
                        );
                    });
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { intl } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="Password">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item {...formItemLayout} label={intl.formatMessage(appMessage.originalPwd)}>
                        {getFieldDecorator("orgPwd", {
                            rules: [{ required: true, message: intl.formatMessage(myMessages.orgPwdWarning) }],
                        })(
                            <Input
                                type={"password"}
                                disabled={this.state.updating}
                                placeholder={intl.formatMessage(appMessage.originalPwd)}
                            />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={intl.formatMessage(appMessage.newPwd)}>
                        {getFieldDecorator("newPwd", {
                            rules: [{ required: true, message: intl.formatMessage(myMessages.newPwdWarning) }],
                        })(
                            <Input
                                type={"password"}
                                disabled={this.state.updating}
                                placeholder={intl.formatMessage(appMessage.newPwd)}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit" loading={this.state.updating}>
                            <FormattedMessage {...appMessage.submit} />
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default injectIntl(Form.create()(Password));
