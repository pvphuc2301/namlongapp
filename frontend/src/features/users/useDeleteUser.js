import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useDeleteUser() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isDeleting, mutate: deleteUser } = useMutation({
        mutationFn: id => axiosPrivate.delete(`/api/v1/users/${id}`),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    return { isDeleting, deleteUser };
}

export default useDeleteUser;