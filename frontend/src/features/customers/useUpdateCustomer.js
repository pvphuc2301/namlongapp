import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateCustomer() {
    const queryClient = useQueryClient();
    const privateAxios = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateCustomer } = useMutation({
        mutationFn: ({ id, data }) => privateAxios.patch(`/api/v1/customers/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
    });

    return { isUpdating, updateCustomer };
}

export default useUpdateCustomer;