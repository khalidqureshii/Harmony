import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ChatroomCard from "../components/ChatroomCard";
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
import { CardType } from "../store/Types";
import { createChatroom, fetchChatroomsForUser, handleUpload } from "@/api/Home";
import { useSelector } from "react-redux";


function Home() {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const userLoading = useSelector((state: any) => state.auth.userLoading);
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn]);

    useEffect(()=>{
        fetchChatroomsLocal();
    },[])
        
    
    const user = useSelector((state:any) => state.auth.user)
    const [isLoading, setLoading] = useState(true);
    const [joinedChatrooms, setJoinedChatrooms] = useState([]);
    const [otherChatrooms, setOtherChatrooms] = useState([]);
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
            console.log("User ID: ", user.userId);
            const resp = await fetchChatroomsForUser(user.userId);
            setJoinedChatrooms(resp.joinedChatrooms);
            setOtherChatrooms(resp.notJoined);
            console.log("Joined Chatrooms: ", resp.joinedChatrooms);
            console.log("Other Chatrooms: ", resp.notJoined);
            console.log("User Id: ", user.userId);
        } catch (error) {
            setJoinedChatrooms([]);
            setOtherChatrooms([]);
        }   finally {
            setLoading(false);
        }
    }

    async function createChatroomLocal() {
        const data = {chatroomName:chatroomName, userId: user.userId, creatorUsername: user.username};
        try {
            setLoading(true);
            const resp = await createChatroom(data);
            toast.success(resp.message);
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
          toast.error('Please select a file first!');
          return;
        }
    
        try {
            await handleUpload(file);
            toast.success('File uploaded and data stored successfully!');
        } 
        catch (err) {
            toast.error('Something went wrong!');
        }
    };

    if (userLoading || isLoading) return <><AddHeader addTrigger={setIsDialogOpen} fileAddTrigger={setIsUploadDialogOpen}/><Loader /></>;

    return <div className="w-full min-h-screen">
        <AddHeader addTrigger={setIsDialogOpen} fileAddTrigger={setIsUploadDialogOpen}/>
        <>
            <div className="w-full min-h-80vh">
                <div className="mx-5">
                    <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-16">Welcome {user.username}!</h1>
                    <div className="flex flex-col justify-center items-center w-full">
                        <div className="flex flex-col justify-center items-center w-full">
                            <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-10">Joined Chatrooms</h1>
                            <div className="flex flex-row justify-center items-center flex-wrap">
                                {joinedChatrooms.map(createChatroomCards)}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-10">Other Chatrooms</h1>
                            <div className="flex flex-row justify-center items-center flex-wrap">
                                {otherChatrooms.map(createChatroomCards)}
                            </div>
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
                    <Input id="newFile" type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="w-full bg-blue-200 cursor-pointer" autoFocus autoComplete="off"/>
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

