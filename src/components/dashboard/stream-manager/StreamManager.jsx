import React, { useState, useEffect } from "react";

import "./StreamManager.css";

import Activity from "./activity/Activity";
import Chat from "../../channel/chat/Chat";

import { getUser } from "../../../services/follow";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Card from "./card/Card";
import PopupEditInfo from "./popup/PopupEditInfo";

import { getStream } from "../../../services/stream";

import CustomPlayer from "../../customPlayer/customPlayer";

import { getCategorieByName } from "../../../services/categories";

import Tippy from "@tippyjs/react";

import { useNotification } from "../../Notifications/NotificationProvider";

import io from "socket.io-client";

import { restoreKey } from "../../../services/user";

import MostrarPopup from "./popup/MostrarPopup";
import { getStreamById } from "../../../services/backGo/streams";
import { getUserByIdTheToken } from "../../../services/backGo/user";

let socket;
export default function StreamManager({ isMobile, socketMain, handleMessage }) {
  const [streamerData, setStreamerData] = useState(null);
  const { streamer } = useParams();

  const auth = useSelector((state) => state.auth);
  const [userSe, SetuserSe] = useState(null);
  const token = useSelector((state) => state.token);

  const [showPopupEditInfo, setShowPopupEditInfo] = useState(false);
  const [stream, setStream] = useState(null);

  const [categorie, setCategorie] = useState(null);

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const alert = useNotification();

  const ENDPOINT = process.env.REACT_APP_DEV_CHAT_URL;

  const [showPopupMostrar, setShowPopupMostrar] = useState(false);

  function handleShowPopupMostrar() {
    setShowPopupMostrar(!showPopupMostrar);
  }

  useEffect(() => {
    const fetchData = async () => {
      let id = window.localStorage.getItem("_id");
      let token = window.localStorage.getItem("token");

      let resuser = await getUserByIdTheToken(token);
      if (resuser.message == "ok") {
        console.log(resuser.data);
        SetuserSe(resuser.data);
      }

      const dataStreamer = await getStreamById(id);
      if (dataStreamer != null && dataStreamer != undefined) {
        setStreamerData(dataStreamer.data);
      }

      const res = await getStream(token);
      if (res != null && res != undefined) {
        setStream(res);

        const dataCategorie = await getCategorieByName(res.stream_category);
        if (dataCategorie != null && dataCategorie != undefined) {
          setCategorie(dataCategorie);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    loadDataOnlyOnce();
  }, [token]);

  const loadDataOnlyOnce = () => {
    // const name = userSe.name;
    // const room = streamer;
    // socket = io(ENDPOINT);
    // setName(name);
    // setRoom(room);
  };

  const array = [
    {
      name: "Editar información de la transmisión",
      color: "darkviolet",
      onclick: () => togglePopupEditInfo(),
    },
    { name: "Iniciar raid hacia el canal", color: "brown" },
  ];

  async function handleRestoreKey() {
    const data = await restoreKey(token);
    if (data != null && data != undefined) {
      userSe.keyTransmission = data.data.key;
      alert({ type: "SUCCESS", message: data.data.msg });
    }
  }

  function togglePopupEditInfo() {
    setShowPopupEditInfo(!showPopupEditInfo);
  }

  const copyToClipboard = (text) => {
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    alert({ type: "SUCCESS", message: "Copiado correctamente!" });
  };

  function getMobile() {
    return (
      <div style={{ height: "1300px", width: "100%" }}>
        <div style={{ height: "25px" }} />
        <div className="streammanager-content-1">
          <div>
            <div
              style={{ marginTop: "0px", marginBottom: "0px" }}
              className="settingstream-content"
            >
              <div style={{ height: "100px" }} className="settingstream-camp">
                <p style={{ color: "#ededed", fontSize: "18px" }}>
                  Clave de la transmisión principal
                </p>
                <div>
                  <div>
                    <input
                      value={"rtmp://pinkker.tv/live"}
                      className="settingstream-input"
                      style={{ width: "90%", fontSize: "16px" }}
                      type="text"
                    />
                    {/* <input
                      value={
                        userSe.keyTransmission &&
                        userSe.keyTransmission.substring(
                          4,
                          userSe.keyTransmission.length
                        ) +
                          "?token=" +
                          userSe.cmt
                      }
                      className="settingstream-input"
                      style={{ width: "90%", fontSize: "15px" }}
                      type={showPassword ? "text" : "password"}
                    /> */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                        position: "relative",
                        top: "-40px",
                        left: "-55px",
                      }}
                    >
                      <Tippy
                        placement="bottom"
                        theme="pinkker"
                        content={
                          <h1
                            style={{
                              fontSize: "12px",
                              fontFamily: "Montserrat",
                            }}
                          >
                            Copiar
                          </h1>
                        }
                      >
                        <button
                          onClick={() =>
                            copyToClipboard(
                              userSe.keyTransmission &&
                                userSe.keyTransmission.substring(
                                  4,
                                  userSe.keyTransmission.length
                                ) +
                                  "?token=" +
                                  userSe.cmt
                            )
                          }
                          className="button-copy"
                        >
                          <i class="fas fa-copy" />
                        </button>
                      </Tippy>
                      <Tippy
                        placement="bottom"
                        theme="pinkker"
                        content={
                          <h1
                            style={{
                              fontSize: "12px",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {showPassword ? "Ocultar" : "Mostrar"}
                          </h1>
                        }
                      >
                        <button
                          onClick={() => handleShowPopupMostrar()}
                          className="button-copy"
                        >
                          <i class="fas fa-eye" />
                        </button>
                      </Tippy>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#040404",
                padding: "10px",
                color: "#ededed",
                borderBottom: "1px solid #2b2b2b8f",
              }}
            >
              <h5>Atajos</h5>
            </div>

            <div>
              <div
                style={{ backgroundColor: "#ff60b2" }}
                onClick={() => togglePopupEditInfo()}
                className="streammanager-atajos-card"
              >
                <i
                  style={{ fontSize: "22px", color: "#ededed" }}
                  class="fas fa-edit"
                />
                <h4
                  style={{
                    fontSize: "18px",
                    color: "#ededed",
                    marginLeft: "5px",
                  }}
                >
                  Editar información de la transmisión
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="streammanager-content-2">
          <div style={{ height: "500px" }}>
            {streamerData && (
              <CustomPlayer
                dashboard={true}
                isMobile={isMobile}
                vod={false}
                streamer={streamer}
                width="100%"
                height="500px"
                left="0px"
              />
            )}
          </div>

          <div
            style={{
              backgroundColor: "transparent",
              padding: "10px",
              color: "#ededed",
              borderBottom: "1px solid #2b2b2b8f",
              height: "50px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              style={{ marginRight: "20px", width: "45px" }}
              src={categorie && categorie.image}
              alt=""
            />
            <div>
              <div style={{ display: "flex" }}>
                {streamerData &&
                  streamerData.stream_tag.map((tag) => (
                    <p className="channel-title-tag">#{tag}</p>
                  ))}
              </div>
              <h5>{streamerData && streamerData.stream_title}</h5>
              <h5 style={{ color: "gold" }}>
                {streamerData && streamerData.stream_category}
              </h5>
            </div>
          </div>

          <Activity />
        </div>
      </div>
    );
  }

  function renderStreamManager() {
    if (!isMobile) {
      return (
        <div className="streammanager-body">
          <div className="streammanager-content-1">
            <div>
              <div
                style={{
                  backgroundColor: "#040404",
                  padding: "10px",
                  color: "#ededed",
                  borderBottom: "1px solid #2b2b2b8f",
                }}
              >
                <h5>Atajos</h5>
              </div>

              <div
                style={{
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ backgroundColor: "#ff60b2" }}
                  onClick={() => togglePopupEditInfo()}
                  className="streammanager-atajos-card"
                >
                  <i
                    style={{ fontSize: "22px", color: "#ededed" }}
                    class="fas fa-edit"
                  />
                  <h4
                    style={{
                      fontSize: "18px",
                      color: "#ededed",
                      marginTop: "20px",
                    }}
                  >
                    Editar información de la transmisión
                  </h4>
                </div>

                <div
                  style={{ backgroundColor: "#606aff" }}
                  onClick={() => togglePopupEditInfo()}
                  className="streammanager-atajos-card"
                >
                  <i
                    style={{ fontSize: "22px", color: "#ededed" }}
                    class="fas fa-users"
                  />
                  <h4
                    style={{
                      fontSize: "18px",
                      color: "#ededed",
                      marginTop: "20px",
                    }}
                  >
                    Iniciar raid
                  </h4>
                </div>

                <div
                  style={{ backgroundColor: "#ff6060" }}
                  onClick={() => togglePopupEditInfo()}
                  className="streammanager-atajos-card"
                >
                  <i
                    style={{ fontSize: "22px", color: "#ededed" }}
                    class="fas fa-star"
                  />
                  <h4
                    style={{
                      fontSize: "18px",
                      color: "#ededed",
                      marginTop: "20px",
                    }}
                  >
                    Chat solo para suscriptores
                  </h4>
                </div>
              </div>

              <div className="settingstream-content">
                <div className="settingstream-camp">
                  <p style={{ color: "#ededed" }}>
                    Clave de la transmisión principal
                  </p>
                  <div>
                    <div>
                      <input
                        value={"rtmp://pinkker.tv/live"}
                        className="settingstream-input"
                        style={{ width: "90%", fontSize: "13px" }}
                        type="text"
                      />
                      {userSe != null ? (
                        <input
                          value={
                            userSe.keyTransmission &&
                            userSe.keyTransmission.substring(
                              4,
                              userSe.keyTransmission.length
                            ) +
                              "?token=" +
                              userSe.cmt
                          }
                          className="settingstream-input"
                          style={{ width: "90%", fontSize: "11px" }}
                          type={showPassword ? "text" : "password"}
                        />
                      ) : (
                        <div></div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right",
                          position: "relative",
                          top: "-40px",
                          left: "-25px",
                        }}
                      >
                        <Tippy
                          placement="bottom"
                          theme="pinkker"
                          content={
                            <h1
                              style={{
                                fontSize: "12px",
                                fontFamily: "Montserrat",
                              }}
                            >
                              Copiar
                            </h1>
                          }
                        >
                          <button
                            onClick={() =>
                              copyToClipboard(
                                userSe.keyTransmission &&
                                  userSe.keyTransmission.substring(
                                    4,
                                    userSe.keyTransmission.length
                                  ) +
                                    "?token=" +
                                    userSe.cmt
                              )
                            }
                            className="button-copy"
                          >
                            <i class="fas fa-copy" />
                          </button>
                        </Tippy>
                        <Tippy
                          placement="bottom"
                          theme="pinkker"
                          content={
                            <h1
                              style={{
                                fontSize: "12px",
                                fontFamily: "Montserrat",
                              }}
                            >
                              {showPassword ? "Ocultar" : "Mostrar"}
                            </h1>
                          }
                        >
                          <button
                            onClick={() => handleShowPopupMostrar()}
                            className="button-copy"
                          >
                            <i class="fas fa-eye" />
                          </button>
                        </Tippy>
                        {/*<Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Restablecer</h1>}>
                                                        <button onClick={() => handleRestoreKey()} className="button-copy"><i class="fas fa-recycle"/></button>
            </Tippy>*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="streammanager-content-2">
            <div style={{ height: "500px" }}>
              {streamerData && (
                <CustomPlayer
                  dashboard={true}
                  isMobile={isMobile}
                  vod={false}
                  streamer={streamer}
                  width="100%"
                  height="500px"
                  left="0px"
                />
              )}
            </div>

            <div
              style={{
                backgroundColor: "transparent",
                padding: "10px",
                color: "#ededed",
                borderBottom: "1px solid #2b2b2b8f",
                height: "50px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                style={{ marginRight: "20px", width: "45px" }}
                src={categorie && categorie.image}
                alt=""
              />
              <div>
                <div style={{ display: "flex" }}>
                  {streamerData &&
                    streamerData.stream_tag.map((tag) => (
                      <p className="channel-title-tag">#{tag}</p>
                    ))}
                </div>
                <h5>{streamerData && streamerData.stream_title}</h5>
                <h5 style={{ color: "gold" }}>
                  {streamerData && streamerData.stream_category}
                </h5>
              </div>
            </div>

            <Activity />
          </div>
          {stream && (
            <div className="streammanager-content-3">
              <div>
                <Chat
                  socket={socket}
                  socketMain={socketMain}
                  handleSendMessage={(e) => handleMessage(e)}
                  setUserSuscripted={(e) => console.log("setUserSuscripted")}
                  setSuscribers={(e) => console.log("setSuscribers")}
                />
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return getMobile();
    }
  }

  return (
    <div>
      {renderStreamManager()}

      {showPopupEditInfo === true && (
        <PopupEditInfo
          closePopup={() => togglePopupEditInfo()}
          stream={streamerData}
          user={userSe}
        />
      )}
      {showPopupMostrar === true && (
        <MostrarPopup
          mostrar={() => {
            setShowPassword(!showPassword);
            handleShowPopupMostrar();
          }}
          closePopup={() => handleShowPopupMostrar()}
        />
      )}
    </div>
  );
}
