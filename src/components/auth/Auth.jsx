import React, { useState, useEffect } from "react";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { dispatchLogin } from "../../redux/actions/authAction";
import { Link, useHistory, useLocation } from "react-router-dom";

import "./Auth.css";

import {
  isEmpty,
  isEmail,
  isLength,
  isMatch,
  isUsernameLength,
  isAlphaNumeric,
  isSpecial,
} from "../../utils/validation/Validation";
import ReCAPTCHA from "react-google-recaptcha";

import { useNotification } from "../Notifications/NotificationProvider";

import ChangeLooks from "../../metaverse/changelooks/ChangeLooks";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import OAuth2Login from "../OAuth2/OAuth2Login";
import {
  Get_Recover_lost_password,
  LoginTOTPSecret,
  SaveUserCodeConfirm,
  login,
  signupNotConfirmed,
} from "../../services/backGo/user";

export default function Auth({ isMobile, closePopup, typeDefault }) {
  const auth = useSelector((state) => state.auth);

  const [type, setType] = useState(typeDefault);
  const [catcha, setCatcha] = useState(false);
  const [userIp, setUserIp] = useState(null);

  const [signupNotConfirmedErr, setsignupNotConfirmedErr] = useState(false);
  const [signupNotConfirmedCodeErr, setsignupNotConfirmedCodeErr] =
    useState(false);

  const [rUsername, setrUsername] = useState(null);
  const [rPassword, setrPassword] = useState(null);
  const [rConfirmPassword, setrConfirmPassword] = useState(null);
  const [rEmail, setrEmail] = useState(null);
  const [rDay, setrDay] = useState(null);
  const [rMonth, setrMonth] = useState(null);
  const [rYear, setrYear] = useState(null);
  const [CodeConfirm, setCodeConfirm] = useState(false);
  const [lUsername, setlUsername] = useState(null);
  const [FullName, setFullName] = useState(null);
  const [lPassword, setlPassword] = useState(null);

  const [step, setStep] = useState(0);

  const [gender, setGender] = useState(null);

  const [countryInfo, setCountryInfo] = useState(null);

  const [recuperyMail, setRecuperyMail] = useState(null);
  const [TOTPCode, setTOTPCode] = useState(null);
  const [showTOTPInput, setShowTOTPInput] = useState(false);
  const alert = useNotification();

  function onChange(value) {
    if (value === null) setCatcha(false);
    if (value != null) setCatcha(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      //Get user IP
      const res = await axios.get("https://api.ipify.org/?format=json");
      if (res.data != null && res.data != undefined) {
        setUserIp(res.data.ip);

        const res2 = await axios.get(`https://ipapi.co/${res.data.ip}/json/`);
        if (res2.data != null && res2.data != undefined) {
          setCountryInfo(res2.data);
        }
      }
    };
    fetchData();
  }, []);

  async function handleSubmit() {
    if (type === 0) {
      /*if(catcha === false) {
                alert({type: "ERROR", message: "Completa el CAPTCHA"})
                return;
            }*/
      try {
        let res;
        if (showTOTPInput) {
          res = await LoginTOTPSecret({
            NameUser: lUsername,
            password: lPassword,
            totp_code: TOTPCode,
          });
        } else {
          res = await login({ NameUser: lUsername, password: lPassword });
        }

        if (res && res.message === "token") {
          alert({
            type: "SUCCESS",
          });
          window.localStorage.setItem("token", String(res.data));
          window.localStorage.setItem("_id", res._id);
          window.localStorage.setItem("avatar", res.avatar);
          window.localStorage.setItem("keyTransmission", res.keyTransmission);
          window.location.href = "/";

          closePopup();
        } else {
          if (res.data.message === "TOTPSecret") {
            setShowTOTPInput(true);
            return;
          }
          alert({
            type: "ERROR",
            message: "incorrect password or user does not exist",
          });
        }
      } catch (err) {
        console.log(err);

        alert({ type: "ERROR", message: err });
      }
    }

    if (type === 1) {
      if (isEmpty(rUsername) || isEmpty(rPassword))
        return alert({ type: "ERROR", message: "Please fill in all fields." });
      if (!isEmail(rEmail))
        return alert({ type: "ERROR", message: "Invalid emails." });

      if (isLength(rPassword))
        return alert({
          type: "ERROR",
          message: "Password must be at least 6 characters.",
        });
      // if (!isMatch(rPassword, rConfirmPassword))
      //   return alert({ type: "ERROR", message: "Password did not match." });
      /*if(catcha === false) {
                alert({type: "ERROR", message: "Completa el CAPTCHA"})
                return;
            }*/

      if (rMonth === "null" && rMonth === null)
        return alert({ type: "ERROR", message: "Completa el mes" });
      if (rDay === "null" && rDay === null)
        return alert({ type: "ERROR", message: "Completa el dia" });
      if (rYear === "null" && rYear === null)
        return alert({ type: "ERROR", message: "Completa el año" });

      try {
        // const birthDate = `${rYear}-${rMonth}-${String(rDay).padStart(2, "0")}`;
        const res = await signupNotConfirmed({
          nameUser: rUsername,
          fullName: rUsername,
          Email: rEmail,
          password: rPassword,
          // BirthDate: birthDate,
        });

        if (res && res.message == "email to confirm") {
          setCodeConfirm(true);
          // localStorage.setItem("firstLogin", true);
          // setStep(1);
        } else {
          alert({ type: "ERROR", message: "Email o Nombre de Usuario en uso" });
          setsignupNotConfirmedErr(true);
        }
      } catch (err) {
        alert({ type: "ERROR", message: err.response.data.msg });
      }
    }

    if (type === 2) {
      if (isEmpty(recuperyMail))
        return alert({ type: "ERROR", message: "Please fill in all fields." });
      if (!isEmail(recuperyMail))
        return alert({ type: "ERROR", message: "Invalid emails." });

      try {
        const res = await Get_Recover_lost_password(recuperyMail);
        if (res.data != null && res.data.msg != null) {
          alert({ type: "SUCCESS", message: res.data.msg });
          setStep(2);
        }
      } catch (err) {
        alert({ type: "ERROR", message: err.response.data.msg });
      }
    }
  }
  async function handleSubmitCode() {
    const response = await SaveUserCodeConfirm(CodeConfirmInput);
    if (response && response.message === "token") {
      window.localStorage.setItem("token", String(response.data));
      window.localStorage.setItem("_id", response._id);
      window.localStorage.setItem("avatar", response.avatar);
      window.localStorage.setItem("keyTransmission", response.keyTransmission);
      window.location.href = "/";
    } else {
      setsignupNotConfirmedCodeErr(true);
    }
  }
  const onKeyPressInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleSubmit();
    }
  };

  const [errorUserName, setErrorUsername] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);

  const [CodeConfirmInput, setCodeConfirmInput] = useState(0);

  function onChangeUserName(e) {
    if (isEmpty(e)) {
      setErrorUsername("*Selecciona un nombre de usuario");
      return;
    }
    if (e.length <= 5) {
      setErrorUsername(
        "*Los nombres de usuario deben tener entre 5 y 15 caracteres."
      );
      return;
    }

    if (!isSpecial(e)) {
      setErrorUsername(
        "*Los nombres de usuario solo pueden contener caracteres alfanuméricos."
      );
      return;
    }
    setErrorUsername("");
    setrUsername(e);
  }

  function onChangeCodeConfirm(e) {
    setCodeConfirmInput(e);
  }

  function onChangePassword(e) {
    if (isEmpty(e)) {
      setErrorPassword("*Selecciona una contraseña");
      return;
    }
    if (isLength(e)) {
      setErrorPassword("*La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setErrorPassword("");
    setrPassword(e);
  }

  function onChangeConfirmPassword(e) {
    if (isEmpty(e)) {
      setErrorConfirmPassword("*Selecciona una contraseña");
      return;
    }
    if (isLength(e)) {
      setErrorConfirmPassword(
        "*La contraseña debe tener al menos 8 caracteres."
      );
      return;
    }
    if (!isMatch(rPassword, e)) {
      setErrorConfirmPassword(
        "*Las contraseñas no coinciden. Inténtalo de nuevo"
      );
      return;
    }

    setErrorConfirmPassword("");
    setrConfirmPassword(e);
  }

  function onChangeEmail(e) {
    if (isEmpty(e)) {
      setErrorEmail("*Selecciona una contraseña");
      return;
    }
    if (!isEmail(e)) {
      setErrorEmail("*El email no es válido.");
      return;
    }

    setErrorEmail("");
    setrEmail(e);
  }

  function getType() {
    if (type === 0) {
      return (
        <div className="auth-content">
          {!showTOTPInput ? (
            <>
              <div className="auth-content-input">
                <p>Username*</p>
                <input
                  onChange={(e) => setlUsername(e.target.value)}
                  type="text"
                  value={lUsername || ""}
                />
              </div>

              <div className="auth-content-input">
                <p>Contraseña</p>
                <input
                  onChange={(e) => setlPassword(e.target.value)}
                  type="password"
                  value={lPassword || ""}
                />
              </div>
            </>
          ) : (
            <div className="auth-content-input">
              <p>Introduce tu código TOTP</p>
              <input
                onChange={(e) => setTOTPCode(e.target.value)}
                type="text"
                value={TOTPCode || ""}
              />
            </div>
          )}

          <a onClick={() => setType(2)} style={{ padding: 0 }}>
            <p
              className=""
              style={{
                fontSize: "12px",
                textAlign: "end",
                color: "#ff64b0",
                cursor: "pointer",
              }}
            >
              ¿Tienes problemas para iniciar sesión?
            </p>
          </a>

          <button onClick={() => handleSubmit()} className="auth-button-login">
            Iniciar Sesión
          </button>
          <p
            style={{
              fontSize: "12px",
              fontFamily: "inter",
              textAlign: "center",
              margin: "15px 0px",
            }}
          >
            Or continue with
          </p>
          <OAuth2Login
            className="OAuth2Login"
            style={{ marginTop: "5px", marginBottom: "10px" }}
          ></OAuth2Login>
        </div>
      );
    }
    if (type === 1 && step === 0) {
      return (
        <div>
          {!CodeConfirm ? (
            <div className="auth-content">
              <div className="auth-content-input">
                <p style={{ fontSize: "12px", fontFamily: "inter" }}>
                  Username*{" "}
                  {errorUserName === "" && (
                    <i
                      style={{ color: "lightgreen", marginLeft: "109px" }}
                      class="fas fa-check-circle"
                    />
                  )}
                </p>
                <input
                  className={
                    errorUserName != null &&
                    errorUserName != "" &&
                    "input-error"
                  }
                  onChange={(e) => onChangeUserName(e.target.value)}
                  type="text"
                />
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgb(228, 122, 122)",
                    marginTop: "5px",
                    fontFamily: "inter",
                  }}
                >
                  {errorUserName}
                </p>
              </div>

              <div className="auth-content-input">
                <p style={{ fontSize: "12px", fontFamily: "inter" }}>
                  Email*{" "}
                  {errorEmail === "" && (
                    <i
                      style={{ color: "lightgreen", marginLeft: "109px" }}
                      class="fas fa-check-circle"
                    />
                  )}
                </p>
                <input
                  className={
                    errorEmail != null && errorEmail != "" && "input-error"
                  }
                  onChange={(e) => onChangeEmail(e.target.value)}
                  type="text"
                />
                <p
                  style={{
                    fontSize: "10px",
                    color: "rgb(228, 122, 122)",
                    marginTop: "5px",
                  }}
                >
                  {errorEmail}
                </p>
              </div>
              <div className="auth-content-input">
                <p style={{ fontSize: "12px", fontFamily: "inter" }}>
                  Password*{" "}
                  {errorPassword === "" && (
                    <i
                      style={{ color: "lightgreen", marginLeft: "159px" }}
                      class="fas fa-check-circle"
                    />
                  )}
                </p>
                <input
                  className={
                    errorPassword != null &&
                    errorPassword != "" &&
                    "input-error"
                  }
                  onChange={(e) => onChangePassword(e.target.value)}
                  type="password"
                />
                <p
                  style={{
                    fontSize: "10px",
                    color: "rgb(228, 122, 122)",
                    marginTop: "5px",
                  }}
                >
                  {errorPassword}
                </p>
              </div>

              <div className="auth-text">
                <input type="checkbox" style={{ width: "5%", border: 0 }} />
                <p className="" style={{ fontSize: "11px" }}>
                  I agree to the
                  <a style={{ color: "#ff64b0", cursor: "pointer" }}>
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a style={{ color: "#ff64b0", cursor: "pointer" }}>
                    Privacy Policy.
                  </a>
                </p>
              </div>

              {signupNotConfirmedErr && (
                <div>
                  <p style={{ color: "rgb(228, 122, 122)" }}>
                    {/* {errorUserName} */}
                    {/* {errorConfirmPassword != null &&
                      errorConfirmPassword != "" && (
                        <i
                          style={{ color: "#EB0400", marginLeft: "83px" }}
                          class="fas fa-exclamation-circle"
                        />
                      )}{" "} */}
                  </p>
                </div>
              )}
              <button
                onClick={() => handleSubmit()}
                className="auth-button-login"
              >
                Registrarse
              </button>
              <p
                style={{
                  fontSize: "12px",
                  fontFamily: "inter",
                  textAlign: "center",
                  margin: "15px 0px",
                }}
              >
                Or continue with
              </p>
              <OAuth2Login
                className="OAuth2Login"
                style={{ marginTop: "5px", marginBottom: "10px" }}
              ></OAuth2Login>
              {/*<button onClick={() => setStep(1)} className="auth-button-login">Siguiente paso</button>*/}
            </div>
          ) : (
            <div className="auth-content">
              <div className="auth-content-input">
                <p>Revisa tu correo</p>
                <input
                  onChange={(e) => onChangeCodeConfirm(e.target.value)}
                  type="number"
                />
                <button
                  style={{
                    width: "100%",
                  }}
                  onClick={() => handleSubmitCode()}
                  className="auth-button-login"
                >
                  enviar codigo
                </button>
                {signupNotConfirmedCodeErr && (
                  <div>
                    <p style={{ color: "rgb(228, 122, 122)" }}>
                      code not found
                      <i
                        style={{ color: "#EB0400", marginLeft: "83px" }}
                        class="fas fa-exclamation-circle"
                      />
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === 1 && step === 1) {
      return (
        <div className="auth-content">
          <div
            style={{ textAlign: "left", marginTop: "30px" }}
            className="auth-text"
          >
            <h3>¡Felicitaciones!</h3>
            <p>Estas a un paso de tener tu cuenta.</p>
          </div>

          <div className="auth-changelook-container">
            <img
              style={{ width: "150px" }}
              src="https://res.cloudinary.com/pinkker/image/upload/v1679518811/pinkker-ups_iqucmd.png"
            />
          </div>

          <div
            style={{ textAlign: "center", marginTop: "30px" }}
            className="auth-text"
          >
            <h3>¡Verifica tu mail!</h3>
            <p>
              Te enviamos un mail a tu correo electronico para verificar tu
              cuenta
            </p>
          </div>
          <button
            onClick={() => closePopup()}
            style={{ marginTop: "50px" }}
            className="auth-button-login"
          >
            Cerrar
          </button>
        </div>
      );
    }

    if (type === 2 && step === 0) {
      return (
        <div className="auth-content">
          <div className="auth-content-input">
            <p>Email</p>
            <input
              id="identifierId"
              onChange={(e) => setRecuperyMail(e.target.value)}
              type="text"
            />
          </div>

          <button onClick={() => handleSubmit()} className="auth-button-login">
            Enviar Correo
          </button>
        </div>
      );
    }

    if (type === 2 && step === 2) {
      return (
        <div className="auth-content">
          <div
            style={{ textAlign: "left", marginTop: "30px" }}
            className="auth-text"
          >
            <h3>¡Felicitaciones!</h3>
            <p>Estas a un paso de tener tu cuenta.</p>
          </div>

          <div className="auth-changelook-container">
            <img
              style={{ width: "150px" }}
              src="https://res.cloudinary.com/pinkker/image/upload/v1679518811/pinkker-ups_iqucmd.png"
            />
          </div>

          <div
            style={{ textAlign: "center", marginTop: "30px" }}
            className="auth-text"
          >
            <h3>¡Verifica tu mail!</h3>
            <p>
              Te enviamos un mail a tu correo electronico para verificar tu
              cuenta
            </p>
          </div>
          <button
            onClick={() => closePopup()}
            style={{ marginTop: "50px" }}
            className="auth-button-login"
          >
            Cerrar
          </button>
        </div>
      );
    }
  }

  return (
    <div className="auth-body-container">
      <div className={"auth-body"}>
        <div className={"auth-info"}>
          <div style={{ width: "100%", height: "50%" }}>
            <div
              style={{
                color: "#ededed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: type === 0 ? "300px" : "500px",
              }}
            ></div>
          </div>
        </div>

        <div
          onKeyPress={(event) => onKeyPressInput(event)}
          className={"auth-container"}
        >
          <div style={{ width: "100%" }}>
            <div className="auth-title">
              <div
                onClick={() => setType(1)}
                className={
                  type === 1 ? "auth-title-card active" : "auth-title-card"
                }
              >
                <h6
                  style={{
                    color: "#ededed",
                    fontFamily: "Inter",
                    fontWeight: "bold",
                  }}
                >
                  Register
                </h6>
              </div>

              <div
                onClick={() => setType(0)}
                className={
                  type === 0 ? "auth-title-card active" : "auth-title-card"
                }
              >
                <h6
                  style={{
                    color: "#ededed",
                    fontFamily: "Inter",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </h6>
              </div>
            </div>

            {getType()}
          </div>
          <div className="auth-close">
            <button className="pinkker-button-more" onClick={closePopup}>
              <i
                style={{ fontSize: isMobile && "20px" }}
                class="fas fa-times"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
