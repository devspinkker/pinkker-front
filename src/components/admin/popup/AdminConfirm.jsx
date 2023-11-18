import React, {useEffect} from "react"

import "./AdminConfirm.css"

import { useSelector } from "react-redux"

import { updateServer } from "../../../services/server"

import { useNotification } from "../../Notifications/NotificationProvider"

export default function AdminConfirm({register, login, settings, chat, purchase, directMessage, notifications, upload, muro, tendency, historyUsers, withdraw, bets, donations, closePopup, reloadData}) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const alert = useNotification();


    async function handleSubmit() {
        const data = await updateServer(token, register, login, settings, chat, purchase, directMessage, notifications, upload, muro, tendency, historyUsers, withdraw, bets, donations)
        if(data != null && data != undefined) {
            reloadData()
            closePopup()
            alert({ type: "SUCCESS", message: data.data.msg})
        }
    }

    return (
        <div className='admin-popup-body'>
            <div className='admin-popup-container'>

                <div style={{padding: "30px"}}>
                    <div className="admin-popup-close">
                        <button className="admin-popup-button-close pinkker-button-more" onClick={closePopup}><i class="fas fa-times"/></button>
                    </div>

                    <div style={{textAlign: "center", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "250px"}}>
                        <div>
                            <h1 style={{color: "white"}}>Estas seguro?</h1>
                            <div>
                                <button onClick={() => handleSubmit()} style={{marginRight: "5px"}} className="admin-popup-confirm-button">Confirmar</button>
                                <button onClick={closePopup} className="admin-popup-confirm-button">Cerrar</button>
                            </div>
                        </div>
                        
                    </div>
                   
                </div>
            </div>
        </div>
    )

}