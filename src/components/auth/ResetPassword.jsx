import React, { useState } from 'react'
import "./ResetPassword.css"


import axios from 'axios'
import {useParams} from 'react-router-dom'
import { isLength, isMatch } from "../../utils/validation/Validation"

import { useNotification } from '../Notifications/NotificationProvider'

function ResetPassword({isMobile}) {

    const { token } = useParams()
    const[rPassword, setrPassword] = useState(null);
    const[rConfirmPassword, setrConfirmPassword] = useState(null);

    const alert = useNotification()

    const handleResetPass = async () => {
        if(isLength(rPassword)) return alert({type: "ERROR", message: "Password must be at least 6 characters."})
        if(!isMatch(rPassword, rConfirmPassword)) return alert({type: "ERROR", message: "Password did not match."})

        try {
            const res = await axios.post(process.env.REACT_APP_DEV_API_URL + '/user/reset', {password: rPassword}, {
                headers: {Authorization: token}
            })

            window.location.href = "/?reset=true";
            alert({type: "SUCCESS", message: res.data.msg})

           
        } catch (err) {
            err.response.data.msg && alert({type: "ERROR", message: err.response.data.msg})
        }
    }


    return (
        <div className="resetpassword-body">
            <div style={{height: "50px"}}/>
            <div className='resetpassword-container'>
                <div className="resetpassword-title">
                    <h2 style={{color: "#ededed"}}>Cambiar Contraseña</h2>
                </div>

                <div className="resetpassword-card-container">
                    <div className="biography-content">
                        <div style={{width: "20%", textAlign: "left", marginLeft: "20px"}}>
                            <h4>Contraseña</h4>
                        </div>
                        <div className="biography-input">
                            <input type="password" name="password" id="password" value={rPassword} onChange={(e) => setrPassword(e.target.value)} />
                            <p style={{fontSize: "13px", color: "darkgray"}}>Introduce tu nueva contraseña.</p>
                        </div>
                    </div>
                    <hr style={{border: "1px solid #2b2b2b8f"}}/>
                    <div className="biography-content">
                        <div style={{width: "20%", textAlign: "left", marginLeft: "20px"}}>
                            <h4>Confirmar Contraseña</h4>
                        </div>
                        <div className="biography-input">
                            <input type="password" name="cf_password" id="cf_password" value={rConfirmPassword} onChange={(e) => setrConfirmPassword(e.target.value)} />
                            <p style={{fontSize: "13px", color: "darkgray"}}>Vuelve a introducir tu nueva contraseña.</p>
                        </div>
                    </div>
                    
                    <div style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                        <button className='resetpassword-button' onClick={() => handleResetPass()}>Cambiar Contraseña</button>
                    
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default ResetPassword