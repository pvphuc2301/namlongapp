import { useQuery } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice";

function useSoldCartItems(options = { enabled: true }) {
    const axiosPrivate = useAxiosPrivate();

    const { isLoading: isLoadingSoldCartItems, data: soldCartItems } = useQuery({
        queryKey: ['soldCartItems', options?.params],
        queryFn: () => axiosPrivate.get(`/api/v1/soldCartItems${options?.params ? `?${options?.params}` : ''}`),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingSoldCartItems, soldCartItems };
}

export default useSoldCartItems;