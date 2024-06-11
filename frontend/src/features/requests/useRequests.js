import axios from "axios";
import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useRequests(options = { enabled: true }) {
    const axiosPrivate = useAxiosPrivate();

    const { isLoading: isLoadingRequests, data: requests } = useQuery({
        queryKey: ['requests'],
        queryFn: () => axiosPrivate.get('/api/v1/requests'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingRequests, requests };
}

export default useRequests;