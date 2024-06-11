import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useCreateRequest() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isCreating, mutate: createRequest } = useMutation({
        mutationFn: async (data) => {
            const response = await axiosPrivate.post('/api/v1/requests', data, {
                headers: {
                    'Content-Type': 'application/json',
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

    return { isCreating, createRequest };
}

export default useCreateRequest;