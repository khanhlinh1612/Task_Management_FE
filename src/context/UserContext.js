import {createContext, useState} from "react";
export const UserContext = createContext({});
export function UserContextProvider({children}){
    const savedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [userInfo, setUserInfo] = useState(savedUserInfo);
    return(

        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}
