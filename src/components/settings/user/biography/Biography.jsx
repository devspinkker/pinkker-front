import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNotification } from "../../../Notifications/NotificationProvider";
import { TbEdit } from "react-icons/tb";
import { Grid } from "@mui/material";
import {
  generateTotpKey,
  validateTotpCode,
  ChangeGoogleAuthenticator,
  DeleteGoogleAuthenticator,
} from "../../../../services/backGo/totpService";
import { editProfile, ChangeNameUser } from "../../../../services/backGo/user";
import "./Biography.css";

export default function Biography(props) {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const alert = useNotification();
  const [biography, setBiography] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [country, setCountry] = useState(null);
  const [phone, setPhone] = useState(null);
  const [website, setWebsite] = useState(null);
  const [sentimental, setSentimental] = useState(null);
  const [rDay, setrDay] = useState(20);
  const [rMonth, setrMonth] = useState(12);
  const [rYear, setrYear] = useState(2000);
  const [totpCode, setTotpCode] = useState("");
  const [totpSecret, setTotpSecret] = useState(null);
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [showChangeTotp, setShowChangeTotp] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newUserName, setNewUserName] = useState(""); // Estado para el nuevo nombre de usuario
  const [isTotpValid, setIsTotpValid] = useState(false); // Estado para la validez del código TOTP

  let token = window.localStorage.getItem("token");
  let GoogleAuthenticator = window.localStorage.getItem("GoogleAuthenticator");

  useEffect(() => {
    if (GoogleAuthenticator === "ok") {
      setShowChangeTotp(true);
    }
  }, [GoogleAuthenticator]);

  async function handleSubmit() {
    const birthDate = `${rYear}-${rMonth}-${String(rDay).padStart(2, "0")}`;
    const data = await editProfile(token, {
      biography,
      country,
      Phone: phone,
      Website: website,
      birthDate: birthday ?? birthDate,
      situation: sentimental,
    });
    if (data.error) {
      window.scrollTo(0, 0);
      alert({ type: "ERROR", message: "error" });
      return;
    }
    if (data.data.message === "ok") {
      window.scrollTo(0, 0);
      alert({ type: "SUCCESS", message: data.data.msg });
    }
  }

  async function handleChangeName() {
    if (!newUserName) {
      alert({
        type: "ERROR",
        message: "Por favor, ingrese un nombre de usuario válido.",
      });
      return;
    }

    // Si el código es válido, proceder a cambiar el nombre de usuario
    const changeResult = await ChangeNameUser(newUserName, token, totpCode);
    if (changeResult.message === "StatusOK") {
      alert({
        type: "SUCCESS",
        message: "Nombre de usuario cambiado exitosamente.",
      });
      window.localStorage.setItem("token", "");
      window.location.reload();
    } else {
      alert({ type: "ERROR", message: changeResult.message });
    }
  }

  

  return (
    <div className="biography-body">
      {/* <h3>Acerca de</h3> */}

      <div className="biography-container">
        {/* <div className="biography-content">
          <div style={{ textAlign: "left" }}>
            <h4>Nombre de usuario</h4>
          </div>
          <div className="biography-input">
            <p>{props.user?.NameUser}</p>
            <Grid style={{ fontSize: "24px", cursor: "pointer" }}>
              <TbEdit />
            </Grid>
          </div>
        </div> */}

        <div className="biography-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h4>Cambiar Nombre de Usuario</h4>
          </div>
          <div
            className="biography-input"
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <input
              placeholder={props.user?.NameUser}
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            {showChangeTotp ? (
              <input
                placeholder="Autenticación De Dos Factores (2FA)"
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
              />
            ) : (
              <input
                placeholder="Genera Autenticación De Dos Factores (2FA)"
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
              />
            )}
            <button
              onClick={handleChangeName}
              style={{
                marginTop: "20px",
              }}
              className="biography-button pink-button"
            >
              Cambiar Nombre
            </button>
          </div>
        </div>

        <div className="biography-content" style={{display:'flex', flexDirection:'column', gap: '10px'}}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h4>Biografía y Usuario </h4>
            <TbEdit style={{ fontSize: "24px", cursor: "pointer" }} />
          </div>
          <div
            className="biography-input"
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <input
              placeholder={props.user?.biography}
              type="text"
              onChange={(e) => setBiography(e.target.value)}
            />
            <p style={{ fontSize: "13px", color: "darkgray" }}>
              Descripción del panel "Acerca de" de la página de tu canal en
              menos de 200 caracteres.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h4>Fecha De Cumpleaños </h4>
            <TbEdit style={{ fontSize: "24px", cursor: "pointer" }} />
          </div>

          <div
            className="biography-input"
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <input
              placeholder="Ejemplo: 1888-10-05"
              type="text"
              onChange={(e) => setBirthday(e.target.value)}
            />
            <p style={{ fontSize: "13px", color: "darkgray" }}>
              Fecha de cumpleaños YYYY-MM-DD
            </p>
          </div>
        </div>
        
        

          <button
            style={{ width: "105px" }}
            onClick={handleSubmit}
            className="biography-button pink-button"
          >
            Guardar
          </button>
        </div>
      </div>
    
  );
}
