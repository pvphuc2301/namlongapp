import axios from "axios";
import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useDocumentTypes(options = { enabled: true }) {
    const axiosPrivate = useAxiosPrivate();

    const { isLoading: isLoadingDocumentTypes, data: documentTypes } = useQuery({
        queryKey: ['documentTypes'],
        queryFn: () => axiosPrivate.get('/api/v1/documentTypes'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingDocumentTypes, documentTypes };
}

export default useDocumentTypes;