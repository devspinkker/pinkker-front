import React, { useState, useEffect } from "react";
import "./DropdownPoints.css";
import { Link } from "react-router-dom";

import axios from "axios";
import { useSelector } from "react-redux";

import { useNotification } from "../../../../Notifications/NotificationProvider";

import { createDonationPixel } from "../../../../../services/donationPixel";
import { getUserByIdTheToken } from "../../../../../services/backGo/user";
import { CreateDonation } from "../../../../../services/backGo/donation";

function DropdownPoints({ socketMain, streamer, closeNavbar, callback }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  useEffect(() => {
    async function GetUser() {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          const res = await getUserByIdTheToken(token);
          if (res.message === "ok") {
            setUser(res.data);
          }
        } catch (error) {}
      }
    }
    GetUser();
  }, []);
  const [user, setUser] = useState(null);

  const [type, setType] = useState(0);

  const alert = useNotification();

  const [selectedAmount, setSelectedAmount] = useState(0);
  const [textDonation, setTextDonation] = useState(null);
  const [totpCode, setTotpCode] = useState(null);

  async function handleSend() {
    const token = window.localStorage.getItem("token");

    if (textDonation != null && token) {
      try {
        const data = await CreateDonation(
          token,
          streamer?.id,
          selectedAmount,
          textDonation,
          totpCode
        );
        // callback(selectedAmount, textDonation, data.data.donation);
        console.log(data);
        if (data.message === "ok") {
          closeNavbar();
          alert({
            type: "SUCCESS",
            message: "Se ha enviado la donacion correctamente!",
          });
        } else {
          alert({
            type: "ERROR",
            message: "Invalid  code",
          });
        }
      } catch (error) {
        alert({ type: "ERROR", message: "Error" });
      }
    } else {
      alert({ type: "ERROR", message: "Selecciona un texto para donar!" });
    }
  }

  function handleClickPixel(amount) {
    if (user?.Pixeles >= amount) {
      // clickDonation("pixels" + amount);
      setSelectedAmount(amount);
    } else {
      alert({
        type: "ERROR",
        message: "No tienes suficientes pixels para enviar.",
      });
    }
  }

  function getdropdownpoints() {
    if (type === 0) {
      return (
        <div>
          <div
            className="dropdowns-title-container"
            style={{ borderBottom: "1px solid #4b4b4b8f" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
              className="dropdownchatconfig-link"
              onClick={closeNavbar}
            >
              <h3 style={{ width: "85%" }}>Enviar Pixels</h3>
              <i
                onClick={handleClick}
                style={{
                  marginLeft: "10px",
                  marginTop: "3px",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
                class="fas fa-times pinkker-button-more"
              ></i>
            </div>
          </div>

          <div className="dropdownpoints-card-container">
            <div
              onClick={() => handleClickPixel(500)}
              className={
                user?.Pixeles >= 500
                  ? "dropdownpoints-card"
                  : "dropdownpoints-card-disabled"
              }
            >
              <div>
                <img
                  style={{ width: "25px" }}
                  src="/images/donaciones/1.png"
                  alt=""
                />
                <p style={{ fontSize: "14px", fontFamily: "Poppins" }}>500</p>
              </div>
            </div>
            <div
              onClick={() => handleClickPixel(1000)}
              className={
                user?.Pixeles >= 1000
                  ? "dropdownpoints-card"
                  : "dropdownpoints-card-disabled"
              }
            >
              <div>
                <img
                  style={{ width: "35px" }}
                  src="/images/donaciones/100.png"
                  alt=""
                />
                <p style={{ fontSize: "14px", fontFamily: "Poppins" }}>1000</p>
              </div>
            </div>
            <div
              onClick={() => handleClickPixel(3500)}
              className={
                user?.Pixeles >= 3500
                  ? "dropdownpoints-card"
                  : "dropdownpoints-card-disabled"
              }
            >
              <div>
                <img
                  style={{ width: "40px" }}
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1725927824/monedas/Recurso_5_wxh2ra.png"
                  alt=""
                />
                <p style={{ fontSize: "14px", fontFamily: "Poppins" }}>3500</p>
              </div>
            </div>
            <div
              onClick={() => handleClickPixel(5500)}
              className={
                user?.Pixeles >= 5500
                  ? "dropdownpoints-card"
                  : "dropdownpoints-card-disabled"
              }
            >
              <div>
                <img
                  style={{ width: "42px" }}
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1725927824/monedas/Recurso_1_c9gixs.png"
                  alt=""
                />
                <p style={{ fontSize: "14px", fontFamily: "Poppins" }}>5500</p>
              </div>
            </div>
            <div
              onClick={() => handleClickPixel(7000)}
              className={
                user?.Pixeles >= 7000
                  ? "dropdownpoints-card"
                  : "dropdownpoints-card-disabled"
              }
            >
              <div>
                <img
                  style={{ width: "45px" }}
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1725927823/monedas/PIXEL_VERDE_yqvfyf.png"
                  alt=""
                />
                <p style={{ fontSize: "14px", fontFamily: "Poppins" }}>7000</p>
              </div>
            </div>
            <div
              onClick={() => handleClickPixel(8500)}
              className={
                user?.Pixeles >= 8500
                  ? "dropdownpoints-card"
                  : "dropdownpoints-card-disabled"
              }
            >
              <div>
                <img
                  style={{ width: "50px" }}
                  src="https://res.cloudinary.com/dcj8krp42/image/upload/v1725927823/monedas/pixel_dorado_snq7oh.png"
                  alt=""
                />
                <p style={{ fontSize: "14px", fontFamily: "Poppins" }}>8500</p>
              </div>
            </div>
          </div>

          {selectedAmount != 0 ? (
            <h5 className="dropdownpoints-text">
              Has seleccionado el monto de{" "}
              <a style={{ color: "#ff60b2", fontFamily: "Poppins" }}>
                {selectedAmount} PXL
              </a>
            </h5>
          ) : (
            <h5 className="dropdownpoints-text">
              Selecciona el monto que quieras enviar al streamer.
            </h5>
          )}
          {selectedAmount != 0 && (
            <input
              className="dropdownpoints-input"
              onChange={(e) => setTextDonation(e.target.value)}
              placeholder="Escribe tu mensaje aquí.."
              type="text"
            />
          )}
          {selectedAmount != 0 && (
            <input
              className="dropdownpoints-input"
              onChange={(e) => setTotpCode(e.target.value)}
              placeholder="Google Authenticator"
              type="number"
            />
          )}
          {selectedAmount != 0 && (
            <button
              onClick={() => handleSend()}
              className="dropdownpoints-button-send"
            >
              Enviar
            </button>
          )}
        </div>
      );
    }
  }

  return (
    <>
      <ul
        id="dropdownpoints-scroll"
        className={
          click ? "dropdownpoints-menu clicked" : "dropdownpoints-menu"
        }
        style={{ width: "100%" }}
      >
        <div style={{ width: "99%" }} className="dropdownpoints-container">
          {getdropdownpoints()}
        </div>
      </ul>
    </>
  );
}

export default DropdownPoints;
