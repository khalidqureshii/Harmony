import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPenToSquare } from "react-icons/fa6";

type CardType = {
    chatroomName:string,
    createdAt:Date,
    creatorUsername:string,
    chatroomId:number,
    deleteHandler: (x:boolean) => void,
    setChatroomMethod: (x:number)=>void,
    editHandler: (x:boolean) => void,
    setOldName: (x:string)=>void
};

const ChatroomRow = (props:CardType) => {
    const navigate = useNavigate();
    const dateStr = props.createdAt;
    const unformattedDate = new Date(dateStr);
    const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = unformattedDate.toLocaleDateString('en-US', options);

    return (
        <>
            <div className=" py-6 px-4 group flex flex-row items-center">
                <h1 className='text-2xl text-black w-6/12 text-left cursor-pointer' onClick={()=>{navigate(`/chatroom/${props.chatroomId}`)}}>{props.chatroomName}</h1>
                <h2 className="text-2xl text-black w-2/12 text-left">{props.creatorUsername}</h2>
                <h2 className="text-2xl text-black w-3/12 text-left">{formattedDate}</h2>
                <div className="w-1/12">
                    <div className="flex justify-evenly items-center">
                        <FaPenToSquare className="text-slate-700 text-xl cursor-pointer" onClick={()=>{props.setChatroomMethod(props.chatroomId); props.setOldName(props.chatroomName);props.editHandler(true)}} />
                        <FaTrashAlt
                            className="text-slate-700 text-xl cursor-pointer"
                            onClick={() => {props.setChatroomMethod(props.chatroomId); props.deleteHandler(true)}}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatroomRow;
