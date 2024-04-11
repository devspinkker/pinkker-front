import React, { useState } from "react";
import { GoogleLoginURL } from "../../services/backGo/OAuth2";
import "./OAuth2.css";

export default function OAuth2Login() {
  const handleGoogleLogin = async () => {
    try {
      const googleLoginURL = await GoogleLoginURL();
      window.location.href = googleLoginURL.data.redirect;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <div className="OAuth2Login">
      <span className="OAuth2Login-button" onClick={handleGoogleLogin}>
        <img src={'/images/google.svg'} /> Google
      </span>
    </div>
  );
}
