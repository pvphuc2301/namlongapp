import { useMutation } from "react-query";
import axios from "../../api/axios";

const useResetPassword = () => {
    const { mutate: resetPassword, isLoading, isError, error } = useMutation({
        mutationFn: ({ token, password, passwordConfirm }) => axios.patch(`/api/v1/auth/resetPassword/${token}`, { password, passwordConfirm }),
    });
    return { resetPassword, isLoading, isError, error };
}

export default useResetPassword;