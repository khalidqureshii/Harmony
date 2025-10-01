import {useNavigate } from "react-router-dom";
import { useState } from "react";
import img1 from "../../../public/logo.png";
// import img2 from "../../../public/manager.png";
// import img3 from "../../../public/logout.png";
// import img4 from "../../../public/youtube.png";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import DemoVideo from "../DemoVideo";
// import { useSelector } from "react-redux";

function Header () {
    const navigate = useNavigate();
    // const user = useSelector((state:any) => state.auth.user)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <header className="py-4 customHeader">
            <div className="mx-2 md:mx-6 flex flex-row justify-between items-center">
                <button onClick={() => { navigate("/") }}>
                    <div className="flex ml-2">
                        <img src={img1} style={{ width: "2.5rem", height: "auto", objectFit: "contain" }} className="mr-3" />
                        <h1 className="text-[2.9rem] font-logo font-bold hidden custom2:block">Harmony</h1>
                    </div>
                </button>
                <div className="flex justify-center">
                    {/* <button onClick={() => {setIsDialogOpen(true)}} className="relative group flex flex-col items-center ml-5">
                        <img src={img4} style={{ width: "3rem", height: "auto", objectFit: "contain" }}/>
                        <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                            Demo
                        </div>
                    </button>
                    {(!user.isAdmin) ? null : (<>
                        <button onClick={() => { navigate("/manage") }} className="relative group flex flex-col items-center ml-5">
                            <img src={img2} style={{ width: "3rem", height: "auto", objectFit: "contain" }}/>
                            <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                                Manage
                            </div>
                        </button>
                    </>)}
                    <button onClick={() => { navigate("/logout") }} className="relative group flex flex-col items-center ml-5" >
                        <img src={img3} style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                        <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                            Logout
                        </div>
                    </button> */}
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
        </header>
    );   
}

export default Header;
