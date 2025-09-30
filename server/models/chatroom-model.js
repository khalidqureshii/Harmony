import mongoose from "mongoose";


const chatroomSchema = new mongoose.Schema( {
    chatroomName: {
        type:String,
        require:true
    },
    userId: {
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
});

const Chatroom = mongoose.model("Room", chatroomSchema);
export default Chatroom;