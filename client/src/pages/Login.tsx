import React, { useEffect, useState } from "react";
import InputEntry from "../components/InputEntry";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Loader from "../components/Loader";
import InputEntryPassword from "../components/InputEntryPassword";
import { storeData } from "@/api/Login";
import { authenticateUser, storeToken } from "@/store/features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../store/Store.js";

function Login() {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const userLoading = useSelector((state: any) => state.auth.userLoading);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home"); 
        }
    }, [isLoggedIn]);
    
    const [isLoading, setLoading] = useState(false);
    const [user,setUser] = useState({email: "", password: ""});

    function updateUser(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setUser(prevUser => { 
            const updatedUser = {
                ...prevUser,
                [name]: value,
            }
            return updatedUser;
        });
    }
    
    async function storeDataLocal() {
        setLoading(true);
        try {
            const response = await storeData(user);
            console.log("Login Response: ", response);
            toast.success("Successfully Logged in");
            dispatch(storeToken(response.token));
            await dispatch(authenticateUser(response.token));
        }
        catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    if (isLoading || userLoading) return <Loader />;

    return <div className="w-full h-90vh flex flex-row justify-center items-center">
        <div className="mx-5">
            <div className="flex flex-row justify-center items-center bg-credbg rounded-3xl overflow-hidden shadow-3xl flex-wrap custom:py-0 py-10">
                <img src="group.png" style={{ width: "30rem", height: "auto", objectFit: "contain" }} className="hidden custom:block"/>
                <div className="flex flex-col justify-center items-center mx-12">
                    <img src="logo.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                    <h1 className="mb-10 text-5xl text-black text-center font-logo font-bold">Harmony</h1>
                    <InputEntry changeFunction={updateUser} name="email" text="Email" placeholder="Email" />
                    <InputEntryPassword changeFunction={updateUser} name="password" text="Password" placeholder="Password"/>
                    <button className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-lg text-white mt-3 mb-2 shadow-lg" type="submit" onClick={storeDataLocal}>Log in</button>
                    <h2 className="text-lg text-black mt-3">Don't have an Account? <span className="text-blue-500 cursor-pointer" onClick={()=>navigate("/register")}>Sign up</span></h2>
                </div>
            </div>
        </div>
    </div>
}   

export default Login;