import { useMutation } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const useUpdateMyPassword = () => {
    const axiosPrivate = useAxiosPrivate();

    const { mutate: updatePassword, isLoading: isPasswordUpdating, isError, error } = useMutation({
        mutationFn: ({ passwordCurrent, password, passwordConfirm }) => axiosPrivate.patch("/api/v1/auth/updateMyPassword", { passwordCurrent, password, passwordConfirm }),
    });
    return { updatePassword, isPasswordUpdating, isError, error };
}

export default useUpdateMyPassword;