import React, { useState, useEffect } from "react";
import "./Dashboard.css";

import { useSelector } from "react-redux";

import VodCard from "../card/VodCard";
import ClipCard from "../card/ClipCard";

import { Link } from "react-router-dom";

export default function Dashboard({ isMobile }) {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchData = async () => {};

    fetchData();
  }, [user, token]);

  function getWidthPercentagePerFollowers() {
    if (user.followers.length >= 100) {
      return "100%";
    } else {
      return user.followers.length / 1 + "%";
    }
  }

  return (
    <div className="dashboard-body">
      <div className="background-container">
        <div class="stars"></div>
        <div class="twinkling"></div>
        <div class="clouds"></div>
      </div>
      <div className="dashboard-container">
        <div style={{ height: "100px" }} />

        <div>
          <h3 style={{ fontSize: "28px" }}>¡Hola de nuevo, {user.name}!</h3>
          <h4 style={{ marginTop: "50px" }}>
            ¡Te ayudamos a hacer crecer tu comunidad!
          </h4>
          <p style={{ marginTop: "5px", fontSize: "14px" }}>
            Conecta e interactúa con los espectadores y construye una comunidad
            en torno a tus pasiones.
          </p>
        </div>

        <div className="dashboard-logro-card-container">
          <div
            style={{ width: "400px", display: "flex", alignItems: "center" }}
            className="dashboard-logro-card"
          >
            <img
              style={{ width: "105px", marginLeft: "10px" }}
              src="/images/pinkker-trabajando.png"
            />
            <div style={{ marginLeft: "20px" }}>
              <h3>Proximo Logro</h3>
              <p style={{ fontWeight: "800", marginTop: "10px" }}>
                PRENDER POR PRIMERA VEZ!
              </p>
            </div>
          </div>
          <div style={{ width: "275px" }} className="dashboard-logro-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
              }}
            >
              <i style={{ fontSize: "44px" }} class="fas fa-globe-europe" />
              <h3
                style={{
                  fontSize: "44px",
                  fontFamily: "Poppins",
                  color: "#ff60b2",
                }}
              >
                {user.followers && user.followers.length}
              </h3>
            </div>
            <div style={{ marginTop: "20px", padding: "10px" }}>
              <p style={{ fontSize: "14px" }}>Consigue 100 seguidores</p>
              <div
                style={{
                  width: "100%",
                  marginTop: "20px",
                  backgroundColor: "#101010",
                  height: "15px",
                  borderRadius: "50px",
                }}
              ></div>
              <div
                style={{
                  width: user.followers && getWidthPercentagePerFollowers(),
                  position: "relative",
                  top: "-15px",
                  backgroundColor: "#ff60b2",
                  height: "15px",
                  borderRadius: "50px",
                }}
              ></div>
            </div>
          </div>
          <div style={{ width: "275px" }} className="dashboard-logro-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
              }}
            >
              <i style={{ fontSize: "44px" }} class="fas fa-people-arrows" />
              <h3
                style={{
                  fontSize: "44px",
                  fontFamily: "Poppins",
                  color: "#ff60b2",
                }}
              >
                0
              </h3>
            </div>
            <div style={{ marginTop: "20px", padding: "10px" }}>
              <p style={{ fontSize: "14px" }}>
                Consigue una media de 10 espectadores
              </p>
              <div
                style={{
                  width: "100%",
                  marginTop: "20px",
                  backgroundColor: "#101010",
                  height: "15px",
                  borderRadius: "50px",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3 style={{ fontSize: "24px" }}>Consejo del día</h3>
          <div
            style={{
              padding: "20px",
              display: "flex",
              marginTop: "10px",
              height: "100px",
            }}
            className="dashboard-logro-card"
          >
            <div>
              <h5>¡SÉ NATURAL Y DIVIÉRTETE!</h5>
              <p style={{ marginTop: "10px", width: "80%" }}>
                La gente viene a Pinkker para verte a ti. Intenta ser natural,
                diviértete y disfruta del proceso.
              </p>
              <p style={{ width: "80%" }}>
                Las mayores aventuras comienzan con pasos pequeños. No te
                preocupes si tardas en conseguir tus primeros espectadores, es
                parte del proceso.
              </p>
            </div>
            <div>
              <img
                style={{ width: "170px", position: "relative", top: "20px" }}
                src="/images/pinkker-ups.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
