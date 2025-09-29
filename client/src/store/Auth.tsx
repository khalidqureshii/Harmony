import React from "react";
import LINK from "./Link";
import Loader from "../components/Loader";
import DummyHeader from "../components/DummyHeader";
import TOKENNAME from "./Token";

interface AuthContextType {
    isLoggedIn: boolean;
    storeTokenInLS: (serverToken: string) => void;
    LogoutUser: () => void;
    user: string;
}

export const AuthContext = React.createContext<AuthContextType|null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setLoading] = React.useState(false);
    const[token, setToken] = React.useState(localStorage.getItem(TOKENNAME));
    const [user, setUser] = React.useState("");

    const storeTokenInLS = (serverToken: string) => {
        setToken(serverToken);
        return localStorage.setItem(TOKENNAME, serverToken);
    };

    let isLoggedIn = !!token;

    const LogoutUser = () => {
        console.log("Logged Out");
        setToken("");
        return localStorage.removeItem(TOKENNAME);
    };

    const userAuthentication = async () => {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/auth/user", {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                }
            });
            setLoading(false);
            if (response.ok) {
                const data = await response.json();
                const userData = data.msg;
                setUser(userData);
            }
        }
        catch (err) {
            console.log("Error Fetching User Data");
            setLoading(false);
        }
    }

    React.useEffect(() => {
        userAuthentication();
    }, [token]);
    
    return (<AuthContext.Provider value={{isLoggedIn, storeTokenInLS, LogoutUser, user}}>
        {isLoading?<><DummyHeader /><Loader /></> :children}
    </AuthContext.Provider>);
};

export const useAuth = () => {
    const authContextValue = React.useContext(AuthContext);
    if (!authContextValue) {
      throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};

export default useAuth;