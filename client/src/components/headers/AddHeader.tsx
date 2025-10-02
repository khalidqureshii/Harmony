import {useNavigate} from "react-router-dom";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import DemoVideo from "../DemoVideo";
// import { useSelector } from "react-redux";

type headerType = {
    addTrigger: (x:boolean)=>void;
}

function AddHeader (props:headerType) {
    console.log(props)
    const navigate = useNavigate();
    // const user = useSelector((state:any) => state.auth.user)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <header className="py-4 customHeader">
            <div className="mx-2 md:mx-6 flex flex-row justify-between items-center">
                <button onClick={() => { navigate("/") }}>
                    <div className="flex ml-2">
                        <img src="logo.png" style={{ width: "2.5rem", height: "auto", objectFit: "contain" }} className="mr-3" />
                        <h1 className="text-[2.9rem] font-logo font-extrabold hidden custom2:block">Chime</h1>
                    </div>
                </button>
                <div className="flex justify-center">
                    <button onClick={() => { navigate("/logout") }} className="relative group flex flex-col items-center ml-5" >
                        <img src="logout.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                        <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                            Logout
                        </div>
                    </button>
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

export default AddHeader;