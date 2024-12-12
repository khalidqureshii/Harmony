import {z} from "zod";

const chatroomSchema = z.object({
    chatroomName: z.string({required_error: "Name is required"})
    .trim()
    .min(3, {message: "Minimum 3 Characters Needed"})
    .max(255, {message: "Max limit of 255 Characters"}),

    userId: z.number({required_error: "Creator's UserID is required"})
});

export default chatroomSchema;