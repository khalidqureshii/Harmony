import { useNavigate } from "react-router-dom";
import { MessageSquare, User, Calendar } from 'lucide-react';
import { useState } from "react";

type CardType = {
    chatroomName: string,
    createdAt: Date,
    creatorUsername: string,
    chatroomId: number,
}

const ChatroomCard = (props: CardType) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const dateStr = props.createdAt;
    const unformattedDate = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = unformattedDate.toLocaleDateString('en-US', options);
    const colors = ['bg-[#cb3d3d]', 'bg-[#ff7728]','bg-[#ffce21]','bg-[#3aa71a]', 'bg-[#4b4b4b]','bg-[#1fd991]','bg-[#1edad5]','bg-[#0083b8]','bg-[#004bb8]','bg-[#2f1477]','bg-[#961bab]', 'bg-[#e01a9d], bg-[#f31265]'];

    const randomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div
            className={`${randomColor()} rounded-xl p-6 group text-center m-3 cursor-pointer shadow-lg transition-all duration-300 ease-in-out transform ${isHovered ? 'scale-105' : ''} hover:shadow-xl`}
            onClick={() => navigate(`/chatroom/${props.chatroomId}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white mr-2" />
                <h1 className="text-3xl font-bold text-white">
                    {props.chatroomName}
                </h1>
            </div>
            <div className="flex items-center justify-center mb-2 text-white">
                <User className="w-5 h-5 mr-2" />
                <h2 className="text-xl">{props.creatorUsername}</h2>
            </div>
            <div className="flex items-center justify-center text-white">
                <Calendar className="w-5 h-5 mr-2" />
                <h2>{formattedDate}</h2>
            </div>
            {isHovered && (
                <div className="mt-4 bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
                    <p className="text-white font-semibold">Click to join the chat!</p>
                </div>
            )}
        </div>
    );
}

export default ChatroomCard;


// import { useNavigate } from "react-router-dom";

// type CardType = {
//     chatroomName:string,
//     createdAt:Date,
//     creatorUsername:string,
//     chatroomId:number,
// }

// const ChatroomCard = (props:CardType) => {
//     const navigate = useNavigate();
//     const dateStr = props.createdAt;
//     const unformattedDate = new Date(dateStr);
//     const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
//     const formattedDate = unformattedDate.toLocaleDateString('en-US', options);

//     return (
//         <div
//             className="bg-[#b1b1b1] rounded-xl py-6 px-4 group text-center mx-3 my-3 cursor-pointer shadow-4xl transition-transform duration-300 hover:scale-110 hover:shadow-5xl"
//             onClick={() => navigate(`/chatroom/${props.chatroomId}`)}
//         >
//             <h1
//                 className="text-3xl text-black mb-5 cursor-pointer"
//                 onClick={(e) => {
//                     e.stopPropagation(); 
//                     navigate(`/chatroom/${props.chatroomId}`);
//                 }}
//             >
//                 {props.chatroomName}
//             </h1>
//             <h2 className="text-xl text-black mb-2">Creator: {props.creatorUsername}</h2>
//             <h2>{formattedDate}</h2>
//         </div>
//     );
    
// }

// export default ChatroomCard

