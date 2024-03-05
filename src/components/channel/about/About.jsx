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

  const findSignName = (dateS) => {
    const date = new Date(dateS);
    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = [
      "Aquario",
      "Piscis",
      "Aries",
      "Tauro",
      "Geminis",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Escorpio",
      "Sagitario",
      "Capricornio",
    ];
    let month = date.getMonth();
    let day = date.getDate();
    if (month == 0 && day <= 20) {
      month = 11;
    } else if (day < days[month]) {
      month--;
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
              {findSignName(streamer.birthDate)}
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
                <img style={{ marginRight: "10px" }} src="/images/IG.png" />{" "}
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
                <img style={{ marginRight: "10px" }} src="/images/tiktok.png" />{" "}
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
                <img
                  style={{ marginRight: "10px" }}
                  src="/images/twitter.png"
                />{" "}
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

        <div
          style={{ width: "90%" }}
          onClick={() => setType(2)}
          className={
            type === 2
              ? "channel-about-primary-card-active"
              : "channel-about-primary-card"
          }
        >
          <h5>Emblemas</h5>
        </div>

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
