import React, { Component } from "react";
import { Table, Upload, Button, Progress, Icon, Tag, message } from "antd";
import { defineMessages, FormattedMessage, injectIntl } from "react-intl";
import WsPath from "../system/webservice";
import "../style/install.less";
import utilities, { MessageUtil } from "../utils";
import ajax from "../ajax";
import { appMessage } from "../messages";
import { formatErrorMessage } from "../errors";

const Dragger = Upload.Dragger;

const myMessages = defineMessages({
    fileName: {
        id: "install.file.name",
        defaultMessage: "File Name",
    },
    module: {
        id: "install.file.module",
        defaultMessage: "Module",
    },
    moduleDesc: {
        id: "install.file.module.desc",
        defaultMessage: "Module Description",
    },
    releaseDate: {
        id: "install.file.module.releaseDate",
        defaultMessage: "Release Date",
    },
    moduleVersion: {
        id: "install.file.module.version",
        defaultMessage: "Version",
    },
    moduleMinRequiredVersion: {
        id: "install.file.module.mrv",
        defaultMessage: "Minimum Required Version",
    },
    currentVersion: {
        id: "install.module.current.version",
        defaultMessage: "Current Version",
    },
    fileStatus: {
        id: "install.file.status",
        defaultMessage: "Status",
    },
});

class InstallPage extends Component {
    state = {
        data: [],
        selectedRowKeys: [],
        installing: false,
    };

    fileColumns = [
        {
            title: <FormattedMessage {...appMessage.operations} />,
            dataIndex: "action",
            width: 50,
            render: (text, record, index) => {
                return (
                    <div className={"Operations"}>
                        <Button type="primary" onClick={this.remove.bind(this, index, record)}>
                            <FormattedMessage id={"install.module.remove"} defaultMessage={"Remove"} />
                        </Button>
                    </div>
                );
            },
        },
        {
            title: <FormattedMessage {...myMessages.fileName} />,
            dataIndex: "name",
            width: 150,
            render: (text, record, index) => {
                if (record.md5) {
                    return text;
                }
                return (
                    <div className={"uploading-file"}>
                        <div>{text}</div>
                        <Progress percent={record.percent} strokeWidth={5} status={record.pstatus} showInfo={false} />
                    </div>
                );
            },
        },
        {
            title: <FormattedMessage {...myMessages.module} />,
            dataIndex: "module",
            width: 100,
        },
        {
            title: <FormattedMessage {...myMessages.moduleDesc} />,
            dataIndex: "module_name",
            width: 200,
        },
        {
            title: <FormattedMessage {...myMessages.releaseDate} />,
            dataIndex: "release_date",
            width: 100,
            render: (text, record, index) => {
                if (text) {
                    return utilities.formatDate(new Date(text), "yyyy-MM-dd HH:mm:ss");
                }
            },
        },
        {
            title: <FormattedMessage {...myMessages.moduleVersion} />,
            dataIndex: "version",
            width: 100,
            render: (text, record, index) => {
                if (!record.md5) {
                    return text;
                }
                switch (record.status) {
                    case 0:
                        return <Tag color={"green"}>{text}</Tag>;
                    case 1:
                        return <Tag color={"blue"}>{text}</Tag>;
                    case 2:
                        return <Tag color={"volcano"}>{text}</Tag>;
                    case 3:
                        return <Tag color={"red"}>{text}</Tag>;
                }
            },
        },
        {
            title: <FormattedMessage {...myMessages.moduleMinRequiredVersion} />,
            dataIndex: "min_version_required",
            width: 100,
            render: (text, record, index) => {
                if (!record.md5) {
                    return text;
                } else if (text) {
                    switch (record.status) {
                        case 0:
                            return <Tag color={"green"}>{text}</Tag>;
                        case 1:
                            return <Tag color={"blue"}>{text}</Tag>;
                        case 2:
                            return <Tag color={"volcano"}>{text}</Tag>;
                        case 3:
                            return <Tag color={"red"}>{text}</Tag>;
                    }
                }
            },
        },
        {
            title: <FormattedMessage {...myMessages.currentVersion} />,
            dataIndex: "current_version",
            width: 100,
            render: (text, record, index) => {
                if (!record.md5) {
                    return text;
                }
                if (text) {
                    switch (record.status) {
                        case 0:
                            return <Tag color={"green"}>{text}</Tag>;
                        case 1:
                            return <Tag color={"blue"}>{text}</Tag>;
                        case 2:
                            return <Tag color={"volcano"}>{text}</Tag>;
                        case 3:
                            return <Tag color={"red"}>{text}</Tag>;
                    }
                    return <Tag color="green">{text}</Tag>;
                } else {
                    return (
                        <Tag color="lime">
                            <FormattedMessage id={"module.not.install"} />
                        </Tag>
                    );
                }
            },
        },
        {
            title: <FormattedMessage {...myMessages.fileStatus} />,
            dataIndex: "status",
            width: 100,
            render: (text, record, index) => {
                switch (record.status) {
                    case 0:
                        return (
                            <Tag color={"green"}>
                                <FormattedMessage id={"file.status.new"} defaultMessage={"Install"} />
                            </Tag>
                        );
                    case 1:
                        return (
                            <Tag color={"blue"}>
                                <FormattedMessage id={"file.status.upgrade"} defaultMessage={"Upgrade"} />
                            </Tag>
                        );
                    case 2:
                        return (
                            <Tag color={"volcano"}>
                                <FormattedMessage id={"file.status.existed"} defaultMessage={"Existed"} />
                            </Tag>
                        );
                    case 3:
                        return (
                            <Tag color={"red"}>
                                <FormattedMessage id={"file.status.conflict"} defaultMessage={"Version Conflict"} />
                            </Tag>
                        );
                }
            },
        },
    ];

