import {z} from "zod";

const chatSchema = z.object({
    chatroomId: z.number({required_error: "ChatroomId Not Found"}),

    userId: z.number({required_error: "User Id Not Found"}),

    username: z.string({required_error: "Username Not Found"}).trim(),
    
    message: z.string({required_error: "Message Not Found"}).max(512).trim()
});

export default chatSchema;