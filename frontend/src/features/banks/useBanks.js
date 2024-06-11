import axios from "axios";
import { useQuery } from "react-query";

function useBanks(options = { enabled: true }) {
    const { isLoading: isLoadingBanks, data: banks } = useQuery({
        queryKey: ['banks'],
        queryFn: () => axios.get('https://api.vietqr.io/v2/banks'),
        select: (data) => options?.selector?.(data?.data?.data) ?? data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingBanks, banks };
}

export default useBanks;