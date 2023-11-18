import React, {useState} from "react";

import "./ChannelSettings.css"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import ChangeMail from "./popup/ChangeMail";
import ChangePhone from "./popup/ChangePhone";
import ChangePassword from "./popup/ChangePassword";

import { useSelector } from "react-redux";

export default function ChannelSettings() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [viewMail, setViewMail] = useState(false);
    const [viewPhone, setViewPhone] = useState(false);
    
    const [popupChangeMail, setPopupChangeMail] = useState(false)
    const [popupChangePhone, setPopupChangePhone] = useState(false)
    const [popupChangePassword, setPopupChangePassword] = useState(false)


    return (
        <div className="usersettings-channel-body">
            <div className="usersettings-channel-container">
               <div className="usersettings-channel-card">
                    <h3>Contacto</h3>
                    <p style={{marginTop: "10px", marginBottom: "20px"}}>Dónde enviamos los mensajes importantes acerca de tu cuenta</p>

                    <div className="usersettings-channel-card-content">
                        <div className="usersettings-channel-card-content-card">
                            <div className="usersettings-channel-card-content-card-title">
                                <p style={{fontWeight: "800"}}>Correo electronico</p>
                            </div>
                            <div className="usersettings-channel-card-content-card-text">
                                <h3 style={{fontSize: "15px"}}>{viewMail ? user.email : "********"}</h3>
                                <p style={{fontSize: "13px"}}>Verificado. Gracias por verificar tu correo electrónico.</p>
                                <p style={{color: "darkgray", fontSize: "13px"}}>Este correo electrónico está vinculado a tu cuenta.</p>

                            </div>

                            <div className="usersettings-channel-card-content-card-edit">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Ver correo</h1>}>
                                    <button onClick={() => setViewMail(!viewMail)} className="channel-bottom-v2-button-icon"><i class="fas fa-eye"/></button>
                                </Tippy>

                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Editar</h1>}>
                                    <button onClick={() => setPopupChangeMail(true)} className="channel-bottom-v2-button-icon"><i class="fas fa-edit"/></button>
                                </Tippy>
                            </div>
                        </div>

                        <div className="usersettings-channel-card-content-card">
                            <div className="usersettings-channel-card-content-card-title">
                                <p style={{fontWeight: "800"}}>Número de teléfono</p>
                            </div>
                            <div className="usersettings-channel-card-content-card-text">
                                <h3 style={{fontSize: "15px"}}>{viewPhone ? user.phone : "********"}</h3>
                                <p style={{color: "darkgray", fontSize: "13px"}}>Este número de teléfono está vinculado a tu cuenta.</p>
                            </div>

                            <div className="usersettings-channel-card-content-card-edit">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Ver correo</h1>}>
                                    <button onClick={() => setViewPhone(!viewPhone)} className="channel-bottom-v2-button-icon"><i class="fas fa-eye"/></button>
                                </Tippy>

                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Editar</h1>}>
                                    <button onClick={() => setPopupChangePhone(true)} className="channel-bottom-v2-button-icon"><i class="fas fa-edit"/></button>
                                </Tippy>
                            </div>
                        </div>
                    </div>
               </div>

               <div style={{marginTop: "50px"}} className="usersettings-channel-card">
                    <h3>Seguridad</h3>
                    <p style={{marginTop: "10px", marginBottom: "20px"}}>Mantén tu cuenta segura</p>

                    <div className="usersettings-channel-card-content">
                        <div className="usersettings-channel-card-content-card">
                            <div className="usersettings-channel-card-content-card-title">
                                <p style={{fontWeight: "800"}}>Contraseña</p>
                            </div>
                            <div className="usersettings-channel-card-content-card-text">
                                <p style={{fontWeight: "800"}}><a onClick={() => setPopupChangePassword(true)} style={{color: "#f36196", cursor: "pointer"}}>Cambiar contraseña</a>. Mejora la seguridad con una contraseña segura.</p>
                            </div>
                        </div>

                        <div className="usersettings-channel-card-content-card">
                            <div className="usersettings-channel-card-content-card-title">
                                <p style={{fontWeight: "800"}}>Autenticación en dos pasos</p>
                            </div>
                            <div className="usersettings-channel-card-content-card-text">
                                <button style={{marginTop: "0px", marginBottom: "5px"}} className="usersettings-prime-button pink-button">Editar autenticación de dos pasos</button>
                                <p style={{color: "darkgray"}}>Añade una capa extra de protección a tu cuenta de Twitch con tu contraseña y un código que recibirás en tu teléfono para iniciar sesión.</p>
                            </div>

                            
                        </div>
                    </div>
               </div>
            </div>

            {popupChangeMail && <ChangeMail closePopup={() => setPopupChangeMail(false)} />}
            {popupChangePhone && <ChangePhone closePopup={() => setPopupChangePhone(false)} />}
            {popupChangePassword && <ChangePassword closePopup={() => setPopupChangePassword(false)} />}

        </div>
    )
}