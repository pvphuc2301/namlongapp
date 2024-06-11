import { Alert, App, Button, Checkbox, Form, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useLogin from "../features/auth/useLogin";
import { selectCurrentToken, setCredentials } from "../redux/slices/authSlice";

const Login = () => {
    const { message } = App.useApp();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");
    const errRef = useRef();

    const { isSigningIn, login } = useLogin();

    const redirect = searchParams.get("redirect") || "/";

    // useEffect(() => {
    //     if (token) {
    //         navigate(redirect);
    //     }
    // }, [redirect, navigate, token]);

    const onFinish = (values) => {
        try {
            login(
                values,
                {
                    onSuccess: ({ data }) => {
                        dispatch(setCredentials({ accessToken: data.accessToken }));
                        navigate(redirect);
                    },
                    onError: (error) => {
                        if (!error.response.status) {
                            setErrMsg("No Server Response");
                        }
                        else if (error.response.status === 400) {
                            setErrMsg("Missing Username or Password");
                        }
                        else if (error.response.status === 401) {
                            setErrMsg("Username or Password is incorrect");
                        }
                        else {
                            setErrMsg("Login Failed");
                        }
                        errRef.current.focus();
                    }
                }
            );
        } catch (error) {
            message.error(error?.data?.message);
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
                layout="vertical"
                onFinish={onFinish}
            >
                {errMsg && <Alert message={errMsg} type="error" showIcon ref={errRef} style={{ marginBottom: 10 }} />}
                <Form.Item
                    label="Email"
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
                    label="Password"
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
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Link to="/forgetpassword" style={{ float: "right" }}>Forgot password</Link>
                </Form.Item>

                <Button style={{ width: "100%" }} loading={isSigningIn} type="primary" htmlType="submit">
                    Log In
                </Button>
                <Form.Item>
                    Or <Link to={"/signup"}>Register Now!</Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login;