import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useDeleteDocumentType() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isDeleting, mutate: deleteDocumentType } = useMutation({
        mutationFn: id => axiosPrivate.delete(`/api/v1/documentTypes/${id}`),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
        }
    });

    return { isDeleting, deleteDocumentType };
}

export default useDeleteDocumentType;