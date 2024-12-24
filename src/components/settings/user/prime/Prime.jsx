import React, { useState, useEffect } from "react";

import Emblem from "../../../emblem/Emblem";

import "./Prime.css";

import PurchasePrimePopup from "./popup/PurchasePrimePopup";

export default function Prime() {
  const [showPopup, setShowPopup] = useState(false);

  function togglePopup() {
    setShowPopup(!showPopup);
  }

  return (
    <div className="usersettings-prime-body">
      <div className="usersettings-prime-container">
        <h2>
          <a style={{ fontFamily: "Poppins" }}>
            {" "}
            <img
              style={{ width: "98px", position: "relative", top: "4px" }}
              src="/images/logo.png"
              alt="Pinkker Logo"
            />{" "}
            PRIME{" "}
            <img
              style={{
                width: "20px",
                borderRadius: "50px",
                position: "relative",
                left: "-52px",
                top: "-16px",
                transform: "rotate(-3deg)",
              }}
              src="https://res.cloudinary.com/pinkker/image/upload/v1677783657/emblem/PRIME_PINKKER-removebg-preview_v9zr03.png"
            />
          </a>{" "}
        </h2>
        <p
          style={{
            lineHeight: "18px",
            marginTop: "5px",
            color: "lightgray",
            fontSize: "18px",
          }}
        >
          Disfruta beneficios en la plataforma con Pinkker Prime!
        </p>

        <div style={{ marginTop: "30px" }}>
          <h3>Suscripción gratis!</h3>
          <p style={{ fontSize: "15px", marginTop: "10px" }}>
            Obtienes una suscripción gratis a cualquier canal que tu eligas
          </p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>Emblema de Prime exclusivo!</h3>
          <Emblem
            imageWidth={"25px"}
            style={{ marginTop: "10px" }}
            name="Pinkker Prime"
            img="https://www.pinkker.tv/uploads/assets/pinkkerprime.png"
          />
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>Sin anuncios!</h3>
          <p style={{ fontSize: "15px", marginTop: "10px" }}>
            No tendras anuncios en la plataforma{" "}
            <i style={{ marginLeft: "5px" }} class="fas fa-ban" />
          </p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h3>Colores exclusivos en el chat!</h3>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <Emblem
              imageWidth={"17px"}
              style={{ marginRight: "5px" }}
              name="Pinkker Prime"
              img="https://www.pinkker.tv/uploads/assets/pinkkerprime.png"
            />
            <a
              style={{
                background:
                  "url(https://res.cloudinary.com/pinkker/image/upload/v1677784906/naming/colaborador_qwwmv6.gif) no-repeat",
                backgroundPositionY: "-10px",
                fontSize: "15px",
                color: "#D500FF",
                textShadow: "0 0 8px",
                fontWeight: "600",
              }}
            >
              brunoPereyra:{" "}
            </a>
            <a
              style={{ color: "#ededed", fontSize: "13px", marginLeft: "5px" }}
            >
              Ahora soy Pinkker Prime!
            </a>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <Emblem
              imageWidth={"17px"}
              style={{ marginRight: "5px" }}
              name="Pinkker Prime"
              img="https://www.pinkker.tv/uploads/assets/pinkkerprime.png"
            />
            <a
              style={{
                background:
                  "url(https://res.cloudinary.com/pinkker/image/upload/v1677825934/naming/admin1_mhgt70.gif) no-repeat",
                backgroundPositionY: "-10px",
                fontSize: "15px",
                color: "#FF0000",
                textShadow: "0 0 8px",
                fontWeight: "600",
              }}
            >
              brunoPereyra:{" "}
            </a>
            <a
              style={{ color: "#ededed", fontSize: "13px", marginLeft: "5px" }}
            >
              Ahora soy Pinkker Prime!
            </a>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
          >
            <Emblem
              imageWidth={"17px"}
              style={{ marginRight: "5px" }}
              name="Pinkker Prime"
              img="https://www.pinkker.tv/uploads/assets/pinkkerprime.png"
            />
            <a
              style={{
                background:
                  "url(https://res.cloudinary.com/pinkker/image/upload/v1677825961/naming/moderador_hx3n6w.gif) no-repeat",
                backgroundPositionY: "-10px",
                fontSize: "15px",
                color: "#82CD00",
                textShadow: "0 0 8px",
                fontWeight: "600",
              }}
            >
              brunoPereyra:{" "}
            </a>
            <a
              style={{ color: "#ededed", fontSize: "13px", marginLeft: "5px" }}
            >
              Ahora soy Pinkker Prime!
            </a>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
          }}
        >
          <button
            onClick={() => togglePopup()}
            className="usersettings-prime-button pink-button"
          >
            Obtener ahora
          </button>
        </div>
      </div>

      {showPopup && <PurchasePrimePopup closePopup={togglePopup} />}
    </div>
  );
}
