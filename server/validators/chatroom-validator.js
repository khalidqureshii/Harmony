import {z} from "zod";

const chatroomSchema = z.object({
    chatroomName: z.string({required_error: "Name is required"})
    .trim()
    .min(2, {message: "Minimum 2 Characters Needed"})
    .max(255, {message: "Max limit of 255 Characters"}),

    creatorUserId: z.number({required_error: "Creator's UserID is required"}),

    creatorUsername: z.string({required_error: "Username of Creator is required"})
});

export default chatroomSchema;