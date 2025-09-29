import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

type InputEntryFormat = {
    name: string;
    text: string;
    placeholder: string;
    changeFunction: React.ChangeEventHandler<HTMLInputElement>;
    value?: string;
};

function InputEntryPassword(props: InputEntryFormat) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="text-center relative mb-4 shadow-md">
            
            <div className="relative">
                <input
                    onChange={props.changeFunction}
                    type={showPassword ? "text" : "password"} 
                    className="px-3 py-1 rounded-lg w-64 h-10 text-left bg-inputColour text-black placeholder-black"
                    id={props.name}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={props.value}
                    autoComplete="on"
                    required
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-[20px] transform -translate-y-1/2 text-[#8a8a8a] text-md"
                >
                    {!showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
}

export default InputEntryPassword;
