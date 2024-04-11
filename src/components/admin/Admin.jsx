import React, {useState, useEffect} from "react"

import "./Admin.css"

import {useDispatch, useSelector} from 'react-redux'

import AdminConfirm from "./popup/AdminConfirm"

import { fetchServerInfo, dispatchGetServerInfo } from "../../redux/actions/serverAction";

import {Link} from "react-router-dom"


export default function Admin() {

    const dispatch = useDispatch()


    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)
    const server = useSelector(state => state.server)

    const [popupConfirm, setPopupConfirm] = useState(false)

    const [register, setRegister] = useState(false)
    const [login, setLogin] = useState(false)
    const [settings, setSettings] = useState(false)
    const [chat, setChat] = useState(false)
    const [purchase, setPurchase] = useState(false)
    const [directMessage, setDirectMessage] = useState(false)
    const [notifications, setNotifications] = useState(false)
    const [upload, setUpload] = useState(false)
    const [muro, setMuro] = useState(false)
    const [tendency, setTendency] = useState(false)
    const [historyUsers, setHistoryUsers] = useState(false)
    const [withdraw, setWithdraw] = useState(false)
    const [bets, setBets] = useState(false)
    const [donations, setDonations] = useState(false)

    useEffect(() => {
        if(server.register != null) {
            setRegister(server.register)
            setLogin(server.login)
            setSettings(server.settings)
            setChat(server.chat)
            setPurchase(server.purchase)
            setDirectMessage(server.directMessage)
            setNotifications(server.notifications)
            setUpload(server.upload)
            setMuro(server.muro)
            setTendency(server.tendency)
            setHistoryUsers(server.historyUsers)
            setWithdraw(server.withdraw)
            setBets(server.bets)
            setDonations(server.donations)

        }
        
    }, [server, token])

    function togglePopupConfirm(type) {
        if(type === 0) {
            setRegister(!register)
            setPopupConfirm(true)
        }
        if(type === 1) {
            setLogin(!login)
            setPopupConfirm(true)
        }
        if(type === 2) {
            setSettings(!settings)
            setPopupConfirm(true)
        }
        if(type === 3) {
            setChat(!chat)
            setPopupConfirm(true)
        }
        if(type === 4) {
            setPurchase(!purchase)
            setPopupConfirm(true)
        }
        if(type === 5) {
            setDirectMessage(!directMessage)
            setPopupConfirm(true)
        }
        if(type === 6) {
            setNotifications(!notifications)
            setPopupConfirm(true)
        }
        if(type === 7) {
            setUpload(!upload)
            setPopupConfirm(true)
        }
        if(type === 8) {
            setMuro(!muro)
            setPopupConfirm(true)
        }
        if(type === 9) {
            setTendency(!tendency)
            setPopupConfirm(true)
        }
        if(type === 10) {
            setHistoryUsers(!historyUsers)
            setPopupConfirm(true)
        }
        if(type === 11) {
            setWithdraw(!withdraw)
            setPopupConfirm(true)
        }
        if(type === 12) {
            setBets(!bets)
            setPopupConfirm(true)
        }
        if(type === 13) {
            setDonations(!donations)
            setPopupConfirm(true)
        }
    }
    
    function reloadData() {
        const getUser = () => {
            return fetchServerInfo(token).then(res => {
              dispatch(dispatchGetServerInfo(res))
            })
          }
          getUser()
    }


    function getStatus(status) {
        if(status === true) {
            return "ACTIVADO"
        } else {
            return "DESACTIVADO"
        }
        
        return "NO DISPONIBLE"
    }

    function getServerInfo() {
        if(server.register != null) {
            return (
                <div className="admin-card-container">
                    <div onClick={() => togglePopupConfirm(0)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Registro</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el registro en pinkker</p>
                            <h3 style={{color: server.register ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.register)}</h3>
                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(1)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Inicio de Sesión</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el inicio de sesión</p>
                            <h3 style={{color: server.login ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.login)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(2)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Ajustes de Cuenta</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el ajuste de cuenta</p>
                            <h3 style={{color: server.settings ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.settings)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(3)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Chat</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el chat</p>
                            <h3 style={{color: server.chat ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.chat)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(4)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Compra Pixeles</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar la compra y venta de pixeles</p>
                            <h3 style={{color: server.purchase ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.purchase)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(5)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Mensajes directos</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el chat</p>
                            <h3 style={{color: server.directMessage ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.directMessage)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(6)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Notificaciones</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el chat</p>
                            <h3 style={{color: server.notifications ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.notifications)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(7)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Upload</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el upload</p>
                            <h3 style={{color: server.upload ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.upload)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(8)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Muro</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el muro</p>
                            <h3 style={{color: server.muro ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.muro)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(9)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Tendencias</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el tendency</p>
                            <h3 style={{color: server.tendency ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.tendency)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(10)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>History Users</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el historyUsers</p>
                            <h3 style={{color: server.historyUsers ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.historyUsers)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(11)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Withdraw</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el withdraw</p>
                            <h3 style={{color: server.withdraw ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.withdraw)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(12)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Bets</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el bets</p>
                            <h3 style={{color: server.bets ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.bets)}</h3>

                        </div>
                    </div>

                    <div onClick={() => togglePopupConfirm(13)} className="admin-card">
                        <div style={{position: "relative", top: "-10px"}}>
                            <h2>Donaciones</h2>
                            <p style={{color: "lightgray", marginTop: "10px", fontSize: "13px"}}>Activar o desactivar el donations</p>
                            <h3 style={{color: server.donations ? "#71ff71" : "red", marginTop: "15px"}}>{getStatus(server.donations)}</h3>

                        </div>
                    </div>



                    {popupConfirm && 
                    <AdminConfirm 
                        reloadData={() => reloadData()} 
                        register={register} 
                        login={login} 
                        settings={settings} 
                        chat={chat} 
                        purchase={purchase} 
                        directMessage={directMessage} 
                        notifications={notifications} 
                        upload={upload}
                        muro={muro}
                        tendency={tendency}
                        historyUsers={historyUsers}
                        withdraw={withdraw}
                        bets={bets}
                        donations={donations}
                        closePopup={() => setPopupConfirm(false)} />
                        }

                </div>
            )
        }
    }


    return (
        <div className="admin-body">
            {user && user.role === 1 && <div className="admin-container">
                <div className="admin-title">
                    <h2>Administrar Pinkker</h2>
                </div>

                {getServerInfo()}

                <div style={{marginTop: "20px"}}>
                    <Link to="/admin/pagos"><button className="admin-pinkker-button">Pagos</button></Link>
                    <Link to="/admin/statistics"><button className="admin-pinkker-button">Estadisticas</button></Link>
                    
                </div>
                
            </div>}
        </div>
    )
}