import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useCreateDocumentType() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isCreating, mutate: createDocumentType } = useMutation({
        mutationFn: async (data) => {
            const response = await axiosPrivate.post('/api/v1/documentTypes', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
        },
        onError: (error) => {

        }
    });

    return { isCreating, createDocumentType };
}

export default useCreateDocumentType;