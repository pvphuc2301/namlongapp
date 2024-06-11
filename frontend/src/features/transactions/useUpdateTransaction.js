import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateTransaction() {
    const queryClient = useQueryClient();
    const privateAxios = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateTransaction } = useMutation({
        mutationFn: ({ id, data }) => privateAxios.patch(`/api/v1/transactions/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    });

    return { isUpdating, updateTransaction };
}

export default useUpdateTransaction;