import React, { useState, useEffect } from "react";
import "./SuscriptionConfirm.css";
import { Link } from "react-router-dom";

import axios from "axios";
import { useSelector } from "react-redux";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import { useNotification } from "../../../../Notifications/NotificationProvider";

import { handleSuscription } from "../../../../../services/suscribers";
import { suscribirse } from "../../../../../services/backGo/user";

function SuscriptionConfirm({
  socket,
  closeNavbar,
  title,
  streamer,
  streamerData,
}) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const { user, isLogged } = auth;

  const [type, setType] = useState(0);

  const [hoverSubscriber, setHoverSubscriber] = useState(false);

  const alert = useNotification();

  async function handleSubmit() {
    const token = window.localStorage.getItem("token");
    if (!token) {
      return alert("logueate");
    }
    try {
      const res = await suscribirse(token, streamerData.id);
      console.log(res);
      if (res?.message == "ok") {
        alert({ type: "SUCCESS", message: "te suscribiste" });
        closeNavbar();
      }
    } catch (error) {
      alert({
        type: "ERROR",
        message: "No tienes los suficientes pixeles para suscribirte!",
      });
      closeNavbar();
    }

    // user.coins -= streamerData.suscriptionPrice;
    // const data = await handleSuscription(token, streamer)
    // if(data != null && data != undefined) {
    //   alert({type: "SUCCESS", message: data.data.msg})
    //   socket.emit("sendSuscription", user.name, streamer);
    //   closeNavbar();
    // }
  }

  function getdropdownconfirm() {
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
              <h3 style={{ width: "85%" }}>Suscribirte</h3>
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

          <hr
            style={{
              border: "1px solid #4b4b4b8f",
              marginBottom: "10px",
              width: "100%",
            }}
          />

          <div style={{ width: "90%", margin: "0 auto" }}>
            <div className="dropdownconfirm-streamer">
              <div style={{ width: "40%" }}>
                <img
                  style={{ borderRadius: "200px", width: "100px" }}
                  src={streamerData.avatar}
                  alt=""
                />
                <h5
                  className="channel-avatar-text"
                  style={{
                    color: "#ededed",
                    textAlign: "center",
                    padding: "2px",
                    borderRadius: "5px",
                    position: "relative",
                    left: "5px",
                    top: "-20px",
                    width: "85px",
                  }}
                >
                  EN DIRECTO
                </h5>
              </div>

              <div style={{ width: "50%" }}>
                <h2
                  style={{
                    fontFamily: "Poppins",
                    color: "white",
                    fontSize: "26px",
                  }}
                >
                  {streamer}
                </h2>
                <p
                  style={{
                    color: "lightgray",
                    fontFamily: "Poppins",
                    fontSize: "13px",
                  }}
                >
                  {streamerData.biography}
                </p>
              </div>
            </div>

            <div className="dropdownconfirm-total">
              <h3 style={{ fontFamily: "Poppins", color: "white" }}>
                Completar compra
              </h3>
              <p
                style={{
                  color: "darkgray",
                  fontWeight: "800",
                  marginTop: "20px",
                }}
              >
                Resumen de cuenta:
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <img style={{ width: "50px" }} src="/images/pinkker.png" />
                <div>
                  <p style={{ color: "white", fontWeight: "800" }}>
                    Suscripción de nivel 1 a {streamer}
                  </p>
                  <p style={{ color: "lightgray", fontSize: "12px" }}>
                    Cargo mensual periódico a partir del 5 oct 2022. Puedes
                    cancelarlo cuando quieras en tu página de suscripciones.
                  </p>
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#ffffff1a",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              />

              <div>
                <h3
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "95%",
                    margin: "0 auto",
                  }}
                >
                  Total:{" "}
                  <a style={{ display: "flex", alignItems: "center" }}>
                    {streamerData.suscriptionPrice}{" "}
                    <img
                      style={{ width: "20px", marginLeft: "5px" }}
                      src="/images/pixel.png"
                    />
                  </a>
                </h3>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <Tippy
                placement="bottom"
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Confirmar suscripción
                  </h1>
                }
              >
                <button
                  onClick={() => handleSubmit()}
                  className="dropdownconfirm-button-sub"
                >
                  {" "}
                  Confirmar
                </button>
              </Tippy>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <ul
        className={
          click ? "dropdownconfirm-menu clicked" : "dropdownconfirm-menu"
        }
      >
        <div style={{ width: "99%" }} className="dropdownconfirm-container">
          {getdropdownconfirm()}
        </div>
      </ul>
    </>
  );
}

export default SuscriptionConfirm;
