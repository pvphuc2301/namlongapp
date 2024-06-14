import { Button, Form, Input, Result } from "antd";
import useForgetPassword from "../features/auth/useForgetPassword";
import { Link } from "react-router-dom";
import logoNamlong from "../logo-nlg.jpg";


const ForgetPassword = () => {

    const { isSubmitting, forgotPassword, isSuccess, isError, error } = useForgetPassword();
    const handleSubmit = (e) => {
        const email = e.email;

        forgotPassword({ email });
    }

    if (isSuccess) {
        return (
            <Result
                status="success"
                title="Check Your Email Address To Reset Your Password"
                subTitle="Password Reset In Progress"
                extra={[
                    <Button type="primary" href='/login'>
                        Login
                    </Button>
                ]}
            />
        )
    }

    if (isError) {
        return (
            <Result
                status="error"
                title="Something went wrong. Please try again later."
                subTitle="Password Reset Failed"
                extra={[
                    <a key="retry" href='/forgetpassword'>
                        Retry
                    </a>
                ]}
            />
        )
    }

    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5" }}>
            <Form
                style={{ width: 400, padding: 20, background: "white" }}
                onFinish={handleSubmit}>

                <div style={{ textAlign: "center" }}>
                    <img src={logoNamlong} style={{ width: 200 }} alt="logo" />
                </div>

                <h3>Forget Password</h3>

                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input a valid email!' }]}
                >
                    <Input prefix={<i className="bi bi-envelope"></i>} placeholder="Email address" />
                </Form.Item>

                <Button loading={isSubmitting} style={{ width: "100%" }} type="primary" htmlType="submit">Request New Password</Button>

                <p>
                    or <Link to='/login' >Already Have Account Login</Link>
                </p>
            </Form>
        </div>

    )
}

export default ForgetPassword;