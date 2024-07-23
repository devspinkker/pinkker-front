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
import "./Biography.css";
import { editProfile } from "../../../../services/backGo/user";

export default function Biography(props) {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const alert = useNotification();
  const [biography, setBiography] = useState(null);
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
      birthDate,
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
      alert({ type: "SUCCESS" });
      setShowTotpModal(false);
    } else {
      alert({ type: "ERROR" });
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
    <div className="biography-body">
      <h3>Acerca de</h3>

      <div className="biography-container">
        <div className="biography-content">
          <div style={{ textAlign: "left" }}>
            <h4>Nombre de usuario</h4>
          </div>
          <div className="biography-input">
            <p>{props.user?.NameUser}</p>
            <Grid style={{ fontSize: "24px", cursor: "pointer" }}>
              <TbEdit />
            </Grid>
          </div>
        </div>

        <div className="biography-content">
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
        </div>
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
                    props.user?.NameUser
                  )}?algorithm=SHA1&digits=6&issuer=${encodeURIComponent(
                    "Pinkker"
                  )}&period=30&secret=${encodeURIComponent(totpSecret)}`
                )}`}
                style={{
                  padding: "10px 0px",
                }}
                alt="TOTP QR Code"
              />
              <input
                type="text"
                placeholder="Ingrese el código TOTP"
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

          <button
            style={{ width: "105px" }}
            onClick={handleSubmit}
            className="biography-button pink-button"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
