import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI.toString());
        console.log("Connection to Database Successful!");
    }
    catch (error) {
        console.log(error);
        process.exit(0);
    }
}

export {connectDB};