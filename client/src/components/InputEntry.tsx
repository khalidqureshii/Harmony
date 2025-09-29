type InputEntryFormat = {
    name:string;
    text:string;
    placeholder:string;
    changeFunction: React.ChangeEventHandler<HTMLInputElement>;
    value?:string;
}

function InputEntry(props:InputEntryFormat) {
    return <div className="text-center mb-4 shadow-md">   
        <input onChange={props.changeFunction} type="text" className="px-3 py-1 rounded-lg w-64 h-10 text-left bg-inputColour text-black placeholder-black"
            id={props.name} name={props.name} placeholder={props.placeholder} value={props.value} autoComplete="on" required/>
        <br />
    </div>
}   

export default InputEntry;