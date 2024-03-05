import React from "react";
import "./SettingsStream.css";
import { useSelector } from "react-redux";

import { useNotification } from "../../../Notifications/NotificationProvider";

export default function SettingsStream({ user }) {
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
            <div>
              <div>
                <input
                  value={process.env.REACT_APP_RTMPSTARTSTREAM}
                  className="settingstream-input"
                  style={{ width: "70%" }}
                  type="text"
                />
                <input
                  value={
                    user?.keyTransmission &&
                    user?.keyTransmission.substring(
                      4,
                      user?.keyTransmission.length
                    )
                  }
                  className="settingstream-input"
                  style={{ width: "70%" }}
                  type="text"
                />

                <button
                  onClick={() =>
                    copyToClipboard(
                      user?.keyTransmission &&
                        user?.keyTransmission.substring(
                          4,
                          user?.keyTransmission.length
                        )
                    )
                  }
                  className="button-copy"
                >
                  Copiar
                </button>
                <button className="button-copy">Restablecer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
