import React, {useState, useEffect} from "react"

import "./ChangeMail.css"

import { useNotification } from "../../../../Notifications/NotificationProvider"


export default function ChangePhone({closePopup, reload }) {

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
                        <p>Codigo de verificación</p>
                        <p style={{fontSize: "12px", color: "#f36196"}}>Enviar codigo de verificación</p>
                        <input onChange={(e) => setNombre(e.target.value)} type="text" />
                    </div>
    
                    <div className="createnegocio-content-input">
                        <p>Nuevo número de celular</p>
                        <input onChange={(e) => setMail(e.target.value)} type="text" />
                    </div>
    
                    <div className="createnegocio-content-input">
                        <p>Confirmar nuevo número de celular</p>
                        <input onChange={(e) => setInstagram(e.target.value)} type="text" />
                    </div>

    
                    <button onClick={() => handleSubmit()} className="createnegocio-button-login">Cambiar</button>
    
                </div>
            )
        }

    }




    return (
        <div className="createnegocio-body">
            <div style={{height: "375px", borderRadius: "5px"}} className={'createnegocio-primary'}>

                <div style={{width: "100%", position: "relative", right: "0", height: "0px", top: "10px"}} className="auth-close">
                    <button className="pinkker-button-more" onClick={closePopup}><i style={{fontSize: isMobile && "20px"}} class="fas fa-times"/></button>
                </div>

                <h3 style={{color: "white", marginBottom: "30px", display: "flex", alignItems: "center"}}>Cambiar Número de Celular</h3>
                
                {getType()}

            </div>

        </div>
    ) 
  
}