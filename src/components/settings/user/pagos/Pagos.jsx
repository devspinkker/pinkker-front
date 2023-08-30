import React, {useState, useEffect} from "react"


import "./Pagos.css"

import { updateSubscriptionPrice } from "../../../../services/user"
import { useSelector } from "react-redux"
import { useNotification } from "../../../Notifications/NotificationProvider"

export default function Pagos() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [amount, setAmount] = useState(0)
    const alert = useNotification()


    async function updateAmount() {
        const data = await updateSubscriptionPrice(token, amount);
        if(data != null && data != undefined) {
            setAmount(0);
            alert({type: "SUCCESS", message: data.data.msg})
        }
    }
    

    return (
        <div className="usersettings-pagos-body">
            <div className="usersettings-pagos-container">
                <h2><a style={{fontFamily: "Poppins"}}> <img style={{width: "98px", position: "relative", top: "4px"}} src="/images/logo.png" alt="Pinkker Logo" /> PIXELES <img style={{ width: "20px"}} src="/images/pixel.png" /></a> </h2>
                <p style={{lineHeight: "18px", marginTop: "5px", color: "lightgray", fontSize: "16px", fontWeight: "600"}}>Selecciona el precio en pixeles de tus subscripciones en Pinkker!</p>

                <div className="usersettings-pagos-card-container">
                    <div className="usersettings-pagos-card">
                        <h3 style={{fontSize: "16px"}}>Subscripción</h3>
                        <div>
                            <input onChange={(e) => setAmount(e.target.value)} value={amount}  min={500} max={1500} className="usersettings-pagos-input" type="Number" />
                            <p style={{fontWeight: "600", display: "flex", alignItems: "center", fontSize: "12px",height: "0px", marginTop: "10px"}}>Precio actual: 1000 <img style={{marginLeft: "5px", width: "15px"}} src="/images/pixel.png"/></p>
                        </div>

                        <button onClick={() => updateAmount()} className="usersettings-pagos-button pink-button" >Actualizar</button>
                    </div>

                    <p style={{lineHeight: "18px", marginTop: "25px", color: "#ededed", fontSize: "16px",  display: "flex", alignItems: "center", fontWeight: "600"}}>Minimo 500 <img style={{width: "15px", marginLeft: "5px", marginRight: "20px"}} src="/images/pixel.png"/> Maximo 1500 <img style={{width: "15px", marginLeft: "5px"}} src="/images/pixel.png"/></p>


                    <div style={{marginTop: "10px"}} className="usersettings-pagos-card">
                        <h3 style={{fontSize: "16px"}}>Subscripción Nivel 2</h3>
                        <div>
                            <input onChange={(e) => setAmount(e.target.value)}  min={500} max={1500} className="usersettings-pagos-input" type="Number" />
                            <p style={{fontWeight: "600", display: "flex", alignItems: "center", fontSize: "12px",height: "0px", marginTop: "10px"}}>Precio actual: 1500 <img style={{marginLeft: "5px", width: "15px"}} src="/images/pixel.png"/></p>
                        </div>

                        <button className="usersettings-pagos-button pink-button" >Actualizar</button>
                    </div>

                    <p style={{lineHeight: "18px", marginTop: "25px", color: "#ededed", fontSize: "16px",  display: "flex", alignItems: "center", fontWeight: "600"}}>Minimo 1000 <img style={{width: "15px", marginLeft: "5px", marginRight: "20px"}} src="/images/pixel.png"/> Maximo 1500 <img style={{width: "15px", marginLeft: "5px"}} src="/images/pixel.png"/></p>

                </div>


                <div style={{marginTop: "50px"}}>
                    <h3 style={{display: "flex", alignItems: "center"}}>Estimado cuanto obtendras por subcripción {amount * 0.7} <img style={{width: "20px", marginLeft: "5px"}} src="/images/pixel.png" /></h3>
                </div>
                
                
            </div>

        </div>
    )
}