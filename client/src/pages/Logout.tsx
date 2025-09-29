import { logoutUser } from "@/store/features/authSlice";
import { AppDispatch } from "@/store/Store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

export const Logout = () => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(logoutUser());
    }, []);

    return <Navigate to='/login' />
}

export default Logout;