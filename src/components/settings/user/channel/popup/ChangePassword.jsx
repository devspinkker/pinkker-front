import React, {useState, useEffect} from "react"

import "./ChangeMail.css"

import { useNotification } from "../../../../Notifications/NotificationProvider"


export default function ChangePassword({closePopup, reload }) {

    const alert = useNotification();

    const [type, setType] = useState(0)
    const [code, setCode] = useState(null)

    const [nombre, setNombre] = useState(null)
    const [mail, setMail] = useState(null)
    const [instagram, setInstagram] = useState("")
    const [cel, setCel] = useState("")

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 1000;

    async function handleSubmit() {
        

    }

    function getType() {

        if(type === 0) {
            return (
                <div className="createnegocio-content">
    
                    <div className="createnegocio-content-input">
                        <p>Tu contraseña</p>
                        <input onChange={(e) => setNombre(e.target.value)} type="text" />
                    </div>
    
                    <div className="createnegocio-content-input">
                        <p>Nueva contraseña</p>
                        <input onChange={(e) => setMail(e.target.value)} type="text" />
                    </div>
    
                    <div className="createnegocio-content-input">
                        <p>Confirmar nueva contraseña</p>
                        <input onChange={(e) => setInstagram(e.target.value)} type="text" />
                    </div>

    
                    <button onClick={() => handleSubmit()} className="createnegocio-button-login">Cambiar</button>
    
                </div>
            )
        }

        if(type === 1) {
            return (
                <div style={{textAlign: "center"}} className="createnegocio-content">
    
                   
                    <h3 style={{fontFamily: "Poppins", marginBottom: "10px", color: "yellow", fontSize: "15px"}}>Perfecto! Ya enviamos tu QR a tu mail.</h3>
                    <p style={{fontFamily: "Poppins", marginBottom: "70px", color: "white", fontSize: "14px"}}>Revisa tu casilla de spam</p>

                    <h3 style={{fontFamily: "Poppins", marginBottom: "10px", color: "white", fontSize: "15px"}}>Av Juramento 1543. Black Club</h3>
                    <h3 style={{fontFamily: "Poppins", marginBottom: "10px", color: "white", fontSize: "15px"}}>Hora de Ingreso, 00:00 AM</h3>
                    <h3 style={{fontFamily: "Poppins", marginBottom: "10px", color: "lightgreen", fontSize: "15px"}}>Hora de Ingreso Hombres hasta, 01:30 AM</h3>
                    <h3 style={{fontFamily: "Poppins", marginBottom: "10px", color: "lightgreen", fontSize: "15px"}}>Hora de Ingreso Mujeres hasta, 02:00 AM</h3>

                    <h3 style={{fontFamily: "Poppins", marginBottom: "10px", color: "white", fontSize: "15px"}}>No olvides subir la historia del Flyer!</h3>

                </div>
            )
        }

        
    }




    return (
        <div className="createnegocio-body">
            <div style={{height: "475px", borderRadius: "5px"}} className={'createnegocio-primary'}>

                <div className="auth-close">
                    <button className="pinkker-button-more" onClick={closePopup}><i class="fas fa-times"/></button>
                </div>
                <h3 style={{color: "white", marginBottom: "30px", display: "flex", alignItems: "center"}}> <img style={{width: "50px", marginRight: "10px"}} src="/images/pinkker.png" alt="" /> Cambiar Contraseña</h3>
                
                {getType()}

            </div>

        </div>
    ) 
  
}