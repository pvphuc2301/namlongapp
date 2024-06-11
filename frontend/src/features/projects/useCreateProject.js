import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

function useCreateProject() {
    const queryClient = useQueryClient();

    const { isPending: isCreating, mutate: createProject } = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post('/api/v1/projects', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (error) => {

        }
    });

    return { isCreating, createProject };
}

export default useCreateProject;