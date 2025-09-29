import {useNavigate } from "react-router-dom";

function Header () {
    const navigate = useNavigate();
    return <header className="flex flex-row justify-between customHeader py-4">
        <div className="ml-5 md:ml-7 flex flex-row items-center">
            <img src="logo.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
            <button onClick={()=>{navigate("/")}}><h1 className="text-2xl ml-3 md:text-3xl ">Chime</h1></button>
        </div>

        <button onClick={()=>{navigate("/logout")}}><h1 className="mr-5 md:mr-7 text-xl">Logout</h1></button>
    </header>
}

export default Header;