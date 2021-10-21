import React, {createContext,useState,useEffect} from 'react';
import AuthService from '../Services/AuthService';

export const AuthContext = createContext();

export default ({ children })=>{
    const [user,setUser] = useState(null);
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const [isLoaded,setIsLoaded] = useState(false);
    const [Modalw,setModalw] = useState(true);

    

    return (
        <div>
             <AuthContext.Provider value={{user,setUser,isAuthenticated,setIsAuthenticated,Modalw,setModalw}}>
                { children }
            </AuthContext.Provider>
        </div>
    )
}