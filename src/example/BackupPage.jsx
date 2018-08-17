import React, {Component} from "react";
import {defineMessages, FormattedMessage, injectIntl} from "react-intl";
import {Button, message} from "antd"
import utilities, {AxiosUtil, clearProgress, MessageUtil, startProgress, attachCancelablePromise, cancelAttachedPromise} from "../utils";
import WsPath from "../system/webservice";
import PagingTable from "../components/PagingTable";
import "../style/backup.less"
import {appMessage, actions, formatProgress} from "../messages";
import ajax from '../ajax'
import {formatErrorMessage} from "../errors";
import {ProgressBar} from '../components'
import {connect} from 'react-redux'
import { Prompt } from "react-router-dom";
const myMessages = defineMessages({
    createBackup : {
        id : "backup.create",
        defaultMessage: "Create backup"
    },
    deleteBackup : {
        id : "backup.delete",
        defaultMessage: "Delete backup"
    },
    backupType : {
        id : "backup.type",
        defaultMessage : "Type"
    },
    createTime : {
        id : "backup.createTime",
        defaultMessage : "Create Time"
    },
    path : {
        id : "backup.path",
        defaultMessage : "Path"
    },
    manualType : {
        id : "backup.type.manual",
        defaultMessage: "Manual"
    },
});

const BackupAction = {
    create : "backup.create",
    delete : function (key) {
        if(key) {
            return "backup.delete" + "." + key
        } else {
            return "backup.delete"
        }
    },
    restore : "backup.restore"
}

class BackupPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            creating: false,
            deleting: [],
            restoring: false,
            key: 0,
            progress : [],
        }
        this.tableRef = React.createRef()
    }

    columns = [{
        title: <FormattedMessage {...myMessages.backupType}/>,
        dataIndex: "type",
        width: '20%',
        render: (text, record, index) => {
            switch (text) {
                case "manual":
                    return <FormattedMessage {...myMessages.manualType}/>
                default:
                    return text;
            }
        }
    }, {
        title: <FormattedMessage {...myMessages.createTime}/>,
        dataIndex: "create_time",
        sorter: true,
        sortOrder: 'ascend',
        width: "30%",
        render: (text, record, index) => {
            return utilities.formatDate(new Date(text), "yyyy-MM-dd HH:mm:ss");
        }
    }, {
        title: <FormattedMessage {...myMessages.path}/>,
        dataIndex: "path",
        width: '30%',
    }, {
        title:  <FormattedMessage {...appMessage.operations}/>,
        dataIndex: "action",
        width: '20%',
        render: (text, record, index) => {
            return (
                <div className={"Operations"}>
                    <Button type="danger"
                            disabled={this.state.key === record.id && this.state.restoring}
                            loading={this.state.deleting.indexOf(record.id) >= 0 && this.state.deleting}
                            onClick={this.deleteBackup.bind(this, index, record)}>
                        <FormattedMessage {...appMessage.delete}/>
                    </Button>
                    <Button type="primary"
                            disabled={(this.state.deleting.indexOf(record.id) >= 0) || (this.state.key !== record.id && this.state.restoring)}
                            loading={this.state.key === record.id && this.state.restoring}
                            onClick={this.restore.bind(this, index, record)}>
                        <FormattedMessage {...appMessage.restore}/>
                    </Button>
                </div>
            );
        },
    }
    ];

    deleteBackup = (index, record) => {
        let { intl, dispatch } = this.props;
        let deleteAction = BackupAction.delete(record.id);
        this.setState({key: record.id, deleting: utilities.immutableAdd(this.state.deleting, record.id), progress: utilities.immutableAdd(this.state.progress, deleteAction)});
        dispatch(startProgress(deleteAction, {message: record.path}, {name: intl.formatMessage(myMessages.deleteBackup), message: record.path})).then((ws) => {
            return attachCancelablePromise(ajax.del(AxiosUtil.getURL(AxiosUtil.getPath(WsPath.Resource.Backup, record.id), {progressKey : ws.key})), this).promise
        }).then(() => {
            message.success(MessageUtil.FormatMessage(intl, appMessage.actionSuccess, undefined, {action: appMessage.delete}));
            this.tableRef.current.refresh()
            this.setState({key: 0, deleting: utilities.immutableRemove(this.state.deleting, record.id), progress: utilities.immutableRemove(this.state.progress, deleteAction)})
        }).catch( err => {
            if (!err.isCanceled) {
                message.error(formatErrorMessage(intl, err, MessageUtil.FormatMessage(intl, appMessage.actionFailed, undefined, {action: appMessage.delete})))
                this.setState({key: 0, deleting: utilities.immutableRemove(this.state.deleting, record.id), progress: utilities.immutableRemove(this.state.progress, deleteAction)})
            }
        }).finally(() => {
            dispatch(clearProgress(deleteAction))
        })
    }

    restore = (index, record) => {
        let { intl } = this.props;
        this.setState({key: record.id, restoring: true});
        ajax.post(AxiosUtil.getPath(WsPath.Service.restore, record.id)).then(() => {
            message.success(MessageUtil.FormatMessage(intl, appMessage.actionSuccess, undefined, {action : appMessage.restore}))
            //message.success(intl.formatMessage(appMessage.actionSuccess, {action: intl.formatMessage(appMessage.restore)}));
        }).catch( err => {
            message.error(formatErrorMessage(intl, err, MessageUtil.FormatMessage(intl, appMessage.actionFailed, undefined, {action : appMessage.restore})))
            //message.error(intl.formatMessage(findErrorMessage(err, intl.formatMessage(appMessage.actionFailed, {action: intl.formatMessage(appMessage.restore)}))))
        }).finally(() => {
            this.setState({key: 0, restoring: false})
        })
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        cancelAttachedPromise(this, true)
    }


    createBackup = () => {
        this.setState({creating: true, progress: utilities.immutableAdd(this.state.progress, BackupAction.create)});
        let {dispatch, intl} = this.props
        dispatch(startProgress(BackupAction.create, undefined, {name: intl.formatMessage(myMessages.createBackup), message: formatProgress("backup.progress.backup")})).then((ws) => {
            return attachCancelablePromise(ajax.post(WsPath.Resource.Backup, {progressKey: ws.key}, AxiosUtil.FormRequestConfig), this).promise
        }).then(() => {
            let { intl } = this.props;
            message.success(MessageUtil.FormatMessage(intl, appMessage.actionSuccess, undefined, {action: appMessage.create}))
            this.tableRef.current.refresh();
            this.setState({creating: false, progress: utilities.immutableRemove(this.state.progress, BackupAction.create)})
        }).catch(err => {
            if (!err.isCanceled) {
                let { intl } = this.props;
                message.error(formatErrorMessage(intl, err, MessageUtil.FormatMessage(intl, appMessage.actionFailed, undefined, {action: appMessage.create})))
                this.setState({creating: false, progress: utilities.immutableRemove(this.state.progress, BackupAction.create)})
            }
        }).finally(() => {
            dispatch(clearProgress(BackupAction.create));
        })
    }

    refreshTable = () => {
        this.tableRef.current.refresh();
    }

    render() {
        let { intl } = this.props;
        return (
            <div className={"Backup"}>
                <div className={"Toolbar"}>
                    <Button onClick={this.createBackup} loading={this.state.creating}><FormattedMessage {...myMessages.createBackup}/></Button>
                    <Button onClick={this.refreshTable}><FormattedMessage {...appMessage.refresh}/></Button>
                    {this.state.progress.length > 0 && <ProgressBar code={this.state.progress[0]} className={"Progress"}/>}
                </div>
                <PagingTable columns={this.columns} dataPath={WsPath.Resource.Backup} rowKey={record => record.id} ref={this.tableRef} size={"small"}/>
                <Prompt
                    when= {this.state.creating || this.state.deleting.length > 0 || this.state.restoring}
                    message={localtion => {
                        let action = undefined;
                        if(this.state.restoring) {
                            action = actions["action.backup.restore"]
                        } else if (this.state.deleting.length > 0) {
                            action = actions["action.backup.delete"]
                        } else if (this.state.creating) {
                            action = actions["action.backup.create"]
                        }
                        if(action) {
                           return MessageUtil.FormatMessage(intl, appMessage.leaveWarning, undefined, {action: action})
                        }
                        return "Are you sure to leave?"
                    }
                    }
                />
            </div>
        )
    }
}

export default connect()(injectIntl(BackupPage))