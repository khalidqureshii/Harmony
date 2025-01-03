import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/features/authSlice";

export const Logout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logoutUser());
    }, [dispatch]);

    return <Navigate to="/login" />;
};

export default Logout;

// import { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../store/Auth";

// export const Logout = () => {
//     const {LogoutUser} = useAuth();

//     useEffect(() => {
//         LogoutUser();
//     }, [LogoutUser]);

//     return <Navigate to='/login' />
// }

// export default Logout;