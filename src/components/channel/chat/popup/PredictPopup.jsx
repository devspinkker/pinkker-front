import React, {useState, useEffect} from "react"

import "./PredictPopup.css"

import { useSelector } from 'react-redux'

import { useNotification } from "../../../Notifications/NotificationProvider";

import { ScaleLoader } from "react-spinners"
import { createBet, finishBet, restoreBet } from "../../../../services/bet";

export default function PredictPopup({ finishBetGeneral, bets, getType,  closePopup, reloadBets, streamer }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const [title, setTitle] = useState(null);
    const [resultOne, setResultOne] = useState(null);
    const [resultTwo, setResultTwo] = useState(null);
    const [minParticipate, setMinParticipate] = useState(1);


    const [file, setFile] = useState(null);

    const alert = useNotification();

    const [loading, setLoading] = useState(false)

    const [typeWin, setTypeWin] = useState(0);

    async function handleSubmitRestore() {
        const data = await restoreBet(token)
        if(data != null && data != undefined && data.status == 200) {
            alert({type: "SUCCESS", message: data.data.msg});
            reloadBets();
            closePopup();
        } else {
            alert({type: "ERROR", message: data.data.msg});
        }
    }

    async function handleSubmitResult() {
        const data = await finishBet(token, streamer, typeWin)
        if(data != null && data != undefined && data.status == 200) {
            //alert({type: "SUCCESS", message: data.data.msg});
            reloadBets();
            finishBetGeneral(typeWin);
            closePopup();
        } else {
            alert({type: "ERROR", message: data.data.msg});
        }
    }

    async function handleSubmit() {
        const data = await createBet(token, streamer, title, resultOne, resultTwo, minParticipate)
        if(data != null && data != undefined && data.status == 200) {
            alert({type: "SUCCESS", message: data.data.msg});
            reloadBets();
            closePopup();
        } else {
            alert({type: "ERROR", message: data.data.msg});
        }
    }

    function getType() {
        if(bets != null && bets != undefined) {
            return (
                <div style={{textAlign: "left", width: "25%", borderRadius: "5px", zIndex: "9999", height: "350px"}} className={'predictpopup-popup-container'}>
                    <div className="usersettings-popup-close">
                         <button onClick={closePopup}><i className="fas fa-times" /></button>
                    </div>

                    <div>
                        <h2 style={{fontSize: "19px"}}>Elegir resultado</h2>
                        <p style={{color: "darkgray", fontSize: "13px", marginTop: "5px"}}>Selecciona el resultado y recompensa a los espectadores que votaron por él con puntos de canal.</p>

                        
                        <h3 style={{fontSize: "19px", marginTop: "30px"}}>{bets.title}</h3>

                        <div onClick={() => setTypeWin(0)} className="predictpopup-popup-result-card" style={{backgroundColor: typeWin === 0 && "#151515", border: typeWin === 0 && "2px solid white", display: "flex", alignItems: "center", marginTop: "15px"}}>
                            <p style={{width: "15px", marginRight: "10px", height: "15px", fontSize: "13px", backgroundColor: "#8b1919", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>1</p>
                            <p>{bets.resultOne}</p>
                        </div>

                        <div onClick={() => setTypeWin(1)} className="predictpopup-popup-result-card" style={{backgroundColor: typeWin === 1 && "#151515", border: typeWin === 1 && "2px solid white", display: "flex", alignItems: "center", marginTop: "15px"}}>
                            <p style={{width: "15px", marginRight: "10px", height: "15px", fontSize: "13px", backgroundColor: "#19198b", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>2</p>
                            <p>{bets.resultTwo}</p>
                        </div>
                    </div>


                    <div className="predictpoup-popup-result-button-container">
                        <button onClick={() => handleSubmitRestore()} style={{backgroundColor: "#303030", border: "none", marginRight: "10px"}} className="predictpoup-popup-result-button">Devolver pixeles</button>
                        <button onClick={() => handleSubmitResult()} className="predictpoup-popup-result-button">Completar apuesta</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div style={{textAlign: "left", width: "25%", borderRadius: "5px", zIndex: "9999"}} className={'predictpopup-popup-container'}>
                    {loading === false ? <div>
                        <div className="usersettings-popup-close">
                            <button onClick={closePopup}><i className="fas fa-times" /></button>
                        </div>

                        <h2 style={{fontSize: "19px"}}>Iniciar una apuesta</h2>
                        <p style={{color: "darkgray", fontSize: "13px", marginTop: "5px"}}>Los streamers pueden crear predicciones. Los espectadores que adivinen el resultado podrán ganar pixeles. Todas las predicciones tienen que cumplir con nuestros Términos del servicio.</p>

                        <div style={{marginTop: "50px"}}>
                            <p style={{fontWeight: "800", marginTop: "20px"}}>Nombre de la apuesta</p>
                            <input placeholder="Titulo de la apuesta, ejemplo: ¿Voy a ganar?" onChange={(e) => setTitle(e.target.value)} className="predictpopup-input" type="text" />
                        </div>

                        <div style={{marginTop: "50px"}}>
                            <p style={{fontWeight: "800", marginTop: "20px"}}>Resultados posibles</p>
                            <p style={{color: "darkgray", fontSize: "13px", marginTop: "5px"}}>Los participantes del chat recibirán un emblema de chat temporal con la opción votada hasta que finalice la apuesta.</p>
                            <div style={{display: "flex", alignItems: "center", marginTop: "10px"}}>
                                <p style={{width: "15px", marginRight: "10px", height: "15px", fontSize: "13px", backgroundColor: "#8b1919", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>1</p>
                                <input placeholder="Resultado 1, ejemplo: Si" onChange={(e) => setResultOne(e.target.value)} className="predictpopup-input" type="text" />
                            </div>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <p style={{width: "15px", marginRight: "10px", height: "15px", fontSize: "13px", backgroundColor: "#19198b", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>2</p>
                                <input placeholder="Resultado 2, ejemplo: No" onChange={(e) => setResultTwo(e.target.value)} className="predictpopup-input" type="text" />
                            </div>
                        </div>
                        
                        <div style={{marginTop: "50px"}}>
                            <p style={{fontWeight: "800", marginTop: "20px"}}>Periodo de participación</p>
                            <select onChange={(e) => setMinParticipate(e.target.value)} className="predictpopup-input" defaultValue="0">
                                <option value={1}>1m</option>
                                <option value={2}>2m</option>
                                <option value={3}>3m</option>
                                <option value={4}>4m</option>
                                <option value={5}>5m</option>
                            </select>
                        </div>
                    
                        <div style={{display: "flex", justifyContent: "right", marginTop: "50px"}}>
                            <button onClick={() => handleSubmit()} className="predictpopup-button">Iniciar apuesta</button>
                        </div>
                        
                    </div> : <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "400px"}}> <div style={{textAlign: "center"}}><h3 style={{marginBottom: "10px"}}>Subiendo la imagen... espera porfavor</h3><ScaleLoader color="#f36197d7" /></div> </div>}
                </div>
            )
        }
    }

    return (
        <div style={{zIndex: "9999"}} className='predictpopup-popup-body'>
            {getType()}
            
        </div>
    )

}