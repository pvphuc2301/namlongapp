import { useQuery } from "react-query";
import useAxiosprivate from "../../hooks/useAxiosPrivate";

function useProjects(options = { enabled: true }) {
    const axiosPrivate = useAxiosprivate();

    const { isLoading: isLoadingProjects, data: projects } = useQuery({
        queryKey: ['projects'],
        queryFn: () => axiosPrivate.get('/api/v1/projects'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingProjects, projects };
}

export default useProjects;