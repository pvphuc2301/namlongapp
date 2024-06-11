import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useCreateCustomer() {
    const queryClient = useQueryClient();
    const privateAxios = useAxiosPrivate();

    const { isPending: isCreating, mutate: createCustomer } = useMutation({
        mutationFn: (data) => privateAxios.post('/api/v1/customers', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: (error) => {

        }
    });

    return { isCreating, createCustomer };
}

export default useCreateCustomer;