    fileKey = 1;

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
        let newData = [...this.state.data];
        if (selectedRows.length > 0) {
            let newSelectedRowKeys = this.state.selectedRowKeys.filter((row) => selectedRowKeys.indexOf(row) >= 0);

            let apps = newData.filter((obj) => newSelectedRowKeys.indexOf(obj.key) >= 0).map((obj) => obj.module);

            selectedRows = selectedRows.filter((obj) => newSelectedRowKeys.indexOf(obj.key) < 0);
            if (selectedRows.length > 0) {
                for (let obj of selectedRows) {
                    if (apps.indexOf(obj.module) < 0) {
                        newSelectedRowKeys.push(obj.key);
                        apps.push(obj.module);
                    }
                }
            }

            for (let i = 0; i < newData.length; i++) {
                let obj = newData[i];
                obj.disabled = !obj.md5 || obj.status > 1;
                if (!obj.disabled && newSelectedRowKeys.indexOf(obj.key) < 0) {
                    if (apps.indexOf(obj.module) >= 0) {
                        obj.disabled = true;
                    }
                }
            }
            selectedRowKeys = newSelectedRowKeys;
        } else {
            for (let i = 0; i < newData.length; i++) {
                let obj = newData[i];
                obj.disabled = !obj.md5 || obj.status > 1;
            }
        }
        this.setState({ data: newData, selectedRowKeys: selectedRowKeys });
    };

    tableSelectOption() {
        const { selectedRowKeys } = this.state;
        return {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: (record) => ({
                disabled: record.disabled, // Column configuration not to be checked
            }),
        };
    }

    onFileChange = (info) => {
        if (info.file.status === "uploading") {
            if (!info.file.dataKey) {
                let fileData = {
                    pstatus: "active",
                    percent: info.file.percent,
                    key: this.fileKey++,
                    name: info.file.name,
                    disabled: true,
                };
                info.file.dataKey = fileData.key;
                info.file.dataIndex = this.state.data.length;
                this.setState({ data: this.state.data.concat(fileData) });
            } else {
                let data = [...this.state.data];
                let index = info.file.dataIndex;
                if (index >= 0 && index < data.length) {
                    data[index].percent = info.file.percent;
                }
                this.setState({ data: data });
            }
        } else if (info.file.status === "error") {
            if (info.file.dataKey) {
                let data = [...this.state.data];
                let index = info.file.dataIndex;
                if (index >= 0 && index < data.length) {
                    let fileData = { ...data[index] };
                    fileData.pstatus = "exception";
                    data[index] = fileData;
                    this.setState({ data: data });
                }
            }
        } else if (info.file.status === "done") {
            if (info.file.dataKey) {
                let data = [...this.state.data];
                let index = info.file.dataIndex;
                if (index >= 0 && index < data.length) {
                    let fileData = { ...data[index], ...info.file.response };
                    fileData.percent = info.file.percent;
                    fileData.pstatus = "success";
                    fileData.disabled = fileData.status > 1;
                    data[index] = fileData;
                    this.setState({ data: data });
                }
            }
        }
    };

    install = () => {
        if (this.state.selectedRowKeys.length > 0) {
            let { intl } = this.props;
            this.setState({ installing: true });
            let selectedData = this.state.data.filter((item) => this.state.selectedRowKeys.indexOf(item.key) >= 0);
            let postData = selectedData.map((item) => item.md5);
            ajax.post(WsPath.Resource.Module, { modules: postData })
                .then((data) => {
                    if (data && data.length) {
                        this.updateData(data);
                    }
                    message.success(
                        MessageUtil.FormatMessage(intl, appMessage.actionSuccess, undefined, {
                            action: appMessage.install,
                        })
                    );
                })
                .catch((err) => {
                    message.error(
                        formatErrorMessage(
                            intl,
                            err,
                            MessageUtil.FormatMessage(intl, appMessage.actionFailed, undefined, {
                                action: appMessage.install,
                            })
                        )
                    );
                })
                .finally(() => {
                    this.setState({ installing: false });
                });
        }
    };

    updateData = (data) => {
        let mapData = {};
        for (let i = 0; i < data.length; i++) {
            mapData[data[i].md5] = data[i];
        }
        let newData = [...this.state.data];
        for (let i = 0; i < newData.length; i++) {
            let dataItem = newData[i];
            if (dataItem.md5 && dataItem.length > 0) {
                let uData = mapData[dataItem.md5];
                if (uData) {
                    dataItem["current_version"] = uData["current_version"];
                    dataItem["status"] = uData["status"];
                }
            }
        }
        this.setState({ data: newData, selectedRowKeys: [] });
    };

    remove = (index, record) => {
        let newData = [...this.state.data];
        let data = newData[index];
        if (this.state.selectedRowKeys.indexOf(data.key) >= 0) {
            let newSelectedKeys = [...this.state.selectedRowKeys];
            newSelectedKeys = newSelectedKeys.filter((item) => item !== data.key);
            newData.splice(index, 1);
            this.setState({ data: newData, selectedRowKeys: newSelectedKeys });
        } else {
            newData.splice(index, 1);
            this.setState({ data: newData });
        }
    };

    clear = () => {
        this.setState({ selectedRowKeys: [], data: [] });
    };

    render() {
        return (
            <div className={"Install"}>
                <Dragger
                    name="file"
                    multiple={true}
                    accept=".mapp"
                    action={WsPath.Resource.File}
                    customRequest={ajax.upload}
                    onChange={this.onFileChange}
                    disabled={this.state.installing}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                        <FormattedMessage
                            id={"install.upload.description"}
                            defaultMessage={"Click or drag file to this area to upload"}
                        />
                    </p>
                    <p className="ant-upload-hint">
                        <FormattedMessage id={"install.upload.fileType"} defaultMessage={"Support *.mapp only"} />
                    </p>
                </Dragger>
                <Table
                    className={"File-Table"}
                    loading={this.state.installing}
                    rowKey={"key"}
                    bordered
                    size={"middle"}
                    pagination={false}
                    columns={this.fileColumns}
                    dataSource={this.state.data}
                    rowSelection={this.tableSelectOption()}
                />
                <div style={{ textAlign: "center", marginTop: "2rem" }} className={"Footer"}>
                    <Button
                        size={"large"}
                        type={"primary"}
                        loading={this.state.installing}
                        disabled={this.state.data.length === 0 || this.state.selectedRowKeys.length === 0}
                        onClick={this.install}>
                        <FormattedMessage id={"install.module.install"} defaultMessage={"Install/Upgrade"} />
                    </Button>
                    <Button
                        size={"large"}
                        type={"warning"}
                        disabled={this.state.data.length === 0 || this.state.installing}
                        onClick={this.clear}>
                        <FormattedMessage id={"install.module.clear"} defaultMessage={"Clear"} />
                    </Button>
                </div>
            </div>
        );
    }
}

export default injectIntl(InstallPage);
