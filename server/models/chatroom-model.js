import mongoose from "mongoose";


const chatroomSchema = new mongoose.Schema( {
    chatroomName: {
        type:String,
        require:true
    },
    creatorUserId: {
        type:Number,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Chatroom = mongoose.model("Room", chatroomSchema);
export default Chatroom;