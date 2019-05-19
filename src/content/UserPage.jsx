import React, { Component } from "react";
import { Avatar, Button, Form, Input, Row, Col, message } from "antd";
import { defineMessages, FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { WsPath } from "../system";
import "../style/userpage.less";
import { appMessage } from "../messages";
import { AvatarUploader } from "../components";
import { updateUser } from "../actions";
import ajax from "../ajax";
import { AxiosUtil } from "../utils";
const myMessages = defineMessages({
    editBtn: {
        id: "userpage.editBtn",
        defaultMessage: "Edit",
    },
    nameWarning: {
        id: "userpage.name.warning",
        defaultMessage: "Please input new name",
    },
});

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            updating: false,
        };
    }

    handleSubmit = (e) => {
        let { dispatch, intl } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = { ...values };
                if (this.avatar) {
                    data.avatar = this.avatar.id;
                }
                this.setState({ updating: true });
                ajax.post(WsPath.Resource.User, data, AxiosUtil.FormRequestConfig)
                    .then((data) => {
                        dispatch(updateUser(data));
                        message.success(intl.formatMessage(appMessage.updateSuccess));
                        this.setState({ editing: false, updating: false });
                    })
                    .catch(() => {
                        message.error(intl.formatMessage(appMessage.updateFailed));
                        this.setState({ updating: false });
                    });
            }
        });
    };

    edit = () => {
        this.setState({ editing: true });
    };

    exitEdit = () => {
        this.setState({ editing: false });
    };

    onAvatarUpload = (avatar) => {
        this.avatar = avatar;
    };

    render() {
        let avatar = {};
        let userInfo = this.props.userInfo;
        if (userInfo.avatar && userInfo.avatar > 0) {
            avatar.src = AxiosUtil.getPath(WsPath.PublicResource.Asset, userInfo.avatar);
        } else {
            avatar.icon = "user";
        }
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
            <Row className="User-Page">
                {this.state.editing ? (
                    <div className={"User-Form"}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <AvatarUploader onUpload={this.onAvatarUpload} url={avatar.src} />
                                </div>
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={intl.formatMessage(appMessage.userCode)}>
                                {getFieldDecorator("code", {
                                    initialValue: this.props.userInfo.code,
                                })(<Input disabled={true} />)}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={intl.formatMessage(appMessage.userName)}>
                                {getFieldDecorator("name", {
                                    initialValue: this.props.userInfo.name,
                                    rules: [{ required: true, message: intl.formatMessage(myMessages.nameWarning) }],
                                })(
                                    <Input
                                        disabled={this.state.updating}
                                        placeholder={intl.formatMessage(appMessage.userName)}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item style={{ textAlign: "center" }}>
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    className={"form-btn"}
                                    onClick={this.exitEdit}
                                    disabled={this.state.updating}>
                                    <FormattedMessage {...appMessage.cancel} />
                                </Button>
                                <Button
                                    type="primary"
                                    className={"form-btn"}
                                    htmlType="submit"
                                    loading={this.state.updating}>
                                    <FormattedMessage {...appMessage.submit} />
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                ) : (
                    <div>
                        <Row className={"Info-Item"}>
                            <Col style={{ textAlign: "center" }}>
                                <Avatar shape="square" className={"Avatar"} {...avatar} />
                            </Col>
                        </Row>
                        <Row gutter={40} className={"Info-Item"}>
                            <Col span={12} className={"Info-Label"}>
                                <FormattedMessage {...appMessage.userCode} />
                                <span>:</span>
                            </Col>
                            <Col span={12} className={"Info-Value"}>
                                <span>{this.props.userInfo.code}</span>
                            </Col>
                        </Row>
                        <Row gutter={40} className={"Info-Item"}>
                            <Col span={12} className={"Info-Label"}>
                                <FormattedMessage {...appMessage.userName} />
                                <span>:</span>
                            </Col>
                            <Col span={12} className={"Info-Value"}>
                                <span>{this.props.userInfo.name}</span>
                            </Col>
                        </Row>
                        <Row gutter={40} className={"Info-Item"}>
                            <Col style={{ textAlign: "center" }}>
                                <Button type={"primary"} className={"info-edit"} onClick={this.edit}>
                                    <FormattedMessage {...myMessages.editBtn} />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </Row>
        );
    }
}

UserPage.propTypes = {
    userInfo: PropTypes.object,
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
    };
};

export default connect(mapStateToProps)(injectIntl(Form.create()(UserPage)));
