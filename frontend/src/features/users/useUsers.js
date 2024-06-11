import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUsers(options = { enabled: true }) {
    const axiosPrivate = useAxiosPrivate();

    const { isLoading: isLoadingUsers, data: users } = useQuery({
        queryKey: ['users'],
        queryFn: () => axiosPrivate.get('/api/v1/users'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingUsers, users };
}

export default useUsers;