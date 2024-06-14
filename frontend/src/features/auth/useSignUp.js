import axios from "axios";
import { useMutation } from "react-query";

const useSignUp = () => {
    const { mutate: signUp, isLoading: isSigningUp, isError, error, isSuccess } = useMutation({
        mutationFn: ({ username, email, password, passwordConfirm }) => axios.post("/api/v1/auth/signup", { name: username, email, password, passwordConfirm }),
    });

    return { signUp, isSigningUp, error, isError, isSuccess };
}

export default useSignUp;