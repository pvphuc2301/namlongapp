import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { mutate: updateUser, isLoading: isUpdatingUser, isError, error } = useMutation({
        mutationFn: (data) => axiosPrivate.patch("/api/v1/auth/updateMe", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            console.log(error);
        }
    });

    return { updateUser, isUpdatingUser, isError, error };
}

export default useUpdateUser;