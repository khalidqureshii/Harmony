import mongoose from "mongoose";

const userInChatroomSchema = new mongoose.Schema( {
    chatroomId: {
        type:String,
        require:true
    },
    userId: {
        type:String,
        require:true
    },
    status: {
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    joinedAt: {
        type: Date,
        require: false
    }
});

const UserInChatroom = mongoose.model("UserInChatroom", userInChatroomSchema);
export default UserInChatroom;