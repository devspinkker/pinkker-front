import React, { useState, useEffect } from "react";

import "./About.css";

import { useSelector } from "react-redux";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import Emblem from "../../emblem/Emblem";

export default function About({ streamer }) {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [type, setType] = useState(0);

  function getColorFromName(color) {
    if (color === "#bebebe") {
      return "white";
    }
    if (color === "#dda4a7") {
      return "pink";
    }
    if (color === "#a1d1a3") {
      return "green";
    }
    if (color === "#ddd59d") {
      return "yellow";
    }
    if (color === "#659dab") {
      return "#lightblue";
    }
    if (color === "#dd7e0e") {
      return "orange";
    }
    if (color === "#cc4f45") {
      return "red";
    }
    if (color === "#44698b") {
      return "blue";
    }
    if (color === "#6c4e7c") {
      return "violet";
    }
  }

  function getIdentityEmblem() {
    if (user.name === streamer.name) {
      return <Emblem name="Emisor" img={"/images/emblem/emisor.jpg"} />;
    }
  }

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const getZodiacSign = (dateS) => {
    const date = new Date(dateS);
  
    const days = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 21]; // Último día de cada signo
    const signs = [
      "Capricornio", // Diciembre 22 - Enero 19
      "Acuario",     // Enero 20 - Febrero 18
      "Piscis",      // Febrero 19 - Marzo 20
      "Aries",       // Marzo 21 - Abril 19
      "Tauro",       // Abril 20 - Mayo 20
      "Geminis",     // Mayo 21 - Junio 20
      "Cancer",      // Junio 21 - Julio 22
      "Leo",         // Julio 23 - Agosto 22
      "Virgo",       // Agosto 23 - Septiembre 22
      "Libra",       // Septiembre 23 - Octubre 22
      "Escorpio",    // Octubre 23 - Noviembre 21
      "Sagitario",   // Noviembre 22 - Diciembre 21
    ];
  
    let month = date.getMonth(); // Meses van de 0 a 11
    let day = date.getDate(); // Día del mes
  
    // Ajustar el mes si el día es menor o igual al límite
    if (day <= days[month]) {
      month = month === 0 ? 11 : month - 1;
    }
  
    return signs[month];
  };

  function getType() {
    if (type === 0) {
      return (
        <div className="channel-about-secondary">
          <div className="channel-about-secondary-card">
            <h4 style={{ fontFamily: "Poppins" }}>Nombre</h4>
            <p style={{ color: "darkgray" }}>{streamer.NameUser}</p>
          </div>
          <div className="channel-about-secondary-card">
            <h4 style={{ fontFamily: "Poppins" }}>Biografía</h4>
            <p style={{ color: "darkgray" }}>{streamer.biography}</p>
          </div>
          <div className="channel-about-secondary-card">
            <h4 style={{ fontFamily: "Poppins" }}>Edad</h4>
            <p style={{ color: "darkgray" }}>
              {getAge(streamer.birthDate)} años
            </p>
          </div>
          <div className="channel-about-secondary-card">
            <h4 style={{ fontFamily: "Poppins" }}>Nacionalidad</h4>
            <p style={{ color: "darkgray" }}>Argentina</p>
          </div>

          <div className="channel-about-secondary-card">
            <h4 style={{ fontFamily: "Poppins" }}>Signo zodiacal</h4>
            <p style={{ color: "darkgray" }}>
              {getZodiacSign(streamer.birthDate)}
            </p>
          </div>
          <div className="channel-about-secondary-card">
            <h4 style={{ fontFamily: "Poppins" }}>Situación sentimental</h4>
            <p style={{ color: "darkgray" }}>Soltero</p>
          </div>
          <div className="channel-about-secondary-card">
            <h4 style={{ fontFamily: "Poppins" }}>Color</h4>
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Color {getColorFromName(streamer.color)}
                </h1>
              }
            >
              <div
                style={{
                  backgroundColor: streamer.color,
                  height: "30px",
                  width: "30px",
                  borderRadius: "3px",
                }}
              />
            </Tippy>
          </div>
        </div>
      );
    }

    if (type === 1) {
      return (
        <div className="channel-about-secondary">
          <div className="channel-about-secondary-card">
            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={"https://instagram.com/" + streamer.socialnetwork.instagram}
            >
              <p
                style={{
                  color: "#ededed",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  width="35px"
                  height="33px"
                  viewBox="0 0 20 22"
                  version="1.1"
                  x="0px"
                  y="0px"
                  class="ScSvg-sc-1hrsqw6-1 ihOSMR"
                >
                  <g>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10 5.892a4.108 4.108 0 100 8.216 4.108 4.108 0 000-8.216zm0 6.774a2.667 2.667 0 110-5.333 2.667 2.667 0 010 5.333z"
                      fill="white"
                    ></path>
                    <path
                      d="M15.23 5.73a.96.96 0 11-1.92 0 .96.96 0 011.92 0z"
                      fill="white"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10 2c-2.173 0-2.445.01-3.299.048-.851.039-1.432.174-1.941.372a3.918 3.918 0 00-1.417.923c-.445.445-.719.89-.923 1.417-.198.509-.333 1.09-.372 1.941C2.01 7.555 2 7.827 2 10s.01 2.445.048 3.298c.039.852.174 1.433.372 1.942.205.526.478.972.923 1.417.445.445.89.718 1.417.923.509.198 1.09.333 1.942.372C7.555 17.99 7.827 18 10 18s2.445-.01 3.298-.048c.852-.039 1.434-.174 1.942-.372a3.918 3.918 0 001.417-.923 3.92 3.92 0 00.923-1.417c.198-.509.333-1.09.372-1.942.039-.853.048-1.125.048-3.298s-.01-2.445-.048-3.299c-.039-.851-.174-1.433-.372-1.941a3.918 3.918 0 00-.923-1.417 3.92 3.92 0 00-1.417-.923c-.51-.198-1.09-.333-1.942-.372C12.445 2.01 12.172 2 10 2zm0 1.441c2.136 0 2.389.009 3.232.047.78.036 1.204.166 1.486.275.373.146.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.844.047 1.097.047 3.233s-.008 2.389-.047 3.232c-.035.78-.165 1.204-.275 1.486-.145.373-.319.64-.598.92-.28.28-.547.454-.92.598-.282.11-.706.24-1.486.276-.843.038-1.096.046-3.232.046s-2.39-.008-3.233-.046c-.78-.036-1.203-.166-1.485-.276a2.481 2.481 0 01-.92-.598 2.474 2.474 0 01-.599-.92c-.11-.282-.24-.706-.275-1.486-.038-.843-.047-1.096-.047-3.232s.009-2.39.047-3.233c.036-.78.166-1.203.275-1.485.145-.374.319-.64.599-.92.28-.28.546-.454.92-.599.282-.11.705-.24 1.485-.275.844-.038 1.097-.047 3.233-.047z"
                      fill="white"
                    ></path>
                  </g>
                </svg>

                {streamer.socialnetwork.instagram
                  ? "@" + streamer.socialnetwork.instagram
                  : "A configurar"}
              </p>
            </a>
          </div>
          <div className="channel-about-secondary-card">
            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={"https://tiktok.com/" + streamer.socialnetwork.tiktok}
            >
              <p
                style={{
                  color: "#ededed",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  width="36px"
                  height="36px"
                  version="1.1"
                  viewBox="0 0 20 20"
                  x="0px"
                  y="0px"
                  class="ScSvg-sc-1hrsqw6-1 ihOSMR"
                >
                  <path
                    d="M16.839 8.473a4.273 4.273 0 0 1-3.968-1.912v6.578a4.861 4.861 0 1 1-4.86-4.862c.102 0 .202.01.301.015v2.396c-.1-.012-.198-.031-.3-.031a2.48 2.48 0 1 0 0 4.961c1.37 0 2.58-1.08 2.58-2.45L10.616 2h2.291a4.269 4.269 0 0 0 3.935 3.81v2.663"
                    fill="white"
                  ></path>
                </svg>
                {streamer.socialnetwork.tiktok
                  ? "@" + streamer.socialnetwork.tiktok
                  : "A configurar"}
              </p>
            </a>
          </div>
          <div className="channel-about-secondary-card">
            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={"https://twitter.com/" + streamer.socialnetwork.twitter}
            >
              <p
                style={{
                  color: "#ededed",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  width="35px"
                  height="35px"
                  version="1.1"
                  viewBox="0 0 20 20"
                  x="0px"
                  y="0px"
                  class="ScSvg-sc-1hrsqw6-1 ihOSMR"
                >
                  <g>
                    <path
                      fill="white"
                      d="M19 3.844a7.07 7.07 0 01-2.12.62 3.912 3.912 0 001.623-2.178 7.075 7.075 0 01-2.345.955 3.613 3.613 0 00-2.694-1.24c-2.04 0-3.694 1.76-3.694 3.94 0 .31.037.61.1.9C6.8 6.668 4.078 5.1 2.253 2.72c-.33.606-.5 1.286-.498 1.977 0 1.363.653 2.567 1.643 3.273a3.49 3.49 0 01-1.672-.493v.05c0 1.906 1.272 3.496 2.963 3.857-.55.156-1.12.18-1.67.067.47 1.57 1.83 2.7 3.45 2.73a7.07 7.07 0 01-5.47 1.63 9.954 9.954 0 005.66 1.77c6.79 0 10.51-5.99 10.51-11.19 0-.17-.01-.34-.01-.51.73-.56 1.35-1.25 1.84-2.03"
                    ></path>
                  </g>
                </svg>
                {streamer.socialnetwork.twitter
                  ? "@" + streamer.socialnetwork.twitter
                  : "A configurar"}
              </p>
            </a>
          </div>{" "}
          <div className="channel-about-secondary-card">
            <a
              style={{ textDecoration: "none" }}
              target={"_blank"}
              href={"https://youtube.com/" + streamer.socialnetwork.youtube}
            >
              <p
                style={{
                  color: "#ededed",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="1 1 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.1601 4.905C14.0101 4.35 13.5751 3.915 13.0251 3.77C12.0201 3.5 8.00007 3.5 8.00007 3.5C8.00007 3.5 3.98007 3.5 2.97507 3.77C2.42007 3.92 1.98507 4.355 1.84007 4.905C1.57007 5.91 1.57007 8 1.57007 8C1.57007 8 1.57007 10.09 1.84007 11.095C1.99007 11.65 2.42507 12.085 2.97507 12.23C3.98007 12.5 8.00007 12.5 8.00007 12.5C8.00007 12.5 12.0201 12.5 13.0251 12.23C13.5801 12.08 14.0151 11.645 14.1601 11.095C14.4301 10.09 14.4301 8 14.4301 8C14.4301 8 14.4301 5.91 14.1601 4.905ZM6.40007 10.295V5.705L10.3701 8L6.40007 10.295Z"
                    fill="currentColor"
                  ></path>
                </svg>
                {streamer.socialnetwork.youtube
                  ? "@" + streamer.socialnetwork.youtube
                  : "A configurar"}
              </p>
            </a>
          </div>
        </div>
      );
    }

    if (type === 2) {
      return (
        <div className="channel-about-secondary">
          <h3>Placas</h3>
          <div className="channel-about-emblem-container">
            {getIdentityEmblem()}
          </div>
        </div>
      );
    }

    if (type === 3) {
      return (
        <div className="channel-about-secondary">
          <h3>Intereses</h3>
        </div>
      );
    }
  }

  return (
    <div className="channel-about-body">
      <div className="channel-about-primary">
        <h3 style={{ fontFamily: "Poppins", padding: "5px" }}>Información</h3>

        <div
          style={{ width: "90%" }}
          onClick={() => setType(0)}
          className={
            type === 0
              ? "channel-about-primary-card-active"
              : "channel-about-primary-card"
          }
        >
          <h5>Detalles sobre ti</h5>
        </div>

        <div
          style={{ width: "90%" }}
          onClick={() => setType(1)}
          className={
            type === 1
              ? "channel-about-primary-card-active"
              : "channel-about-primary-card"
          }
        >
          <h5>Redes</h5>
        </div>

        {/* <div
          style={{ width: "90%" }}
          onClick={() => setType(2)}
          className={
            type === 2
              ? "channel-about-primary-card-active"
              : "channel-about-primary-card"
          }
        >
          <h5>Emblemas</h5>
        </div> */}

        <div
          style={{ width: "90%" }}
          onClick={() => setType(3)}
          className={
            type === 3
              ? "channel-about-primary-card-active"
              : "channel-about-primary-card"
          }
        >
          <h5>Intereses</h5>
        </div>
      </div>

      {getType()}
    </div>
  );
}
