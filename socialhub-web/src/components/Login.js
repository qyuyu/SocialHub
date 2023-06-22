import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from "axios";
import { BASE_URL } from "../constants";
import { Link } from "react-router-dom";

function Login(props) {
    const { handleLoggedIn } = props;

    const onFinish = (values) => {
        // 1. get values of username, password
        // 2. send login request to the server
        //     axios library
        // 3. get the response form the server
        //    case1: login successfully
        //            -> inform Main -> App components
        //    case2: login failed
        //            -> inform users
        console.log('Received values of form: ', values);
        const { username, password } = values;
        const opt = {
            method: "POST",
            url: `${BASE_URL}/signin`,
            data: {
                username: username,
                password: password
            },
            headers: { "Content-Type": "application/json" }
        }

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    const { data } = res;
                    props.handleLoggedIn(data);
                    message.success("Login succeed!");
                }
            })
            .catch((err) => {
                console.log("login failed: ", err.message);
                message.error("Login failed!");
            })
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <Link to="/register">register now!</Link>
            </Form.Item>
        </Form>
    );
}

export default Login;