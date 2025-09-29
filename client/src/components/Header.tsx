import {useNavigate } from "react-router-dom";

function Header () {
    const navigate = useNavigate();
    return <header className="flex flex-row justify-between customHeader py-4">
        <button onClick={()=>{navigate("/")}}><h1 className="text-2xl ml-5 md:text-3xl md:ml-7">Enter Now</h1></button>

        <button onClick={()=>{navigate("/logout")}}><h1 className="mr-5 md:mr-7 text-xl">Logout</h1></button>
    </header>
}

export default Header;