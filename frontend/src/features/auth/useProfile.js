import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const useProfile = (options = { enabled: true }) => {
    const privateAxios = useAxiosPrivate();

    const { isLoading, data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => privateAxios.get('/api/v1/auth/me'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoading, profile };

}

export default useProfile;