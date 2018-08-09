import React from 'react';
import { Table } from 'antd';
import {defineMessages, FormattedMessage} from 'react-intl'
import ajax from '../ajax'
import {WsPath} from "../system";
import utilities, {AxiosUtil} from '../utils'

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
    state = {
        data: [],
        pagination: {
            pageSize: 10,
            current: 1,
        },
        sortField: 'create_time',
        sortOrder: 'ascend',
        loading: false
    };

    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
            sortField: sorter.field,
            sortOrder: sorter.order,
        });
        this.fetchData({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
        })
    };

    fetchData = (params = {}) => {
        this.setState({loading: true})
        ajax.get(AxiosUtil.getURL(WsPath.Resource.Module, params)).then(resp => {
            const pagination = {...this.state.pagination}
            pagination.total = resp.count
            this.setState({
                data: resp.data,
                pagination: pagination,
                loading: false,
            })
        }).catch( err => {
           this.setState({loading: false})
        });
    };

    refresh = () => {
        this.fetchData({
            results: this.state.pagination.pageSize,
            page: this.state.pagination.current,
            sortField: this.state.sortField,
            sortOrder: this.state.sortOrder,
        })
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        return (
            <Table columns={columns}
                   rowKey={record => record.id}
                   dataSource={this.state.data}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleTableChange}
                   size={"small"}
            />
        )
    }
}