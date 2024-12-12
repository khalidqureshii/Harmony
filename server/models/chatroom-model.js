import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const AutoIncrement = sequence(mongoose);

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

chatroomSchema.plugin(AutoIncrement, {inc_field: "chatroomId"});
const Chatroom = mongoose.model("Room", chatroomSchema);
export default Chatroom;