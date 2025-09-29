import React, { useEffect, useState } from "react";
import InputEntry from "../components/InputEntry";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import InputEntryPassword from "../components/InputEntryPassword";
import Loader from "../components/Loader";
import { storeData } from "@/api/Register";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import DemoVideo from "@/components/DemoVideo";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser, storeToken } from "@/store/features/authSlice";
import { AppDispatch } from "@/store/Store";

function Register() {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)
    const dispatch: AppDispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const userLoading = useSelector((state: any) => state.auth.userLoading);
    
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home"); 
        }
    }, [isLoggedIn]);
    
    const [user,setUser] = useState({username: "", email: "", password: "", confirmPassword: "", match: true});
    const [isLoading, setLoading] = useState(false);

    function updateUser(event: React.ChangeEvent<HTMLElement>) {
        const { name, value } = event.target as HTMLInputElement;
        setUser(prevUser => { 
            const updatedUser = {
                ...prevUser,
                [name]: value,
            }
            updatedUser.match = (updatedUser.password == updatedUser.confirmPassword);
            return updatedUser;
        });
    }

    async function storeDataLocal() {
        if (!user.match) {
            toast.error("Passwords Do Not Match");
            return;
        }
        setLoading(true);
        try {
            const response= await storeData(user);
            dispatch(storeToken(response.token));
            await dispatch(authenticateUser(response.token));
            toast.success("Successfully Registered");
            navigate("/home");
        }
        catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    if (isLoading || userLoading) return <Loader />;

    return <div className="w-full h-90vh flex items-center justify-center">
        <div className="flex bg-credbg rounded-3xl overflow-hidden shadow-3xl mx-5 flex-wrap custom:py-0 py-10">
            <img src="registerImage.png" style={{ width: "35rem", height: "auto", objectFit: "contain" }} className="hidden custom:block"/>
            <div className="flex flex-col justify-center items-center text-center mx-20">
                <img src="logo.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                <h1 className="text-5xl mb-10 text-black font-logo font-bold">Enter Name</h1>
                <InputEntry changeFunction={updateUser} name="username" text="Username" placeholder="Username" value={user.username} /> 
                <InputEntry changeFunction={updateUser} name="email" text="Email" placeholder="Email" value={user.email} />
                <InputEntryPassword changeFunction={updateUser} name="password" text="Password" placeholder="Password" value={user.password} />
                <InputEntryPassword changeFunction={updateUser} name="confirmPassword" text="Confirm Password" placeholder="Confirm Password" value={user.confirmPassword} />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-4 mt-3 shadow-lg" onClick={storeDataLocal}>Sign up</button>

                <h2 className="text-lg mt-5 text-black">Already have an Account? <span className="text-blue-500 cursor-pointer" onClick={()=>navigate("/login")}>Log in</span></h2>
                <h1 className="mt-3 text-lg text-rose-700 cursor-pointer" onClick={()=>setIsDialogOpen(true)}>Demo Video</h1>
            </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-xl p-6 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="mb-3">Demo Video</DialogTitle>
                    <DialogDescription>
                        <div className="relative w-full max-h-[315px] overflow-hidden">
                            <DemoVideo />
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
}   

export default Register;