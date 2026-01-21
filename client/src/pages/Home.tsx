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

// SAME COLORS AS YOUR OTHER CARDS
const colors = [
  'bg-[#cb3d3d]', 
  'bg-[#ff7728]',
  'bg-[#ffce21]',
  'bg-[#3aa71a]', 
  'bg-[#4b4b4b]',
  'bg-[#1fd991]',
  'bg-[#1edad5]',
  'bg-[#0083b8]',
  'bg-[#004bb8]',
  'bg-[#2f1477]',
  'bg-[#961bab]', 
  'bg-[#e01a9d]', 
  'bg-[#f31265]'
];

function Home() {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const userLoading = useSelector((state: any) => state.auth.userLoading);

    const user = useSelector((state: any) => state.auth.user)

    const [isLoading, setLoading] = useState(true);
    const [joinedChatrooms, setJoinedChatrooms] = useState<CardType[]>([]);
    const [otherChatrooms, setOtherChatrooms] = useState<CardType[]>([]);
    const [chatroomName, setChatroomName] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);


    const [addCardColor, setAddCardColor] = useState(
    colors[Math.floor(Math.random() * colors.length)]
    );
    const [isAddHovered, setIsAddHovered] = useState(false);

    const changeAddCardColor = () => {
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        setAddCardColor(newColor);
    };



    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchChatroomsLocal();
    }, [])

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

                    <div className="flex flex-col items-center w-full mt-10">
                        <Tabs defaultValue="joined" className="w-full max-w-5xl bg-none">
                            <TabsList className="flex justify-center mb-9 bg-transparent p-0">
                                <TabsTrigger value="joined" className="w-72 rounded-lg px-4 py-2 text-lg font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700">
                                    Joined Chatrooms
                                </TabsTrigger>
                                <TabsTrigger value="other" className="w-72 rounded-lg px-4 py-2 text-lg font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700">
                                    Join More Chatrooms
                                </TabsTrigger>
                                <TabsTrigger value="add" className="w-72 rounded-lg px-4 py-2 text-lg font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700">
                                    Add Chatroom
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="joined" className="flex flex-col items-center">
                                <div className="flex flex-row justify-center items-center flex-wrap gap-4">
                                    {joinedChatrooms.map(createChatroomCards)}
                                </div>
                            </TabsContent>

                            <TabsContent value="other" className="flex flex-col items-center">
                                <div className="flex flex-row justify-center items-center flex-wrap gap-4">
                                    {otherChatrooms.map(createLockedChatroomCards)}
                                </div>
                            </TabsContent>

                            {/* ADD CHATROOM - SAME COLOR SYSTEM */}
                            <TabsContent value="add" className="flex justify-center items-start mt-3">
                                <div
                                    className={`
                                    ${addCardColor}
                                    w-[420px] h-[180px]
                                    rounded-xl p-6
                                    cursor-pointer text-white
                                    shadow-lg
                                    transition-all duration-300 ease-in-out
                                    transform
                                    ${isAddHovered ? "scale-105 shadow-2xl" : "scale-100"}
                                    flex flex-col justify-center
                                    `}
                                    onMouseEnter={() => {
                                    setIsAddHovered(true);
                                    changeAddCardColor();
                                    }}
                                    onMouseLeave={() => setIsAddHovered(false)}
                                >
                                    {/* Title Row */}
                                    <div className="flex items-center justify-center mb-3 gap-2">
                                    <MessageSquarePlus className="w-7 h-7" />
                                    <h2 className="text-2xl font-bold">
                                        Create Chatroom
                                    </h2>
                                    </div>

                                    {/* Input */}
                                    <div className="flex justify-center mb-3">
                                    <Input
                                        value={chatroomName}
                                        onChange={(e) => setChatroomName(e.target.value)}
                                        placeholder="Room name..."
                                        className="
                                        w-96
                                        bg-white/20 
                                        border-white/30 
                                        text-white 
                                        placeholder:text-white/70
                                        text-center
                                        mb-2
                                        mt-1
                                        "
                                    />
                                    </div>

                                    {/* Button */}
                                    <div className="flex justify-center">
                                    <Button
                                        onClick={async () => {
                                        await createChatroomLocal();
                                        setChatroomName("");
                                        const tabs = document.querySelector<HTMLElement>('[data-value="joined"]');
                                        tabs?.click();
                                        }}
                                        className="bg-white text-black hover:bg-white/90 font-semibold px-8"
                                    >
                                        Create
                                    </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Dialog can stay or be removed */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Start a New Chatroom</DialogTitle>
                    </DialogHeader>
                    <Input
                        onChange={(e) => { setChatroomName(e.target.value) }}
                        className="w-full"
                        autoFocus
                        placeholder="Enter Room Name"
                    />
                    <DialogFooter>
                        <Button onClick={() => { setIsDialogOpen(false) }}>
                            Cancel
                        </Button>
                        <Button onClick={() => { createChatroomLocal(); setIsDialogOpen(false) }}>
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Home;
