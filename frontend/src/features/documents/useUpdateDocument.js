import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateDocument() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateDocument } = useMutation({
        mutationFn: ({ id, data }) => axiosPrivate.patch(`/api/v1/documents/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });

    return { isUpdating, updateDocument };
}

export default useUpdateDocument;