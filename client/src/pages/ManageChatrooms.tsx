import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import {toast} from "react-toastify";
import ChatroomRow from "../components/ChatroomRow";
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
import { CardType } from "@/store/Types";
import { deleteChatroom, editChatroom } from "@/api/ManageChatrooms";
import { fetchChatrooms } from "@/api/Home";
import { useSelector } from "react-redux";



function ManageChatrooms() {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const user = useSelector((state:any) => state.auth.user);
    const userLoading = useSelector((state: any) => state.auth.userLoading);

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


    function createChatroomRows(entry:CardType){
        return <ChatroomRow chatroomName={entry.chatroomName} createdAt={entry.createdAt} creatorUsername={entry.creatorUsername} 
        key={entry.chatroomId} chatroomId={entry.chatroomId} 
        setChatroomMethod={setChatroomId} deleteHandler={setIsAlertDialogOpen} editHandler={setIsDialogOpen} setOldName={setOldName}/>
    }

    async function deleteChatroomLocal() {
        try {
            const data = {selectedChatroomId: selectedChatroomId, userId: user.userId};
            setLoading(true);
            const response = await deleteChatroom(data);
            fetchChatroomsLocal();
            toast.success(response.message);
        }
        catch (error){
            if (error instanceof Error) toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    async function editChatroomLocal() {
        try {
            const data = {selectedChatroomId: selectedChatroomId, editedName: editedName}
            setLoading(true);
            const response = await editChatroom(data);
            fetchChatroomsLocal();
            toast.success(response.message);
        }
        catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    async function fetchChatroomsLocal() {
        try {
            setLoading(true);
            const response = await fetchChatrooms();
            setLoading(false);
            setChatrooms(response.chatrooms);
        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
            setChatrooms([]);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchChatroomsLocal();
    },[])

    if (userLoading || isLoading) return <Loader />;

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
                <AlertDialogAction onClick={()=>{deleteChatroomLocal(); setIsAlertDialogOpen(false)}} className="font-universal hover:bg-blue-400 text-white bg-blue-600" >Continue</AlertDialogAction>
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
                <Button onClick={()=>{editChatroomLocal(); setIsDialogOpen(false)    }} className='bg-blue-600 hover:bg-blue-400 text-white font-universal'>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}   

export default ManageChatrooms;