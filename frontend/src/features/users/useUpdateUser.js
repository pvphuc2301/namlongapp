import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateUser() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateUser } = useMutation({
        mutationFn: ({ id, data }) => axiosPrivate.patch(`/api/v1/users/${id}`,
            data,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        ),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    return { isUpdating, updateUser };
}

export default useUpdateUser;