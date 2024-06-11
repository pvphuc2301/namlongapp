import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useCreateUser() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isCreating, mutate: createUser } = useMutation({
        mutationFn: (data) => axiosPrivate.post('/api/v1/users/signup',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        ),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    return { isCreating, createUser };
}

export default useCreateUser;