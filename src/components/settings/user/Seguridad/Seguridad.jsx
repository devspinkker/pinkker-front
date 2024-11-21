import React, { useEffect, useState } from 'react'
import {
    generateTotpKey,
    validateTotpCode,
    ChangeGoogleAuthenticator,
    DeleteGoogleAuthenticator,
} from "../../../../services/backGo/totpService";
import ResetPassword from '../../../auth/ResetPassword';
// import { isLength, isMatch } from "../../../utils/validation/Validation"
import axios from 'axios'
import { useNotification } from '../../../Notifications/NotificationProvider';
import { isLength, isMatch } from '../../../../utils/validation/Validation';
import { useSelector } from 'react-redux';

function Seguridad(props) {
  
    const auth = useSelector((state) => state.auth);
    const { user } = auth;

    let token = window.localStorage.getItem("token");
    let GoogleAuthenticator = window.localStorage.getItem("GoogleAuthenticator");
    useEffect(() => {
        if (GoogleAuthenticator === "ok") {
            setShowChangeTotp(true);
        }
    }, [GoogleAuthenticator]);
    const [totpCode, setTotpCode] = useState("");
    const [totpSecret, setTotpSecret] = useState(null);
    const [showTotpModal, setShowTotpModal] = useState(false);
    const [showChangeTotp, setShowChangeTotp] = useState(false);
    const [isTotpValid, setIsTotpValid] = useState(false); // Estado para la validez del código TOTP
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [rPassword, setrPassword] = useState(null);
    const [rConfirmPassword, setrConfirmPassword] = useState(null);
    const alert = useNotification()

    const handleResetPass = async () => {
        if (isLength(rPassword)) return alert({ type: "ERROR", message: "Password must be at least 6 characters." })
        if (!isMatch(rPassword, rConfirmPassword)) return alert({ type: "ERROR", message: "Password did not match." })

        try {
            const res = await axios.post(process.env.REACT_APP_DEV_API_URL + '/user/reset', { password: rPassword }, {
                headers: { Authorization: token }
            })

            window.location.href = "/?reset=true";
            alert({ type: "SUCCESS", message: res.data.msg })


        } catch (err) {
            err.response.data.msg && alert({ type: "ERROR", message: err.response.data.msg })
        }
    }


    async function handleGenerateTotp() {
        const result = await generateTotpKey(token);

        if (result.message === "StatusOK") {
            setTotpSecret(result.secret);
            setShowTotpModal(true);
            window.localStorage.setItem("GoogleAuthenticator", "ok");
        } else {
            alert({ type: "ERROR", message: result.message });
        }
    }

    async function handleValidateTotp() {
        const result = await validateTotpCode(token, totpCode);
        if (result.message === "StatusOK") {
            setIsTotpValid(true);
            alert({ type: "SUCCESS" });
            setShowTotpModal(false);
        } else {
            setIsTotpValid(false);
            alert({ type: "ERROR", message: "Código TOTP inválido." });
        }
    }

    async function handleChangeTotp() {
        const result = await ChangeGoogleAuthenticator(token);
        if (result && result.message === "StatusOK") {
            setShowEmailModal(true);
        } else {
            alert({ type: "ERROR", message: result.message });
        }
    }

    async function handleDeleteTotp() {
        const result = await DeleteGoogleAuthenticator(token, totpCode);
        if (result.message === "StatusOK") {
            alert({ type: "SUCCESS", message: "Google Authenticator eliminado" });
            window.localStorage.removeItem("GoogleAuthenticator");
            setShowChangeTotp(false);
            setShowEmailModal(false);
        } else {
            alert({ type: "ERROR", message: result.message });
        }
    }
    return (
        <div style={{ padding: "1.1rem 5.3rem" }}>

            <div className="usersettings-settings">
                <div className="biography-2FA">
                    {showChangeTotp ? (
                        <button
                            onClick={handleChangeTotp}
                            className="biography-button-2FA pink-button"
                        >
                            Cambiar Autenticación De Dos Factores (2FA)
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerateTotp}
                            className="biography-button-2FA pink-button"
                        >
                            Generar Autenticación De Dos Factores (2FA)
                        </button>
                    )}
                </div>
                <div style={{ textAlign: "right", padding: "5px 0px" }}>
                    {showTotpModal && (
                        <div className="totp-modal">
                            <h3>Verificación TOTP</h3>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                                    `otpauth://totp/${encodeURIComponent(
                                        "Pinkker"
                                    )}:${encodeURIComponent(
                                        props.usuario.NameUser
                                    )}?algorithm=SHA1&digits=6&issuer=${encodeURIComponent(
                                        "Pinkker"
                                    )}&period=30&secret=${encodeURIComponent(totpSecret)}`
                                )}`}
                                style={{
                                    padding: "10px",
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "5px",
                                    border: "1px solid lightgray",
                                }}
                                alt="QR Code"
                            />
                            <p>Escanee el código QR con su aplicación TOTP.</p>
                            <input
                                type="text"
                                placeholder="Ingrese el código"
                                value={totpCode}
                                onChange={(e) => setTotpCode(e.target.value)}
                            />
                            <button
                                onClick={handleValidateTotp}
                                className="biography-button pink-button"
                            >
                                Validar Código
                            </button>
                        </div>
                    )}

                    {showEmailModal && (
                        <div className="totp-modal">
                            <h3>Revise su mail</h3>
                            <p>Introduzca el número enviado a su correo electrónico.</p>
                            <input
                                type="text"
                                placeholder="Ingrese el código"
                                value={totpCode}
                                onChange={(e) => setTotpCode(e.target.value)}
                            />
                            <button
                                onClick={handleDeleteTotp}
                                className="biography-button pink-button"
                            >
                                Eliminar Autenticación De Dos Factores (2FA)
                            </button>
                        </div>
                    )}

                </div>
                <div className="resetpassword-title">
                    <h2 style={{ color: "#ededed" }}>Cambiar Contraseña</h2>
                </div>

                <div className="resetpassword-card-container">
                    <div className="biography-content">
                        <div style={{ width: "100%", textAlign: "left" }}>
                            <h4>Contraseña</h4>
                        </div>
                        <div className="biography-input">
                            <input type="password" name="password" id="password" value={rPassword} onChange={(e) => setrPassword(e.target.value)} />
                            <p style={{ fontSize: "13px", color: "darkgray" }}>Introduce tu nueva contraseña.</p>
                        </div>
                    </div>
                    <hr style={{ border: "1px solid #2b2b2b8f" }} />
                    <div className="biography-content">
                        <div style={{ width: "100%", textAlign: "left" }}>
                            <h4>Confirmar Contraseña</h4>
                        </div>
                        <div className="biography-input">
                            <input type="password" name="cf_password" id="cf_password" value={rConfirmPassword} onChange={(e) => setrConfirmPassword(e.target.value)} />
                            <p style={{ fontSize: "13px", color: "darkgray" }}>Vuelve a introducir tu nueva contraseña.</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <button className='resetpassword-button' onClick={() => handleResetPass()}>Cambiar Contraseña</button>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default Seguridad