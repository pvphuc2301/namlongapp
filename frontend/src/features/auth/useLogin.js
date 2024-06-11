import { useMutation } from "react-query";
import axios from "../../api/axios";

const useLogin = () => {
    const { mutate: login, isLoading: isSigningIn } = useMutation({
        mutationFn: ({ email, password }) => axios.post("/api/v1/auth/login", { email, password }),
    });

    return { login, isSigningIn };
}

export default useLogin;