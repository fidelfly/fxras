import React from 'react';
import {defineMessages, FormattedMessage} from 'react-intl'
import {WsPath} from "../system";
import utilities from '../utils'
import PagingTable from "./PagingTable";
const messages = defineMessages({
    moduleCode : {
        id: 'module.code',
        defaultMessage: "Code",
        description: 'title for module.code in app list'
    },
    moduleName : {
        id: 'module.name',
        defaultMessage: "Name",
        description: "title for module.name in module list"
    },
    moduleVersion : {
        id: 'module.version',
        defaultMessage: "Version",
        description: "title for module.version in module list"
    },
    createTime: {
        id: 'module.createTime',
        defaultMessage: "Create Time",
        sorter: true,
        description: "title fro module.createTime in module list"
    },
});
const columns = [{
    title: <FormattedMessage {...messages.moduleCode}/>,
    dataIndex: "code",
    width: '20%',
}, {
    title: <FormattedMessage {...messages.moduleName}/>,
    dataIndex: "name",
    width: '30%',
}, {
    title: <FormattedMessage {...messages.moduleVersion}/>,
    dataIndex: "version",
    width: '20%',
}, {
    title: <FormattedMessage {...messages.createTime}/>,
    dataIndex: "create_time",
    sorter: true,
    sortOrder: 'ascend',
    width: "30%",
    render: (text, record, index) => {
        return utilities.formatDate(new Date(text), "yyyy-MM-dd HH:mm:ss");
    }
}
];
export default class ModuleList extends React.Component {
    render() {
        return (
            <PagingTable columns={columns} dataPath={WsPath.Resource.Module} size={"small"} rowKey={record => record.id} ref={this.props.tableRef}/>
        )
    }
}