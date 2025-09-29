import {z} from "zod";

const loginSchema = z.object({
    email: z.string({message: "Email is required"})
    .trim()
    .email()
    .min(3, {message: "Minimum 3 Characters Needed in email"})
    .max(255, {message: "Max limit of 255 Characters in email"}),

    password: z.string({required_error: "Password is Required"})
    .trim()
    .min(6, {message: "Password should be more than 6 Characters" })
    .max(20, {message: "Password should be less than 20 Characters" })
});

export default loginSchema;