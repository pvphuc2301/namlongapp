import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUpdateCartItem() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isUpdating, mutate: updateCartItem } = useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await axiosPrivate.patch(`/api/v1/cartItems/${id}`, data);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
        },
        onError: (error) => {

        }
    });

    return { isUpdating, updateCartItem };
}

export default useUpdateCartItem;