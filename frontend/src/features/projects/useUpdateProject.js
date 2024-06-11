import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateProject() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateProject } = useMutation({
        mutationFn: ({ id, data }) => axiosPrivate.patch(`/api/v1/projects/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }),
        onSuccess: _ => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    return { isUpdating, updateProject };
}

export default useUpdateProject;