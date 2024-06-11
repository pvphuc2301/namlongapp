import axios from "axios";
import { useMutation } from "react-query";

const useSignUp = () => {
    const { mutate: signUp, isLoading: isSigningUp, isError, error } = useMutation({
        mutationFn: async ({ username, email, password, passwordConfirm }) => {
            const response = await axios.post("/api/v1/users/signup", { name: username, email, password, passwordConfirm });
            return response;
        },
    });

    return { signUp, isSigningUp, error, isError };
}

export default useSignUp;