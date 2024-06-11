import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { selectCurrentUser } from "../../redux/slices/authSlice";

function useCartItems(options = { enabled: true }) {
    const axiosPrivate = useAxiosPrivate();

    const { isLoading: isLoadingCartItems, data: cartItems } = useQuery({
        queryKey: ['cartItems', options?.params],
        queryFn: () => axiosPrivate.get(`/api/v1/cartItems${options?.params ? `?${options?.params}` : ''}`),
        select: (data) => options?.selector?.(data?.data?.data?.data) ?? data?.data?.data?.data,
        enabled: options?.enabled,
    });

    return { isLoadingCartItems, cartItems };
}

export default useCartItems;