import {z} from "zod";

const signupSchema = z.object({
    username: z.string({required_error: "Name is required"})
    .trim()
    .min(3, {message: "Minimum 3 Characters Needed"})
    .max(255, {message: "Max limit of 255 Characters"}),

    email: z.string({required_error: "Email is required"})
    .trim()
    .email({message: "Invalid email address"})
    .min(3, {message: "Minimum 3 Characters Needed in email"})
    .max(255, {message: "Max limit of 255 Characters in email"}),

    password: z.string({required_error: "Password is Required"})
    .trim()
    .min(6, {message: "Password should be more than 6 Characters" })
    .max(20, {message: "Password should be less than 20 Characters" }),
});

export default signupSchema;