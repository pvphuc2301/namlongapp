import { Alert, Button, Checkbox, Form, Input, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useSignUp from "../features/auth/useSignUp";
import { setCredentials } from "../redux/slices/authSlice";

const SignUp = () => {

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    const redirect = searchParams.get("redirect") || "/";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSigningUp, signUp, error, isError } = useSignUp();

    // useEffect(() => {
    //     if (userInfo) {
    //         navigate(redirect);
    //     }
    // }, [redirect, navigate, userInfo]);

    const onFinish = (values) => {
        try {
            signUp(values, {
                onSuccess: ({ data }) => {
                    // console.log(data.data);
                    // dispatch(setCredentials({ ...data.data }));
                    // navigate(redirect);
                }
            });
        } catch (error) {
            alert(error?.data?.message);
        }
    };

    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5" }}>

            <Form
                style={{ width: 400, padding: 20, background: "white" }}
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                {
                    isError && error?.data?.message && <Alert message={error?.data?.message} type="info" showIcon />
                }
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input
                        prefix={<i className="bi bi-person"></i>}
                        placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input
                        prefix={<i className="bi bi-envelope"></i>}
                        placeholder="Email address" />
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
                        prefix={<i className="bi bi-lock"></i>}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item
                    name="passwordConfirm"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password Confirm!',
                        },
                    ]}
                >
                    <Input
                        prefix={<i className="bi bi-lock"></i>}
                        type="password"
                        placeholder="Password Confirm"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        {isSigningUp && <Spin size="small" />}
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SignUp;