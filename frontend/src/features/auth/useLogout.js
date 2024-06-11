import { useMutation } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const useLogout = () => {
    const axiosPrivate = useAxiosPrivate();

    const { mutate: logout, isLoading: isSigningOut } = useMutation({
        mutationFn: () => axiosPrivate.post("/api/v1/auth/logout")
    });

    return { logout, isSigningOut };
}

export default useLogout;