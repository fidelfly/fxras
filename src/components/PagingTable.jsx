import React from "react";
import { Table } from "antd";
import ajax from "../ajax";
import { AxiosUtil } from "../utils";
import PropTypes from "prop-types";

class PagingTable extends React.Component {
    state = {
        data: [],
        pagination: {
            pageSize: 10,
            current: 1,
        },
        sortField: "create_time",
        sortOrder: "ascend",
        loading: false,
    };

    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
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
        });
    };

    fetchData = (params = {}) => {
        this.setState({ loading: true });
        ajax.get(AxiosUtil.getURL(this.props.dataPath, params))
            .then((resp) => {
                const pagination = { ...this.state.pagination };
                pagination.total = resp.count;
                this.setState({
                    data: resp.data,
                    pagination: pagination,
                    loading: false,
                });
            })
            .catch((err) => {
                this.setState({ loading: false });
            });
    };

    refresh = () => {
        this.fetchData({
            results: this.state.pagination.pageSize,
            page: this.state.pagination.current,
            sortField: this.state.sortField,
            sortOrder: this.state.sortOrder,
        });
    };

    componentDidMount() {
        this.refresh();
    }

    render() {
        let { dataPath, columns, ...otherProps } = this.props;
        return (
            <Table
                columns={columns}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                {...otherProps}
            />
        );
    }
}

PagingTable.propTypes = {
    columns: PropTypes.array.isRequired,
    dataPath: PropTypes.string.isRequired,
};

export default PagingTable;
