import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import axios from "axios";

const useRefresh = () => {
    const dispatch = useDispatch();

    const { mutate: refresh, isLoading, isSuccess, isError, error } = useMutation({
        mutationFn: () => axios.get("/api/v1/auth/refresh", { withCredentials: true }),
        onSuccess: ({ data }) => {
            dispatch(setCredentials({ accessToken: data.accessToken }));
            return data.accessToken;
        }
    });

    return { refresh, isLoading, isSuccess, isError, error };
}

export default useRefresh;