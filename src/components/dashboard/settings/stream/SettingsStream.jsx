import React from "react";
import "./SettingsStream.css";
import { useSelector } from "react-redux";

import { useNotification } from "../../../Notifications/NotificationProvider";

export default function SettingsStream() {
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;

  const alert = useNotification();

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
    <div className="settingstream-body">
      <div className="settingstream-container">
        <h3>Preferencias y clave de transmisión</h3>
        <div className="settingstream-content">
          <div className="settingstream-camp">
            <p>Clave de la transmisión principal</p>
            <div style={{ marginLeft: "50px" }}>
              <div>
                <input
                  value={process.env.REACT_APP_RTMPSTARTSTREAM}
                  className="settingstream-input"
                  style={{ width: "70%" }}
                  type="text"
                />
                <input
                  value={
                    user.keyTransmission &&
                    user.keyTransmission.substring(
                      4,
                      user.keyTransmission.length
                    )
                  }
                  className="settingstream-input"
                  style={{ width: "70%" }}
                  type="text"
                />

                <button
                  onClick={() =>
                    copyToClipboard(
                      user.keyTransmission &&
                        user.keyTransmission.substring(
                          4,
                          user.keyTransmission.length
                        )
                    )
                  }
                  className="button-copy"
                >
                  Copiar
                </button>
                <button className="button-copy">Restablecer</button>
              </div>
              <p style={{ width: "80%" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                porro, quos nesciunt neque cupiditate maiores, repudiandae
                asperiores ut amet expedita repellat beatae rerum ipsam debitis
                odit libero, velit doloribus voluptates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
