import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useDeleteProject() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isDeleting, mutate: deleteProject } = useMutation({
        mutationFn: id => axiosPrivate.delete(`/api/v1/projects/${id}`),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    return { isDeleting, deleteProject };
}

export default useDeleteProject;