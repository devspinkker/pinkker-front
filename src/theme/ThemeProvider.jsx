import { useState, useEffect } from "react";
import { createContext } from "react";

export const ThemeContext = createContext()

export default function ThemeProvider( {children} ) {

    const [theme, setTheme] = useState("dark");

    const contextValue = { 
        theme,
        setTheme,
        changeTheme
    }


    useEffect(() => {
        const localTheme = localStorage.getItem("theme");
        if(localTheme) {
            setTheme(localTheme);
        }
    }, [])

    function changeTheme(data) {
        setTheme(data);
        localStorage.setItem("theme", data);
    }

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    )
}