import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import LINK from "../store/Link";
import {toast} from "react-toastify";
import ChatroomRow from "../components/ChatroomRow";
import { UserType } from "../store/Auth";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';



function ManageChatrooms() {
    const navigate = useNavigate();
    const {user, isLoggedIn}:{user:UserType, isLoggedIn:boolean} = useAuth();
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        } 
        else if (isLoggedIn && !user.isAdmin) {
            navigate("/home");
        }
    }, [isLoggedIn]);

    
    const [isLoading, setLoading] = useState(true);
    const [chatrooms, setChatrooms] = useState([]);
    const [selectedChatroomId, setChatroomId] = useState(0);
    const [editedName, setEditedName] = useState<string>("");
    const [oldName, setOldName] = useState<string>("");
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    type CardType = {
        chatroomUserId:number,
        chatroomName:string,
        createdAt:Date,
        creatorUsername:string
        chatroomId:number
    }

    function createChatroomRows(entry:CardType){
        return <ChatroomRow chatroomName={entry.chatroomName} createdAt={entry.createdAt} creatorUsername={entry.creatorUsername} 
        key={entry.chatroomId} chatroomId={entry.chatroomId} 
        setChatroomMethod={setChatroomId} deleteHandler={setIsAlertDialogOpen} editHandler={setIsDialogOpen} setOldName={setOldName}/>
    }


    async function deleteChatroom() {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/chatroom/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatroomId:selectedChatroomId,
                    userId: user.userId
                })
            });
            if (response.ok) {
                const response2 = await fetch(LINK + "api/chat/deleteChatroomChats", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chatroomId:selectedChatroomId,
                        userId: user.userId
                    })
                })
                fetchChatrooms();

                if (!response2.ok) {
                    const rest2_data = await response2.json();
                    toast(rest2_data.message);
                }
            }
            else {
                const res_data = await response.json();
                toast(res_data.message);
            }
        }
        catch {

        }
        finally {
            setLoading(false);
        }
    }

    async function editChatroom() {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/chatroom/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatroomId:selectedChatroomId,
                    chatroomName: editedName
                })
            });
            const resp_data = await response.json();
            toast(resp_data.message);
            if (response.ok) fetchChatrooms();
        }
        catch {

        }
        finally {
            setLoading(false);
        }
    }

    async function fetchChatrooms() {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/chatroom/fetch", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setLoading(false);
    
            if (!response.ok) {
                throw new Error("Failed to fetch chatrooms");
            }
    
            const resp = await response.json();
    
            if (!Array.isArray(resp.chatrooms)) {
                throw new Error("Invalid data format: chatrooms is not an array");
            }
    
            setChatrooms(resp.chatrooms);
        } catch (error) {
            setChatrooms([]); 
        }   finally {
            setLoading(false);
        }

    }
    useEffect(()=>{
        fetchChatrooms();
    },[])

    if (isLoading) return <Loader />;

    return <>
        <div className="w-full min-h-80vh">
            <div className="flex flex-col justify-start items-center mx-5 mb-12">
                <h1 className="text-4xl md:text-5xl text-center font-extrabold mt-20 mb-10">Manage Chatrooms</h1> 
                
                <div className="bg-credbg flex flex-col md:w-7/12 rounded-2xl overflow-hidden shadow-3xl">
                    <div className="bg-[#cfcfcf] py-6 px-4 group flex flex-row items-center">
                        <h1 className='text-2xl w-6/12 text-left text-black'>Chatroom</h1>
                        <h2 className="text-2xl w-2/12 text-left text-black">Creator</h2>
                        <h2 className="text-2xl w-3/12 text-left text-black">Created</h2>
                        <h2 className="text-2xl w-1/12 text-left text-black">Action</h2>
                    </div>
                    {chatrooms.map(createChatroomRows)}
                </div>

            </div>
        </div>

        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogTrigger asChild>
            <div></div>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="font-universal">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="font-universal">
                This action cannot be undone. This will permanently delete this Chatroom from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="font-universal hover:bg-blue-400 text-white hover:text-white bg-blue-600" >Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{deleteChatroom(); setIsAlertDialogOpen(false)}} className="font-universal hover:bg-blue-400 text-white bg-blue-600" >Continue</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Edit Name</DialogTitle>
                <DialogDescription>
                    Make changes to your Chatroom Name here. Click save when you're done.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="oldName" className="text-right">
                    Old
                    </Label>
                    <Input id="oldName" value={oldName} className="col-span-3" readOnly/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newName" className="text-right">
                    New
                    </Label>
                    <Input id="newName" defaultValue={oldName} onChange={(e)=>{setEditedName(e.target.value)}} className="col-span-3" autoFocus/>
                </div>
                </div>
                <DialogFooter>
                <Button onClick={()=>{editChatroom(); setIsDialogOpen(false)    }} className='bg-blue-600 hover:bg-blue-400 text-white font-universal'>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}   

export default ManageChatrooms;