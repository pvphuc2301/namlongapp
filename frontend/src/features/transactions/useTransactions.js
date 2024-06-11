import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useTransactions(options = { enabled: true }) {
    const privateAxios = useAxiosPrivate();

    const { isLoading: isLoadingTransactions, data: transactions } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => privateAxios.get('/api/v1/transactions'),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingTransactions, transactions };
}

export default useTransactions;