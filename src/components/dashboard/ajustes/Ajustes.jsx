import React, { useState } from 'react'
import DashboarLayout from '../DashboarLayout'
import { CiStreamOn } from 'react-icons/ci'
import { Grid } from '@mui/material'
import { useNotification } from '../../Notifications/NotificationProvider';

function Ajustes({ user, isMobile }) {
    const alert = useNotification();
    const [showKey, setShowKey] = useState(false);
    const [showComandosList, setShowComandosList] = useState(false);


    const copyToClipboard = (text) => {
        var textField = document.createElement("textarea");
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
        alert({ type: "SUCCESS", message: "Copiado correctamente!" });
    };
    return (
        <DashboarLayout user={user} isMobile={isMobile}>
            <div
                className="Información-sesión"
                style={{
                    display: showComandosList && "none",
                }}
            >
                <section className="base-card !p-0">
                    <div className="Información-sesión-p1">
                        <div
                            title="Información de sesión"
                            className="flex flex-row items-center gap-1"
                        >
                            <CiStreamOn
                                style={{ color: "white", fontSize: "30px" }}
                            />

                            <span
                                style={{
                                    padding: "0px 10px",
                                }}
                                className="shrinkS2"
                            >
                                Servidor y clave de stream
                            </span>
                        </div>
                        <Grid>
                            <input
                                value={process.env.REACT_APP_RTMPSTARTSTREAM}
                                className="settingstream-input"
                                style={{ width: "70%" }}
                                type="text"
                                readOnly
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <input
                                    value={showKey ? user?.cmt : "******************"}
                                    className="settingstream-input"
                                    style={{ width: "70%" }}
                                    type="text"
                                />
                                <div
                                    style={{
                                        marginTop: "10px",
                                    }}
                                >
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="button-copy"
                                    >
                                        {showKey ? "Ocultar" : "Mostrar"}
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(user?.cmt)}
                                        className="button-copy"
                                    >
                                        Copiar
                                    </button>
                                    <button className="button-copy">Restablecer</button>
                                </div>
                            </div>
                        </Grid>
                    </div>
                </section>
            </div>
        </DashboarLayout>

    )
}

export default Ajustes