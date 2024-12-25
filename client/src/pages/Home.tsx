import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import ChatroomCard from "../components/ChatroomCard";
import { UserType } from "../store/Auth";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "react-toastify";
import AddHeader from "@/components/headers/AddHeader";
import { MessageSquarePlus } from "lucide-react";
import { CardType } from "@/store/Types";
import { createChatroom, fetchChatrooms, handleUpload } from "@/api/Home";


function Home() {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn]);

    useEffect(()=>{
        fetchChatroomsLocal();
    },[])
    
    const {user}:{user:UserType} = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [chatrooms, setChatrooms] = useState([]);
    const [chatroomName, setChatroomName] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    
    

    function createChatroomCards(entry:CardType){
        return <ChatroomCard chatroomName={entry.chatroomName} createdAt={entry.createdAt} creatorUsername={entry.creatorUsername} 
        key={entry.chatroomId} chatroomId={entry.chatroomId}/>
    }

    async function fetchChatroomsLocal() {
        try {
            setLoading(true);
            const resp = await fetchChatrooms();
            setChatrooms(resp.chatrooms);
        } catch (error) {
            setChatrooms([]); 
        }   finally {
            setLoading(false);
        }
    }

    async function createChatroomLocal() {
        const data = {chatroomName:chatroomName, creatorUserId: user.userId, creatorUsername: user.username};
        try {
            setLoading(true);
            const resp = await createChatroom(data);
            toast(resp.message);
            fetchChatroomsLocal();
        }
        catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
        finally{
            setLoading(false);
        }
    } 

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
        }
    };

    const handleUploadLocal = async () => {
        if (!file) {
          toast('Please select a file first!');
          return;
        }
    
        try {
            const response = await handleUpload(file);
            toast('File uploaded and data stored successfully!');
        } 
        catch (err) {
            toast('Something went wrong!');
        }
    };

    if (isLoading) return <><AddHeader addTrigger={setIsDialogOpen} fileAddTrigger={setIsUploadDialogOpen}/><Loader /></>;

    return <div className="w-full min-h-screen">
        <AddHeader addTrigger={setIsDialogOpen} fileAddTrigger={setIsUploadDialogOpen}/>
        <>
            <div className="w-full min-h-80vh">
                <div className="mx-5">
                    <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-16">Welcome {user.username}!</h1>
                    <div className="flex flex-col justify-center items-center w-full">
                        <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-10">Chatrooms</h1>
                        <div className="flex flex-row justify-center items-center flex-wrap">
                            {chatrooms.map(createChatroomCards)}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Start a New Chatroom</DialogTitle>
                    </DialogHeader>
                    <Input id="newName" onChange={(e)=>{setChatroomName(e.target.value)}} className="w-full" autoFocus placeholder="Enter Room Name"/>
                    <DialogFooter className="flex justify-end">
                        <Button onClick={()=>{setIsDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Cancel</Button>
                        <Button onClick={()=>{createChatroomLocal(); setIsDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Create <MessageSquarePlus className="w-5 h-5 mr-2" /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Upload Excel Sheet</DialogTitle>
                    </DialogHeader>
                    <Input id="newFile" type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="w-full bg-blue-200 cursor-pointer" autoFocus/>
                    <DialogFooter className="flex justify-end">
                        <Button onClick={()=>{setIsUploadDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Cancel</Button>
                        <Button onClick={()=>{handleUploadLocal(); setIsUploadDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Upload</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    </div>
}   

export default Home;

