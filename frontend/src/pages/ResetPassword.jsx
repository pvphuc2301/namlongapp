import { useParams } from "react-router-dom";
import useResetPassword from "../features/auth/useResetPassword";
import { Alert, Button, Form, Input } from "antd";

const ResetPassword = () => {
    const { token } = useParams();
    const { resetPassword, isLoading, isError, error } = useResetPassword();

    const handleSubmit = (e) => {
        const password = e.password;
        const passwordConfirm = e.passwordConfirm;

        resetPassword({ token, password, passwordConfirm },
            {
                onSuccess: () => {
                    console.log("success");
                }
            }
        );
    }

    console.log('error', error);

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
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password prefix={<i className="bi bi-lock"></i>} />
                </Form.Item>

                <Form.Item
                    name="passwordConfirm"
                    label="Confirm new password"
                    rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                    <Input.Password prefix={<i className="bi bi-lock"></i>} />
                </Form.Item>

                <Button style={{ width: "100%" }} loading={isLoading} type="primary" htmlType="submit">Update Password</Button>
            </Form>
        </div>
    )
}

export default ResetPassword;