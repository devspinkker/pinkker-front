import React, { useState, useEffect } from "react";
import "./RecoverPassword.css";
import { AccountRecovery } from "../../services/backGo/user";
import { useNotification } from "../Notifications/NotificationProvider";
export default function RecoverPassword() {
  const [resetToken, setResetToken] = useState("");
  const alert = useNotification();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("reset_token");
    setResetToken(token);
  }, []);

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handlePasswordChange1 = (e) => {
    setPassword1(e.target.value);
    setPasswordsMatch(e.target.value === password2);
    setPasswordsMatch(e.target.value.length >= 8);
  };

  const handlePasswordChange2 = (e) => {
    setPassword2(e.target.value);
    setPasswordsMatch(e.target.value === password1);
  };
  const HandleSubmit = async () => {
    if (password1 == password2 && password1.length >= 8) {
      const res = await AccountRecovery(resetToken, password1);
      console.log(res);
      if (res?.message === "StatusOK") {
        alert({ type: "SUCCESS", message: "contraseña restablecida" });
      } else {
        alert({ type: "ERROR", message: "algo salio mal" });
      }
    } else {
      setPasswordsMatch(false);
    }
  };
  return (
    <div className="RecoverPasswordContainer">
      <div className="RecoverPassword">
        <h3
          style={{
            color: "#ededed",
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img style={{ width: "50px" }} src="/images/pinkker.png" alt="" />{" "}
          Nueva contraseña
        </h3>
        <div className="RecoverPasswordInputs">
          <input
            style={{
              margin: "10px",
            }}
            type="password"
            placeholder="Contraseña"
            value={password1}
            onChange={handlePasswordChange1}
          />
          <input
            style={{
              margin: "10px",
            }}
            type="password"
            placeholder="Repetir contraseña"
            value={password2}
            onChange={handlePasswordChange2}
          />
          <button
            onClick={() => {
              HandleSubmit();
            }}
          >
            Restablecer
          </button>
        </div>
        {!passwordsMatch && (
          <p style={{ color: "red" }}>Las contraseñas no coinciden</p>
        )}
      </div>
    </div>
  );
}
