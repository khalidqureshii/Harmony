import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./router/auth-router.js";
import {connectDB} from "./utils/db.js"
import errorMiddleware from "./middlewares/error-middleware.js";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", router);
app.use(errorMiddleware);

connectDB().then( () => {
    app.listen(PORT, ()=> {
        console.log(`Server is running at Port ${PORT}`);
    })
});