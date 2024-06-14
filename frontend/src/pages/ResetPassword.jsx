import { useParams } from "react-router-dom";
import useResetPassword from "../features/auth/useResetPassword";
import { Alert, Button, Form, Input, Result } from "antd";

const ResetPassword = () => {
    const { token } = useParams();
    const { resetPassword, isLoading, isError, error, isSuccess } = useResetPassword();

    const handleSubmit = (e) => {
        const password = e.password;
        const passwordConfirm = e.passwordConfirm;

        resetPassword({ token, password, passwordConfirm }, {
            onSuccess: () => {
                setTimeout(() => {
                    window.location.href = '/login';
                })
            }
        });
    }

    if (isSuccess) {
        return (
            <Result
                status="success"
                title="Password Reset Successfully"
                subTitle="Redirecting to login page..."
                extra={[
                    <Button type="primary" href='/login'>
                        Login
                    </Button>
                ]}
            />
        )
    }

    return (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f5f5f5" }}>
            <Form
                style={{ width: 400, padding: 20, background: "white" }}
                onFinish={handleSubmit} layout="vertical">

                <h3>Reset Password</h3>

                {isError && <Alert message={error?.response?.data?.message} type="error" showIcon style={{ marginBottom: 10 }} />}

                <Form.Item
                    name="password"
                    label="New password"
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
                    <Input.Password prefix={<i className="bi bi-lock"></i>} />
                </Form.Item>

                <Form.Item
                    name="passwordConfirm"
                    label="Confirm new password"
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
                    <Input.Password prefix={<i className="bi bi-lock"></i>} />
                </Form.Item>

                <Button style={{ width: "100%" }} loading={isLoading} type="primary" htmlType="submit">Update Password</Button>
            </Form>
        </div>
    )
}

export default ResetPassword;