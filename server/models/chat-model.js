import mongoose from "mongoose";

// Define the Chat schema
const chatSchema = new mongoose.Schema({
    chatroomId: {
        type: Number,
        required: true
    },
    userId: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});


const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
