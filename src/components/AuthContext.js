import React, { createContext, useState, useEffect } from 'react';
import { getUserByIdTheToken } from "../services/backGo/user";

const AuthContext = createContext();
// Creamos un componente que proveerá el contexto de autenticación a los componentes hijos
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    

    
        useEffect(() => {
            async function getUser() {
              let token = window.localStorage.getItem("token");
              let res = await getUserByIdTheToken(token);
              if (res.message == "ok") {
                setUser(res.data);
              }
            }
            getUser();
          }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
