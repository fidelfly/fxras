import React, {Component} from "react";
import {Button, message} from 'antd'
import ProgressBar from "../components/ProgressBar";
import {connect} from 'react-redux'
import {attachCancelablePromise, clearProgress, startProgress} from "../utils";
import ajax from "../ajax";
import AxiosUtil from "../utils/axios";
class ProgressDemo extends Component{
    showProgress = () => {
        let {dispatch} = this.props;
        dispatch(startProgress("progressDemo", undefined, {name: "Progress Demo", message: "Processing..."})).then((ws) => {
            return attachCancelablePromise(ajax.post("/example/progress", {progressKey: ws.key}, AxiosUtil.FormRequestConfig), this).promise
        }).then(() => {
            message.success("Progress Done")
        }).catch((err) => {
            message.error("Error found!")
        }).finally(() => {
                dispatch(clearProgress("progressDemo"))
        })
    }
    render() {
        return (
            <div className={"ProgressDemo"}>
                <Button onClick={this.showProgress}>{"Progress 1"}</Button>
                <ProgressBar code={"progressDemo"} className={"Progress"}/>
            </div>
        )
    }
}

export default connect()(ProgressDemo)