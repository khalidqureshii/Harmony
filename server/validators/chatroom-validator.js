import {z} from "zod";

const chatroomSchema = z.object({
    chatroomName: z.string({required_error: "Name is required"})
    .trim()
    .min(2, {message: "Minimum 2 Characters Needed"})
    .max(255, {message: "Max limit of 255 Characters"}),

    userId: z.string({required_error: "Creator's UserID is required"})
    .trim()
    .min(1, {message: "Invalid UserID"}),
});

export default chatroomSchema;