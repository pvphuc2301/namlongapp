import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useCustomers(options = { enabled: true }) {
    const privateAxios = useAxiosPrivate();

    const { isLoading: isLoadingCustomers, data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: () => privateAxios.get('/api/v1/customers'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingCustomers, customers };
}

export default useCustomers;