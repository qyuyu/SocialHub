import React, {Component} from 'react';
import { Button, Modal, message } from 'antd';
import { PostForm } from "./PostForm";
import axios from "axios";
import {BASE_URL, TOKEN_KEY} from "../constants";

/**
 * reference => get v-element in react
 * define: React.createRef() // cb function
 * read: myRef.current
 */

class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false
    }

    showModal = () => {
        this.setState({visible: true});
    }

    handleOk = () => {
        this.setState({
            visible: false,
            confirmLoading: true
        });
        // get form data from PostForm
        this.form
            .validateFields()
            .then(values => {
                // step1: create post file obj
                // step2: send to the server
                // step3: analyze the response from the server
                const { description, uploadPost } = values;
                const { originFileObj, type } = uploadPost[0];
                const postType = type.match(/^(image|video)/g)[0];
                if (postType) {
                    let formData = new FormData();
                    formData.append("message", description);
                    formData.append("media_file", originFileObj);
                    const opt = {
                        method: "POST",
                        url: `${BASE_URL}/upload`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                        },
                        data: formData
                    };

                    axios(opt)
                        .then((res) => {
                            if (res.status === 200) {
                                message.success("The image/video is uploaded!");
                                // reset the form fields
                                this.handleCancel();
                                // refresh post-list section
                                this.props.onShowPost(postType);
                            }
                        })
                        .catch((err) => {
                            console.log("Upload image/video failed: ", err.message);
                            message.error("Failed to upload image/video!");
                        });
                }
            })
            .catch((err) => {
                console.log("err ir validate form -> ", err);
                message.error("Failed to upload image/video!");
                this.handleCancel();
            });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            confirmLoading: false
        });
        this.form.resetFields();
    }

    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary"
                        onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal title="Create New Post"
                       okText="Create"
                       visible={visible}
                       confirmLoading={confirmLoading}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}>
                    <PostForm ref={ postFormInstance => {
                        this.form = postFormInstance;
                    }}/>
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;