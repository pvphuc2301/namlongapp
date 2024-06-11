import { useParams } from "react-router-dom";
import useUpdateMyPassword from "../features/auth/useUpdateMyPassword";
import { Button } from "antd";

const ChangePassword = () => {
    const { isUpdating, updatePassword } = useUpdateMyPassword();

    const handleSubmit = (e) => {
        e.preventDefault();

        const passwordCurrent = e.target.passwordCurrent.value;
        const password = e.target.password.value;
        const passwordConfirm = e.target.passwordConfirm.value;

        updatePassword({ passwordCurrent, password, passwordConfirm });
    }

    return (
        <div>
            ResetPassword

            <form onSubmit={handleSubmit}>
                <label htmlFor="passwordCurrent">Current password</label>
                <input type="password" name="passwordCurrent" />

                <label htmlFor="password">New password</label>
                <input type="password" name="password" />

                <label htmlFor="passwordConfirm">Confirm new password</label>
                <input type="password" name="passwordConfirm" />

                <Button type="primary" htmlType="submit" loading={isUpdating}>Submit</Button>
            </form>
        </div>
    )
}

export default ChangePassword;