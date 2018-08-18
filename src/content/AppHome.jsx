import React, {Component} from 'react';
import { Row, Col, Card, Icon } from 'antd';
import {ModuleList} from "../components";
import {defineMessages, FormattedMessage} from "react-intl";
import '../style/home.less'

const messages = defineMessages({
    moduleList : {
        id: 'home.module.list',
        defaultMessage: 'Module List',
        description: 'Title for module list card',
    }
});

class AppHome extends Component {
    constructor(props) {
        super(props);
        this.moduleList = React.createRef();
    }

    refreshModuleList = () => {
        this.moduleList.current.refresh();
    }

    render() {
        return (
            <div className="Home">
                <Row gutter={10} type={"flex"} justify={"center"}>
                    <Col className="App-List" span={24}>
                        <Card bordered={false}>
                            <div className={"Card-Header"}>
                                <h3><FormattedMessage {...messages.moduleList}/></h3>
                                <a className={"Card-Tool"} onClick={this.refreshModuleList}>
                                    <Icon type={"sync"}/>
                                </a>
                            </div>
                            <ModuleList tableRef={this.moduleList}/>
                        </Card>
                    </Col>
                </Row>
            </div>
            )
    }
}

export default AppHome