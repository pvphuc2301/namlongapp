import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateDocumentType() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateDocumentType } = useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await axiosPrivate.patch(`/api/v1/documentTypes/${id}`, data);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
        },
        onError: (error) => {

        }
    });

    return { isUpdating, updateDocumentType };
}

export default useUpdateDocumentType;