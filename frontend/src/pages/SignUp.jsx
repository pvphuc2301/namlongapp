import { Alert, Button, Form, Input, Result, Spin } from "antd";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSignUp from "../features/auth/useSignUp";
import logoNamlong from "../logo-nlg.jpg";

const SignUp = () => {

    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);

    const redirect = searchParams.get("redirect") || "/";

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSigningUp, signUp, error, isError, isSuccess } = useSignUp();

    // useEffect(() => {
    //     if (userInfo) {
    //         navigate(redirect);
    //     }
    // }, [redirect, navigate, userInfo]);

    // if (isError) {
    //     return <Result status="error" title="Error" subTitle={error?.data?.message} />
    // }

    console.log(error);

    if (isSuccess) {
        return <Result status="success" title="Success" subTitle="Your account has been created! Please login." extra={<Link to="/login">Login</Link>} />
    }

    const onFinish = (values) => {
        signUp(values);
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
                <div style={{ textAlign: "center" }}>
                    <img src={logoNamlong} style={{ width: 200 }} alt="logo" />
                </div>
                {
                    isError && error?.response?.data?.message && <Alert message={error?.response?.data?.message} type="error" showIcon style={{ marginBottom: 10 }} />
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
                        { type: "email", message: "Please input a valid email!" },
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
                        {
                            min: 8,
                            message: 'Password must be at least 8 characters',
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
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input
                        prefix={<i className="bi bi-lock"></i>}
                        type="password"
                        placeholder="Password Confirm"
                    />
                </Form.Item>
                <Form.Item>
                    <Button style={{ width: "100%" }} loading={isSigningUp} type="primary" htmlType="submit" className="login-form-button">
                        {isSigningUp && <Spin size="small" />}
                        Sign Up
                    </Button>
                </Form.Item>
                <Link to="/login">Already have an account? Sign In</Link>
            </Form>
        </div>
    )
}

export default SignUp;