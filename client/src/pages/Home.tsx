import { useState, useEffect } from "react";
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
import { createChatroom, fetchChatroomsForUser, requestToJoinChatroom } from "@/api/Home";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LockedChatroomCard from "@/components/LockedChatroomCard";


function Home() {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const userLoading = useSelector((state: any) => state.auth.userLoading);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchChatroomsLocal();
    }, [])

    const user = useSelector((state: any) => state.auth.user)
    const [isLoading, setLoading] = useState(true);
    const [joinedChatrooms, setJoinedChatrooms] = useState<CardType[]>([]);
    const [otherChatrooms, setOtherChatrooms] = useState<CardType[]>([]);
    const [chatroomName, setChatroomName] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    function createChatroomCards(entry: CardType) {
        return <ChatroomCard
            chatroomName={entry.chatroomName}
            createdAt={entry.createdAt}
            key={entry._id}
            _id={entry._id}
        />
    }

    async function sendRequestToJoinChatroom(chatroomId: string) {
        const data = { chatroomId: chatroomId, userId: user._id };
        try {
            setLoading(true);
            const resp = await requestToJoinChatroom(data);
            toast.success(resp.message);
        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    function createLockedChatroomCards(entry: CardType) {
        return <LockedChatroomCard
            chatroomName={entry.chatroomName}
            createdAt={entry.createdAt}
            key={entry._id}
            chatroomId={entry._id}
            onRequestJoin={sendRequestToJoinChatroom} 
        />
    }

    async function fetchChatroomsLocal() {
        try {
            setLoading(true);
            const resp = await fetchChatroomsForUser(user._id);
            setJoinedChatrooms(resp.joinedChatrooms);
            setOtherChatrooms(resp.notJoined);
        } catch (error) {
            setJoinedChatrooms([]);
            setOtherChatrooms([]);
        } finally {
            setLoading(false);
        }
    }

    async function createChatroomLocal() {
        const data = { chatroomName: chatroomName, userId: user._id};
        try {
            setLoading(true);
            const resp = await createChatroom(data);
            toast.success(resp.message);
            fetchChatroomsLocal();
        }
        catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    if (userLoading || isLoading) return <><AddHeader addTrigger={setIsDialogOpen} /><Loader /></>;

    return (
        <div className="w-full min-h-screen">
            <AddHeader addTrigger={setIsDialogOpen} />
            <div className="w-full min-h-80vh">
                <div className="mx-5">
                    <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-16">
                        Welcome {user.username}!
                    </h1>

                    {/* Tabs for Chatrooms */}
                    <div className="flex flex-col items-center w-full mt-10">
                        <Tabs defaultValue="joined" className="w-full max-w-5xl bg-none">
                            <TabsList className="flex justify-center mb-9 bg-transparent p-0">
                                <TabsTrigger
                                    value="joined"
                                    className="w-72 rounded-lg px-4 py-2 text-lg font-bold 
                                            data-[state=active]:bg-white data-[state=active]:text-black
                                            data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700
                                            transition-colors"
                                >
                                    Joined Chatrooms
                                </TabsTrigger>

                                <TabsTrigger
                                    value="other"
                                    className="w-72 rounded-lg px-4 py-2 text-lg font-bold 
                                            data-[state=active]:bg-white data-[state=active]:text-black
                                            data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700
                                            transition-colors"
                                >
                                    Join More Chatrooms
                                </TabsTrigger>

                                <TabsTrigger
                                    value="add"
                                    className="w-72 rounded-lg px-4 py-2 text-lg font-bold flex items-center justify-center gap-2
                                                data-[state=active]:bg-white data-[state=active]:text-black
                                                data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700
                                                transition-colors"
                                    >
                                    Add Chatroom
                                </TabsTrigger>
                            </TabsList>

                            {/* Joined Chatrooms Tab */}
                            <TabsContent value="joined" className="flex flex-col items-center">
                                {joinedChatrooms.length === 0 ? (
                                    <p className="text-gray-600 mb-5 text-2xl">No joined chatrooms available. Request to Enter One</p>
                                ) : (
                                    <div className="flex flex-row justify-center items-center flex-wrap gap-4">
                                        {joinedChatrooms.map(createChatroomCards)}
                                    </div>
                                )}
                            </TabsContent>

                            {/* Other Chatrooms Tab */}
                            <TabsContent value="other" className="flex flex-col items-center">
                                {otherChatrooms.length === 0 ? (
                                    <p className="text-gray-600 mb-5 text-2xl">No other chatrooms available. Create one!</p>
                                ) : (
                                    <div className="flex flex-row justify-center items-center flex-wrap gap-4">
                                        {otherChatrooms.map(createLockedChatroomCards)}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="add" className="flex flex-col items-center">
                                <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
                                <h2 className="text-2xl font-bold mb-4">Create a New Chatroom</h2>
                                <Input
                                    id="newName"
                                    value={chatroomName}
                                    onChange={(e) => setChatroomName(e.target.value)}
                                    className="w-full mb-4"
                                    placeholder="Enter Room Name"
                                />
                                <Button
                                    onClick={async () => {
                                    await createChatroomLocal();
                                    setChatroomName(""); // reset input
                                    // optionally switch back to joined tab after creation
                                    const tabs = document.querySelector<HTMLElement>('[data-value="joined"]');
                                    tabs?.click();
                                    }}
                                    className="bg-blue-600 hover:bg-blue-400 text-white font-semibold w-full"
                                >
                                    <MessageSquarePlus className="w-5 h-5 mr-2" /> Submit
                                </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Create Chatroom Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Start a New Chatroom</DialogTitle>
                    </DialogHeader>
                    <Input
                        id="newName"
                        onChange={(e) => { setChatroomName(e.target.value) }}
                        className="w-full"
                        autoFocus
                        placeholder="Enter Room Name"
                    />
                    <DialogFooter className="flex justify-end">
                        <Button onClick={() => { setIsDialogOpen(false) }} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>
                            Cancel
                        </Button>
                        <Button onClick={() => { createChatroomLocal(); setIsDialogOpen(false) }} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>
                            <MessageSquarePlus className="w-5 h-5 mr-2" /> Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Home;
