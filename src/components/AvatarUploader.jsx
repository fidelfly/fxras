import React from "react";
import { Upload, Icon, message } from "antd";
import PropTypes from "prop-types";
import ajax from "../ajax";
import { WsPath } from "../system";

class AvatarUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    upload = (config) => {};

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    beforeUpload = (file) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isLt2M;
    };

    handleChange = (info) => {
        if (info.file.status === "uploading") {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === "done") {
            this.getBase64(info.file.originFileObj, (imageUrl) =>
                this.setState({
                    imageUrl,
                    loading: false,
                })
            );
            if (this.props.onUpload) {
                this.props.onUpload(info.file.response);
            }
        }
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? "loading" : "plus"} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl || this.props.url;
        return (
            <Upload
                accept={"image/*"}
                name="avatar"
                multiple={false}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                data={{ key: "avatar" }}
                action={WsPath.Resource.Asset}
                customRequest={ajax.upload}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}>
                {imageUrl ? <img src={imageUrl} alt="avatar" width={96} height={96} /> : uploadButton}
            </Upload>
        );
    }
}

AvatarUploader.propTypes = {
    url: PropTypes.string,
    onUpload: PropTypes.func,
};

export default AvatarUploader;
