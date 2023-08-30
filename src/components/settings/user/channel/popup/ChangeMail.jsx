import React, {useState, useEffect} from "react"

import "./ChangeMail.css"

import { useNotification } from "../../../../Notifications/NotificationProvider"


export default function ChangeMail({closePopup, reload }) {

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
                        <p style={{fontWeight: "800"}}>Codigo de verificación</p>
                        <p style={{fontSize: "12px", color: "#f36196", marginBottom: "5px", cursor: "pointer"}}>Toca aquí para enviar codigo de verificación</p>
                        <input onChange={(e) => setNombre(e.target.value)} type="text" />
                    </div>
    
                    <div className="createnegocio-content-input">
                        <p style={{fontWeight: "800", marginBottom: "5px"}}>Nuevo email</p>
                        <input onChange={(e) => setMail(e.target.value)} type="text" />
                    </div>
    
                    <div className="createnegocio-content-input">
                        <p style={{fontWeight: "800", marginBottom: "5px"}}>Confirmar nuevo email</p>
                        <input onChange={(e) => setInstagram(e.target.value)} type="text" />
                    </div>


                    <div style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                        <button onClick={() => handleSubmit()} className="createnegocio-button-login">Cambiar</button>
                    </div>
                    
                </div>
            )
        }
    }




    return (
        <div className="createnegocio-body">
            <div style={{height: "365px", borderRadius: "5px"}} className={'createnegocio-primary'}>

                <div style={{width: "100%", position: "relative", right: "0", height: "0px", top: "10px"}} className="auth-close">
                    <button className="pinkker-button-more" onClick={closePopup}><i style={{fontSize: isMobile && "20px"}} class="fas fa-times"/></button>
                </div>

                <h3 style={{color: "white", marginBottom: "30px", display: "flex", alignItems: "center"}}> <img style={{width: "50px", marginRight: "10px"}} src="/images/pinkker.png" alt="" /> Cambiar Mail</h3>
                
                {getType()}

            </div>

        </div>
    ) 
  
}