import axios from "axios";
import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useDocuments(options = { enabled: true }) {
    const axiosPrivate = useAxiosPrivate();
    const { isLoading: isLoadingDocuments, data: documents } = useQuery({
        queryKey: ['documents'],
        queryFn: () => axiosPrivate.get('/api/v1/documents'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingDocuments, documents };
}

export default useDocuments;