import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useCreateDocument() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isCreating, mutate: createDocument } = useMutation({
        mutationFn: async (data) => {
            const response = await axiosPrivate.post('/api/v1/documents', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
        onError: (error) => {

        }
    });

    return { isCreating, createDocument };
}

export default useCreateDocument;