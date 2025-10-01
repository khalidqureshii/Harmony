function DummyHeader () {

    return <header className="customHeader py-4">
        <div className="mx-3 md:mx-7 flex flex-row justify-between items-center">
            <button>
                <div className="flex my-0.5">
                    <img src="logo.png" style={{ width: "2.5rem", height: "auto", objectFit: "contain" }} className="mr-3" />
                    <h1 className="text-[2.9rem] font-bold font-logo hidden md:block">Harmony</h1>
                </div>
            </button>
        </div>
    </header>
}

export default DummyHeader;

