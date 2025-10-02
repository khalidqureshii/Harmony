import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server} from "socket.io";
import router from "./router/auth-router.js";
import {connectDB} from "./utils/db.js"
import errorMiddleware from "./middlewares/error-middleware.js";
import cors from "cors";
import chatroomRouter from "./router/chatroom-router.js";
import chatRouter from "./router/chat-router.js";
import uicRouter from "./router/user-in-chatroom-router.js"; 
import Chat from "./models/chat-model.js";

const app = express();
const PORT = 5000;


app.use(cors({
    origin: ["https://harmony-a695.vercel.app","http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],  
    allowedHeaders: ["Content-Type", "Authorization"], 
    exposedHeaders: ["Content-Length", "X-Response-Time"], 
    credentials: true, 
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://harmony-a695.vercel.app","http://localhost:5173"],   // Replace with your frontend's URL
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
        credentials: true, // Enable for authentication
    },
});

app.use(express.json());
app.use("/api/auth", router);
app.use("/api/chat", chatRouter);
app.use("/api/chatroom", chatroomRouter);
app.use("/api/uic", uicRouter);
app.use(errorMiddleware);

connectDB().then( () => {
    server.listen(PORT, ()=> {
        console.log(`Server is running at Port ${PORT}`);
    })
});


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinChatroom", (chatroomName) => {
        socket.join(chatroomName);
        console.log(`${socket.id} joined chatroom: ${chatroomName}`);
    });

    socket.on("sendMessage", async ({ chatroomName, message, userId, username}) => {
        console.log(`Message: "${message}"\nChatroom: ${chatroomName}`);

        const newMessage = {
            chatroomId: chatroomName,
            userId,
            message,
            timestamp: new Date(),
            username
        };
        await Chat.create(newMessage);

        io.to(chatroomName).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("API is running...");
});