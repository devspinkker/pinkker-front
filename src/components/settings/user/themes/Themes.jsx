import React, {useState} from "react"

import "./Themes.css"
import { useSelector } from 'react-redux'

import useTheme from "../../../../theme/useTheme"


export default function Themes() {


    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const theme = useTheme();


    return (
        <div className="userthemes-body">
            <h2>Ajuste de tema</h2>
            <p style={{color: "darkgray", marginBottom: "5px"}}>Cambia el tema de visualización de tu cuenta.</p>

            <div className="userthemes-container">

               <div className={theme.theme === "dark" ? "userthemes-content userthemes-active" : "userthemes-content"}>
                   <button onClick={() => theme.changeTheme("dark")} style={{backgroundColor: "#0A0B0D", color: "#ededed"}}>{theme.theme === "dark" && <i style={{color: "#ff60b2"}} class="fas fa-check-circle"/>} Dark</button>
               </div> 
               <div className={theme.theme === "light" ? "userthemes-content userthemes-active" : "userthemes-content"}>
                   <button onClick={() => theme.changeTheme("light")}>{theme.theme === "light" && <i style={{color: "#ff60b2"}} class="fas fa-check-circle"/>} Light</button>
               </div>
               <div className={theme.theme === "blue" ? "userthemes-content userthemes-active" : "userthemes-content"}>
                   <button onClick={() => theme.changeTheme("blue")} style={{backgroundColor: "#192734", color: "#ededed"}}>{theme.theme === "blue" && <i style={{color: "#ff60b2"}} class="fas fa-check-circle"/>} Blue</button>
               </div>
            </div>
            

        </div>
    )
}