import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useDeleteDocument() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isDeleting, mutate: deleteDocument } = useMutation({
        mutationFn: id => axiosPrivate.delete(`/api/v1/documents/${id}`), onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        }
    });

    return { isDeleting, deleteDocument };
}

export default useDeleteDocument;