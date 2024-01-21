import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {

  const [user, setUser] = useState(null);
  const [ready , setReady] = useState(false)

  useEffect( () => {
    if (!user) {
      try {
         axios.get("/profile")
        .then(({data})=>{
          setUser(data);
          setReady(true)
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser , ready}}>
      {children}
    </UserContext.Provider>
  );
}
