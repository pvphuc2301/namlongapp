import axios from "axios";
import { useMutation } from "react-query";

const useForgotPassword = () => {
    const { mutate: forgotPassword, isLoading: isSubmitting, isError, error, isSuccess } = useMutation({
        mutationFn: async ({ email }) => {
            const response = await axios.post(`/api/v1/auth/forgotPassword`, { email });
            return response;
        },
    });
    return { forgotPassword, isSubmitting, isSuccess, isError, error };
}

export default useForgotPassword;