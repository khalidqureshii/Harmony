import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LINK from '../store/Link';
import Loader from '../components/Loader';
import { Send } from 'lucide-react';
import { FaPenToSquare } from 'react-icons/fa6';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {ChatroomType, MessageType} from "../store/Types";

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
// import { Label } from '@radix-ui/react-label';
import { deleteMessage, editMessage, fetchMessages, fetchChatroom } from '@/api/Chatroom';
import { useSelector } from 'react-redux';
import { Label } from '@/components/ui/label';


const Chatroom = () => {
    const { chatroomId } = useParams();
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const userLoading = useSelector((state: any) => state.auth.userLoading);
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn]);
    
    useEffect(() => {
        fetchChatroomLocal();
        fetchMessagesLocal();
    }, [chatroomId]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        const socketInstance = io(LINK); 
        setSocket(socketInstance);
  
        socketInstance.emit('joinChatroom', chatroomId);
  
        socketInstance.on('receiveMessage', (message: MessageType) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
  
        return () => {
            socketInstance.disconnect(); 
        };
    }, [chatroomId]);

    
    
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const user = useSelector((state:any) => state.auth.user)
    const [chatroomData, setChatroomData] = useState<ChatroomType>({
        _id: '',
        chatroomName: '',
        userId: '',
        createdAt: new Date(Date.now()),
    });
    const [newMessage, setNewMessage] = useState<string>('');
    const [areMessagesSet, setMessagesSet] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(null);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
    const [editedMessage, setEditedMessage] = useState<string>("");

    
    const sendMessage = () => {
        if (newMessage.trim() && socket) {
            socket.emit('sendMessage', {
                chatroomName: chatroomId,
                message: newMessage,
                userId: user._id, 
                username: user.username, 
            });
            setNewMessage('');
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    function returnDisplayTime(msgDate: any): string {
        if (!areMessagesSet) return "";
        const date = (msgDate instanceof Date) ? msgDate : new Date(msgDate);
        
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }
    
    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    
    async function deleteMessageLocal() {
        const msg = selectedMessage!;
        if (msg._id != user._id) {
            toast.error("User Not authorized");
            return;
        }
        const data = {
            _id: msg._id, 
            userId: msg.userId,
        };
        setIsLoading(true);
        try {
            await deleteMessage(data); 
            toast.success("Successfully Deleted Message");
            fetchMessagesLocal();  
        }   
        catch (error) {
            toast.error("Error Deleting Message");
        }
        finally {
            setIsLoading(false);
        }
    }
    
    async function editMessageLocal(newMessage: string) {
        const msg:MessageType = selectedMessage!;
        if (msg.username != user.username) {
            toast.error("User Not authorized");
            return;
        }
        const data = {
            _id: msg._id, 
            userId: msg.userId,
            newMessage: newMessage
        };
        setIsLoading(true);
        try{
            await editMessage(data); 
            toast.success("Successfully Edited Message");
            fetchMessagesLocal();
        }
        catch (error) {
            toast.error("Error Editing Message");
        }
        finally {
            setIsLoading(false);
        }
    }

    async function fetchMessagesLocal() {
        try {
            setIsLoading(true);
            if (!chatroomId) {
                throw new Error("Chatroom ID is undefined");
            }
            const response = await fetchMessages(chatroomId);
            setMessages(response.chatrooms);
            setMessagesSet(true);
        }
        catch (error) {
            toast.error("Error Fetching Messages");
        }
        finally {
            setIsLoading(false);
        }
    }

    async function fetchChatroomLocal() {
        setIsLoading(true);
        try {
            if (!chatroomId) {
                throw new Error("Chatroom ID is undefined");
            }
            const response = await fetchChatroom(chatroomId);
            setChatroomData(response.chatroomInfo[0]);
        }
        catch (error) {
            toast.error("Error Fetching Chatroom");
        }
        finally {
            setIsLoading(false);
        }
    }

    if (isLoading || userLoading) return <Loader />;
    return (
        <>
            <div className="flex flex-col justify-center items-center w-screen h-80vh mt-10 mb-10">
                <div className="bg-[#c7c7c7] w-11/12 rounded-xl max-w-[775px]">
                    <h1 className="text-5xl text-black font-extrabold text-center mt-8 pb-5 relative 
                    after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1.75px] after:bg-gradient-to-r after:from-transparent after:via-[#b1b1b1] after:to-transparent">{chatroomData.chatroomName}</h1>

                    <div className="chat-window h-[calc(80vh-250px)] overflow-y-auto pb-8 pt-4 md:px-8 px-4 rounded-xl flex flex-col justify-start items-start scrollbar-rounded shadow-2xl">
                        {messages.map((msg, index) => {
                            const currentMessageDate = new Date(msg.timestamp);
                            const previousMessageDate = index > 0 ? new Date(messages[index - 1].timestamp) : null;
                            const isNewDay = !previousMessageDate || currentMessageDate.toDateString() !== previousMessageDate.toDateString();
                            
                            return (
                                <React.Fragment key={index}>
                                    {isNewDay && (
                                        <div key={`date-${index}`} className="w-full text-center my-4">
                                            <span className="bg-[#c7c7c7] text-black py-2 px-4 rounded-lg">
                                                {formatDate(currentMessageDate)}
                                            </span>
                                        </div>
                                    )}
                                    <div className='w-full flex flex-col justify-center items-center group mb-3'>
                                        {msg.username === user.username ? (
                                            <div className='max-w-72 custom2:max-w-lg flex items-center justify-center self-end'>
                                                <div className='flex items-center justify-center opacity-0 group-hover:opacity-100 mr-3'>
                                                    <FaPenToSquare className="mr-3 cursor-pointer text-slate-600 text-xl" onClick={()=>{setSelectedMessage(msg);setIsDialogOpen(true)}}/>
                                                    <FaTrashAlt className="text-slate-600 text-xl cursor-pointer" onClick={()=>{setSelectedMessage(msg);setIsAlertDialogOpen(true)}}/>
                                                </div>
                                                <div className="bg-blue-600 py-2 px-2 rounded-xl max-w-md break-words">
                                                    <strong className="text-gray-200">{"You"}</strong>
                                                    <br />
                                                    <p className="text-white">{msg.message}</p>
                                                    <p className="text-right text-xs text-gray-200">{returnDisplayTime(msg.timestamp)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='max-w-72 md:max-w-lg flex items-center justify-center self-start'>
                                                <div className="bg-blue-600 py-2 px-2 rounded-xl max-w-md break-words">
                                                    <strong className="text-gray-200">{msg.username}</strong>
                                                    <br />
                                                    <p className="text-white">{msg.message}</p>
                                                    <p className="text-right text-xs text-gray-200">{returnDisplayTime(msg.timestamp)}</p>
                                                </div>
                                                {(user.isAdmin) && (
                                                <div className='flex items-center justify-center opacity-0 group-hover:opacity-100 ml-3'>
                                                    <FaTrashAlt className="text-slate-600 text-xl cursor-pointer" onClick={()=>{setSelectedMessage(msg);setIsAlertDialogOpen(true)}}/>
                                                </div>)}
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={chatEndRef}></div>
                    </div>
                    <div className="flex w-full">
                        <textarea
                            className="w-full h-12 px-3 rounded-bl-xl border-0 resize-none flex items-center pt-2"
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Type your message"
                        />

                        <button 
                            onClick={sendMessage}
                            className="bg-blue-600 hover:bg-blue-400 text-white p-3 rounded-br-xl transition-colors duration-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
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
                    This action cannot be undone. This will permanently delete this chat from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="font-universal hover:bg-blue-400 text-white hover:text-white bg-blue-600" >Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{deleteMessageLocal();  setIsAlertDialogOpen(false)}} className="font-universal hover:bg-blue-400 text-white bg-blue-600" >Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Edit Message</DialogTitle>
                    <DialogDescription>
                        Make changes to your Message here. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="oldName" className="text-right">
                        Old
                        </Label>
                        <Input id="oldName" value={selectedMessage?.message} className="col-span-3" readOnly/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newName" className="text-right">
                        New
                        </Label>
                        <Input id="newName" defaultValue={selectedMessage?.message} onChange={(e)=>{setEditedMessage(e.target.value)}} className="col-span-3" autoFocus/>
                    </div>
                    </div>
                    <DialogFooter>
                    <Button onClick={()=>{editMessageLocal(editedMessage); setIsDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal'>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};


export default Chatroom;