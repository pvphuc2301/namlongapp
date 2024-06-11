import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateRequest() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateRequest } = useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await axiosPrivate.patch(`/api/v1/requests/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['requests'] });
        },
        onError: (error) => {
        }
    });

    return { isUpdating, updateRequest };
}

export default useUpdateRequest;