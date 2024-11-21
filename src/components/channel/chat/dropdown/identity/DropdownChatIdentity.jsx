import React, { useState, useEffect } from "react";
import "./DropdownChatIdentity.css";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Tippy from "@tippyjs/react";

import Emblem from "../../../../emblem/Emblem";
import { ActionIdentidadUser } from "../../../../../services/backGo/chat";

function DropdownChatIdentity({
  closeNavbar,
  userMod,
  userVip,
  chatData,
  user,
}) {
  const isSubscriptor = (dt) => {
    if (dt.Subscription != "000000000000000000000000") {
      return "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404309/Emblemas/SUBSCRIPTOR.jpg_pxzloq.png";
    }
    return null;
  };
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const [type, setType] = useState(0);

  const [pauseChat, setPauseChat] = useState(false);

  const chatTextSize = localStorage.getItem("chatTextSize");

  const { streamer } = useParams();

  async function handleChangeColor(color) {
    let token = window.localStorage.getItem("token");
    if (token) {
      await ActionIdentidadUser(chatData?.Room, color, "", token);
      closeNavbar();
    }
  }
  async function handleChangeEmblema(Emblema) {
    
    let token = window.localStorage.getItem("token");
    if (token) {
      await ActionIdentidadUser(chatData?.Room, "", Emblema, token);
      closeNavbar();
    }
  }

  const findSign = (dateS) => {
    const date = new Date(dateS);
    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = [
      "/images/signos/aquario.jpg",
      "/images/signos/piscis.jpg",
      "/images/signos/aries.jpg",
      "/images/signos/tauro.jpg",
      "/images/signos/geminis.jpg",
      "/images/signos/cancer.jpg",
      "/images/signos/leo.jpg",
      "/images/signos/virgo.jpg",
      "/images/signos/libra.jpg",
      "/images/signos/escorpio.jpg",
      "/images/signos/sagitario.jpg",
      "/images/signos/capricornio.jpg",
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

  // function getIdentityEmblem() {
  //   return (
  //     <a>
  //       {user?.Partner?.active === true && (
  //         <Emblem
  //           chat={true}
  //           name="Pinkker Prime"
  //           img={
  //             "https://res.cloudinary.com/pinkker/image/upload/v1677782920/emblem/PRIME_PINKKER_fwsdcm.png"
  //           }
  //         />
  //       )}
  //       {user?.NameUser === streamer && (
  //         <Emblem chat={true} name="Emisor" img={"/images/emblem/emisor.jpg"} />
  //       )}
  //       {userMod && (
  //         <Emblem
  //           chat={true}
  //           name="Moderador"
  //           img={"/images/emblem/moderador.jpg"}
  //         />
  //       )}
  //       {userVip && (
  //         <Emblem chat={true} name="VIP" img={"/images/emblem/vip.jpg"} />
  //       )}
  //       {chatData?.SubscriptionInfo && (
  //         <Emblem
  //           chat={true}
  //           name="Suscriptor"
  //           img={"/images/emblem/subscriptor.jpg"}
  //         />
  //       )}
  //     </a>
  //   );
  // }

  function getBackgroundColorPrime() {
    if (user?.color === "#D500FF") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677784906/naming/colaborador_qwwmv6.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }

    if (user?.color === "#FF0000") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825934/naming/admin1_mhgt70.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }

    if (user?.color === "#82CD00") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825961/naming/moderador_hx3n6w.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }
  }
  // Definir las imágenes de los signos zodiacales
  
  const zodiacImages = {
    CAPRICORNIO: "/images/signos/capricornio.jpg",
    ACUARIO: "/images/signos/aquario.jpg",
    PISCIS: "/images/signos/piscis.jpg",
    ARIES: "/images/signos/aries.jpg",
    TAURO: "/images/signos/tauro.jpg",
    GEMINIS: "/images/signos/geminis.jpg",
    CANCER: "/images/signos/cancer.jpg",
    LEO: "/images/signos/leo.jpg",
    VIRGO: "/images/signos/virgo.jpg",
    LIBRA: "/images/signos/libra.jpg",
    ESCORPIO: "/images/signos/escorpio.jpg",
    SAGITARIO: "/images/signos/sagitario.jpg",
  };

  // Función para calcular el signo zodiacal
  const getZodiacSign = (dateS) => {
    const date = new Date(dateS);

    const days = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 21]; // Último día de cada signo
    const signs = [
      "CAPRICORNIO",
      "ACUARIO",
      "PISCIS",
      "ARIES",
      "TAURO",
      "GEMINIS",
      "CANCER",
      "LEO",
      "VIRGO",
      "LIBRA",
      "ESCORPIO",
      "SAGITARIO",
    ];

    let month = date.getMonth(); // Meses van de 0 a 11
    let day = date.getDate(); // Día del mes

    if (day <= days[month]) {
      month = month === 0 ? 11 : month - 1;
    }

    return signs[month];
  };


  const zodiacSign = getZodiacSign(user?.birthDate);
  console.log('zodiacSign', zodiacSign)
  const zodiacImage = zodiacImages[zodiacSign] || 'https://static.twitchcdn.net/assets/dark-40f6c299eb07b670b88d.svg'; // Imagen predeterminada si no encuentra el signo

  function getdropdownchatidentity() {
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
              <h3 style={{ width: "85%" }}>Identidad en el chat</h3>
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
          <p
            style={{
              fontFamily: "Inter",
              color: "darkgray",
              fontWeight: "600",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            Vista previa de la identidad
          </p>
          <p
            style={{
              fontFamily: "Inter",
              color: "white",
              fontWeight: "600",
              padding: "5px",
              fontSize: "12px",
            }}
          >
            Cómo aparecerá tu nombre en el chat de {streamer}:
          </p>
          <div className="showinChat">
            <div className="badges">
              {chatData?.Identidad && <img src={chatData?.Identidad} alt="" />}
              {chatData?.EmblemasChat?.Moderator && (
                <img src={chatData?.EmblemasChat?.Moderator} alt="" />
              )}
              {chatData?.EmblemasChat?.Verified && (
                <img src={chatData?.EmblemasChat?.Verified} alt="" />
              )}
              {chatData?.EmblemasChat?.Vip && (
                <img src={chatData?.EmblemasChat?.Vip} alt="" />
              )}
              {chatData && isSubscriptor(chatData) && (
                <img src={isSubscriptor(chatData)} alt="" />
              )}
              {chatData?.StreamerChannelOwner && (
                <img
                  src={
                    "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/OWNER_ixhnvh.jpg "
                  }
                  alt="StreamerChannelOwner"
                />
              )}
            </div>{" "}
            <h3
              style={{
                fontFamily: "Inter",
                color: user?.color ? user?.color : "white",
                fontWeight: "600",
                padding: "5px",
                fontSize: "14px",
              }}
            >
              <a style={{ ...getBackgroundColorPrime(), fontWeight: "600" }}>
                {user?.NameUser}
              </a>
            </h3>
          </div>

          {/* 
          <div className="dropdownchatidentity-container-second">
            <p
              style={{
                fontFamily: "Inter",
                color: "darkgray",
                fontWeight: "100",
                padding: "5px",
                fontSize: "14px",
              }}
            >
              Emblema Global
            </p>
            <p
              style={{
                fontFamily: "Inter",
                color: "white",
                fontWeight: "100",
                padding: "5px",
                fontSize: "12px",
              }}
            >
              Este emblema aparece en todos los canales y susurros.
            </p>
            <Emblem
              style={{
                width: "20px",
                textAlign: "center",
                padding: "3px",
                marginLeft: "5px",
                marginTop: "5px",
                backgroundColor: "#040404",
                borderRadius: "2px",
                border: "1px solid white",
                marginRight: "2px",
              }}
              name={findSignName(user.birthDate)}
              img={findSign(user.birthDate)}
            />
          </div> */}
          <div className="dropdownchatidentity-container-second">
            <p
              style={{
                fontFamily: "Inter",
                color: "darkgray",
                fontWeight: "600",
                padding: "5px",
                fontSize: "14px",
              }}
            >
              Emblemas del canal
            </p>
            <p
              style={{
                fontFamily: "Inter",
                color: "white",
                fontWeight: "600",
                padding: "5px",
                fontSize: "12px",
              }}
            >
              Estos emblemas aparecen en el canal de {streamer}.
            </p>
            <div className="content-indentidades">
              <div
                onClick={() => handleChangeEmblema("")}
                className="sinEmblema"
              >
                <svg
                  className="dropdownchatidentity-card-emote"
                  style={{
                    marginTop: "0px",
                    padding: "3px",
                  }}
                  width="25"
                  height="25"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="grey"
                    fillRule="evenodd"
                    d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                onClick={() => handleChangeEmblema(zodiacSign)}
                className="emblemamute"
              >
                <img
                  className="dropdownchatidentity-card-emote"
                  src={zodiacImage}
                />
              </div>
            </div>
          </div>
          <div className="dropdownchatidentity-container-second">
            <p
              style={{
                fontFamily: "Inter",
                color: "darkgray",
                fontWeight: "600",
                padding: "5px",
                fontSize: "14px",
              }}
            >
              Color del nombre global
            </p>
            <p
              style={{
                fontFamily: "Inter",
                color: "white",
                fontWeight: "600",
                padding: "5px",
                fontSize: "12px",
              }}
            >
              Elige un color, el que más te guste. Pueden pasar varios minutos
              hasta que el color se actualice en la sala de chat.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color red
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("red")}
                  style={{ backgroundColor: "#cc4f45" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color blue
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#44698b")}
                  style={{ backgroundColor: "#44698b" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color green
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#a1d1a3")}
                  style={{ backgroundColor: "#a1d1a3" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color yellow
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#ddd59d")}
                  style={{ backgroundColor: "#ddd59d" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color pink
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#dda4a7")}
                  style={{ backgroundColor: "#dda4a7" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color lightblue
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#659dab")}
                  style={{ backgroundColor: "#659dab" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color orange
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#dd7e0e")}
                  style={{ backgroundColor: "#dd7e0e" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color violet
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#6c4e7c")}
                  style={{ backgroundColor: "#6c4e7c" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Color white
                  </h1>
                }
              >
                <div
                  onClick={() => handleChangeColor("#bebebe")}
                  style={{ backgroundColor: "#bebebe" }}
                  className="dropdownchatidentity-container-second-color"
                />
              </Tippy>
            </div>

            {/* <div className="dropdownchatidentity-container-second">
              <p
                style={{
                  fontFamily: "Inter",
                  color: "darkgray",
                  fontWeight: "100",
                  padding: "5px",
                  fontSize: "14px",
                }}
              >
                Pinkker Prime Colores
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  color: "white",
                  fontWeight: "100",
                  padding: "5px",
                  fontSize: "12px",
                }}
              >
                Colores exclusivos para los Pinkker Prime.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Color Prime #1
                    </h1>
                  }
                >
                  <div
                    onClick={() => handleChangeColor("PRIME1")}
                    style={{
                      backgroundColor: "#D500FF",
                      borderRadius: "100px",
                      width: "30px",
                      height: "30px",
                      marginRight: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "url(https://res.cloudinary.com/pinkker/image/upload/v1677784906/naming/colaborador_qwwmv6.gif) no-repeat",
                        backgroundPositionY: "-10px",
                        marginTop: "0px",
                        marginLeft: "0px",
                      }}
                      className="dropdownchatidentity-container-second-color"
                    />
                  </div>
                </Tippy>
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Color Prime #2
                    </h1>
                  }
                >
                  <div
                    onClick={() => handleChangeColor("PRIME2")}
                    style={{
                      backgroundColor: "#FF0000",
                      borderRadius: "100px",
                      width: "30px",
                      height: "30px",
                      marginRight: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825934/naming/admin1_mhgt70.gif) no-repeat",
                        backgroundPositionY: "-10px",
                        marginTop: "0px",
                        marginLeft: "0px",
                      }}
                      className="dropdownchatidentity-container-second-color"
                    />
                  </div>
                </Tippy>
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Color Prime #3
                    </h1>
                  }
                >
                  <div
                    onClick={() => handleChangeColor("PRIME3")}
                    style={{
                      backgroundColor: "#82CD00",
                      borderRadius: "100px",
                      width: "30px",
                      height: "30px",
                      marginRight: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        background:
                          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825961/naming/moderador_hx3n6w.gif) no-repeat",
                        backgroundPositionY: "-10px",
                        marginTop: "0px",
                        marginLeft: "0px",
                      }}
                      className="dropdownchatidentity-container-second-color"
                    />
                  </div>
                </Tippy>
              </div>
            </div> */}
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <ul
        className={
          click
            ? "dropdownchatidentity-menu clicked"
            : "dropdownchatidentity-menu"
        }
      >
        <div
          style={{ width: "99%" }}
          className="dropdownchatidentity-container"
        >
          {getdropdownchatidentity()}
        </div>
      </ul>
    </>
  );
}

export default DropdownChatIdentity;
