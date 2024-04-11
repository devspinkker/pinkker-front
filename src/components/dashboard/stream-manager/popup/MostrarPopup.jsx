import React, {useState, useEffect} from "react"

import "./MostrarPopup.css"

import { useSelector } from 'react-redux'


import { useNotification } from "../../../Notifications/NotificationProvider"
import { ScaleLoader } from "react-spinners"


export default function MostrarPopup({ closePopup, mostrar }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const alert = useNotification()


    return (
        <div className='mostrarpopup-popup-body'>
            
            <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
                
                <div className={'mostrarpopup-popup-container'}>

                    <div className="usersettings-popup-close">
                        <button onClick={closePopup}><i style={{fontSize: "24px"}} className="fas fa-times" /></button>
                    </div>

                   
                    <div style={{marginTop: "20px", color: "#ededed"}}>
                        <h2>Estas seguro que queres mostrar?</h2>
                    </div>

                    <div style={{display: "flex", alignItems: "center", marginTop: "30px", justifyContent: "center"}}>
                        <button onClick={() => mostrar()} className="mostrarpopup-popup-button">Aceptar</button>
                    </div>

                </div>
            </div>
      </div>
    )

}