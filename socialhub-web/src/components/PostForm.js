import React, { forwardRef } from 'react';
import { Form, Input, Upload } from "antd";
import { InboxOutlined } from '@ant-design/icons';

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

export const PostForm = forwardRef((props, formRef) => {
    const normFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }

        return e?.fileList;
    };
    return (
        <Form
            ref={formRef}
            name="validate_other"
            {...formItemLayout}
            //onFinish={onFinish}
        >

            <Form.Item name="description"
                       label="Message"
                       rules={[
                           {
                               required: true,
                               message: 'Please input your description!',
                           },
                       ]}>
                <Input />
            </Form.Item>

            <Form.Item label="Dragger">
                <Form.Item
                    name="uploadPost"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                >
                    <Upload.Dragger name="files"
                                    beforeUpload={ () => false }
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
        </Form>
    )
});