import { useState } from "react";
import { Lock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

type LockedCardType = {
    chatroomName: string,
    createdAt: Date,
    creatorUsername: string,
    chatroomId: string,
    onRequestJoin?: (chatroomId: string) => void; // callback for request join
}

const LockedChatroomCard = (props: LockedCardType) => {
    const [isHovered, setIsHovered] = useState(false);

    const dateStr = props.createdAt;
    const unformattedDate = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = unformattedDate.toLocaleDateString("en-US", options);

    const colors = [
        "bg-[#cb3d3d]", "bg-[#ff7728]", "bg-[#ffce21]", "bg-[#3aa71a]",
        "bg-[#4b4b4b]", "bg-[#1fd991]", "bg-[#1edad5]", "bg-[#0083b8]",
        "bg-[#004bb8]", "bg-[#2f1477]", "bg-[#961bab]", "bg-[#e01a9d]", "bg-[#f31265]"
    ];

    const randomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div
            className={`${randomColor()} opacity-70 rounded-xl p-6 group text-center m-3 cursor-default shadow-lg transition-all duration-300 ease-in-out transform ${isHovered ? "scale-105" : ""} hover:shadow-xl`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header with Lock */}
            <div className="flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white mr-2" />
                <h1 className="text-3xl font-bold text-white">
                    {props.chatroomName}
                </h1>
            </div>

            {/* Creator Info */}
            <div className="flex items-center justify-center mb-2 text-white">
                <User className="w-5 h-5 mr-2" />
                <h2 className="text-xl">{props.creatorUsername}</h2>
            </div>

            {/* Created Date */}
            <div className="flex items-center justify-center text-white">
                <Calendar className="w-5 h-5 mr-2" />
                <h2>{formattedDate}</h2>
            </div>

            {/* Hover State */}
            {isHovered && (
                <div className="mt-4 bg-opacity-20 p-3 rounded-lg backdrop-blur-sm flex justify-center">
                    <Button
                        onClick={() => props.onRequestJoin?.(props.chatroomId)}
                        className="bg-black hover:bg-gray-700 text-white font-semibold"
                    >
                        Click to Request 
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LockedChatroomCard;
