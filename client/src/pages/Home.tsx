import { useState} from "react";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

function Home() {
    const user= useSelector((state:any)=>state.auth.user); 
    console.log(user);
    const displayName:string = `, ${user.username}`;
    const userID:any = user._id;
    const [isLoading, setLoading] = useState(false);

    if (isLoading) return <Loader />;

    return <div className="mx-5"><div className="flex flex-col justify-center items-center w-full h-90vh">
                <h1 className="mb-5 text-4xl md:text-5xl text-center">Welcome{displayName}</h1>
            </div></div>
}   

export default Home;