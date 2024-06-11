import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useCreateCartItem() {
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();

    const { isPending: isCreating, mutate: createCartItem } = useMutation({
        mutationFn: async (data) => {
            const response = await axiosPrivate.post('/api/v1/cartItems', data);
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
        },
        onError: (error) => {

        }
    });

    return { isCreating, createCartItem };
}

export default useCreateCartItem;