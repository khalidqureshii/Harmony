import express from "express";
import http from "http";
import { Server} from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import router from "./router/auth-router.js";
import {connectDB} from "./utils/db.js"
import errorMiddleware from "./middlewares/error-middleware.js";
import chatroomRouter from "./router/chatroom-router.js"
import chatRouter from "./router/chat-router.js";
import Chat from "./models/chat-model.js";
import fileRouter from "./router/file-router.js";

const PORT= 5000; 
const app = express();

app.use(cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
    credentials: true,
}));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: "*", 
    },
});
app.use(express.json());
app.use("/api/auth", router);
app.use("/api/chatroom", chatroomRouter);
app.use("/api/chat", chatRouter);
app.use("/api/file", fileRouter);
app.use(errorMiddleware);


app.get('/', (req, res) => {
    res.json({msg:'Hello from Node.js on Vercel!'});
  });

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinChatroom", (chatroomName) => {
        socket.join(chatroomName);
        console.log(`${socket.id} joined chatroom: ${chatroomName}`);
    });

    socket.on("sendMessage", async ({ chatroomName, message, userId, username }) => {
        console.log(`Message: "${message}"\nChatroom: ${chatroomName}`);

        const newMessage = {
            chatroomId: chatroomName,
            userId,
            username,
            message,
            timestamp: new Date(),
        };
        await Chat.create(newMessage);

        io.to(chatroomName).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

connectDB().then( () => {
    server.listen(PORT, ()=> {
        console.log(`Server is running at Port ${PORT}`);
    })
});