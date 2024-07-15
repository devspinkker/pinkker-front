import React, { useState, useEffect, useRef } from "react";
import "./DashboardStream.css";
import { ChatStreaming } from "./chat/ChatStreaming";
import { getUserByIdTheToken } from "../../../services/backGo/user";
import {
  getStreamById,
  updateModChat,
  updateModChatSlowModeAxios,
  CommercialInStream,
} from "../../../services/backGo/streams";
import { getCategorieByName } from "../../../services/categories";
import { getStream } from "../../../services/stream";
import ReactFlvPlayer from "../../../player/PlayerMain";
import PopupEditInfo from "./popup/PopupEditInfo";
import ConfigComandosChat from "./ConfigComandosChat";
import { Grid, Typography } from "@mui/material";
import { AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { TbEdit, TbLogout2 } from "react-icons/tb";
import { TfiWallet } from "react-icons/tfi";
import { LiaSlidersHSolid } from "react-icons/lia";
import { BsChatDots } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import SettingsStream from "../settings/stream/SettingsStream";
import { useNotification } from "../../Notifications/NotificationProvider";
import { CiStreamOn } from "react-icons/ci";
import { MdOutlineOndemandVideo, MdSlowMotionVideo } from "react-icons/md";
import { SlUserFollow } from "react-icons/sl";
import { FaGratipay, FaHeart } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import NavbarLeft from "../../navbarLeft/NavbarLeft";

export default function DashboardStream({ isMobile, tyExpanded, user }) {
  const [showComandosList, setShowComandosList] = useState(false);
  const handleToggleComandosList = () => {
    setShowComandosList(!showComandosList);
  };

  const [streamerData, setStreamerData] = useState(null);
  const [userData, SetUserData] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const [videoLoading, setVideoLoading] = useState(true);
  const [mostrarditInfoStream, setditInfoStreamN] = useState(false);
  const [QuickActionShow, setQuickActionSHow] = useState(true);
  const [ChatOnliFollowers, setChatOnliFollowers] = useState(false);
  const [ChatOnliSubs, setChatOnliSubs] = useState(false);
  const [SecondModChatSlowMode, SetSecondModChatSlowMode] = useState(null);
  const [socket, setSocket] = useState(null);
  const pingIntervalRef = useRef();
  const [ActivityFeed, setActivityFeed] = useState([]);
  const speakMessage = (message) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    speech.lang = "es";
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const REACT_APP_BACKCOMMERCIALWS = process.env.REACT_APP_BACKCOMMERCIALWS;
    let id = window.localStorage.getItem("_id");
    const connectWebSocket = () => {
      const newSocket = new WebSocket(
        `wss://www.pinkker.tv/8084/ws/notification/ActivityFeed/${id}`
      );

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onmessage = (event) => {
        try {
          const receivedMessage = JSON.parse(event.data);
          console.log(event);
          console.log(receivedMessage);
          if (receivedMessage.action === "DonatePixels") {
            speakMessage(receivedMessage.text);
          }
          setActivityFeed((prevMessages) => [...prevMessages, receivedMessage]);
        } catch (error) {
          console.error("Error parsing JSON message:", error);
        }
      };

      newSocket.onopen = () => {};

      setSocket(newSocket);

      window.addEventListener("beforeunload", () => {
        newSocket.send("closing");
        newSocket.close();
      });
    };

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("closing");
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    const pingInterval = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    };

    const intervalId = setInterval(pingInterval, 3000);
    pingInterval(); // Invocar la función aquí para que se ejecute inmediatamente

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    pingIntervalRef.current = intervalId;

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [socket]);

  const toggleChatOnliSubs = async () => {
    let token = window.localStorage.getItem("token");
    if (token && ChatOnliSubs) {
      await updateModChat(token, { title: "" });
      setStreamerData({ ...streamerData, ModChat: "" });
      setChatOnliFollowers(false);
    } else {
      await updateModChat(token, { title: "Subscriptions" });
      setStreamerData({ ...streamerData, ModChat: "Subscriptions" });
      setChatOnliFollowers(false);
    }
    setChatOnliSubs(!ChatOnliSubs);
  };
  const [menuModChatSlowMode, setModChatSlowMode] = useState(false);
  const togglemenuModChatSlowMode = () => {
    setModChatSlowMode(!menuModChatSlowMode);
  };
  const CommercialInStreamFunc = () => {
    let token = window.localStorage.getItem("token");
    CommercialInStream(token);
  };
  const updateModChatSlowMode = async (second) => {
    const secondsInt = parseInt(second, 10);
    let token = window.localStorage.getItem("token");
    if (token) {
      const res = await updateModChatSlowModeAxios(token, secondsInt);
      if (res?.message === "ok") {
        SetSecondModChatSlowMode(secondsInt);
      }
    }
  };
  const toggleChatOnliFollowers = async () => {
    let token = window.localStorage.getItem("token");
    if (token && ChatOnliFollowers) {
      await updateModChat(token, { title: "" });
      setStreamerData({ ...streamerData, ModChat: "" });
      setChatOnliSubs(false);
    } else {
      await updateModChat(token, { title: "Following" });
      setStreamerData({ ...streamerData, ModChat: "Following" });
      setChatOnliSubs(false);
    }
    setChatOnliFollowers(!ChatOnliFollowers);
  };

  const toggleEditInfoStream = () => {
    setditInfoStreamN(!mostrarditInfoStream);
  };
  const toggleEQuickActionShow = () => {
    setQuickActionSHow(!QuickActionShow);
  };
  const [Channelshares, setChannelshares] = useState(true);

  const toggleChannelshares = () => {
    setChannelshares(!Channelshares);
  };
  useEffect(() => {
    const fetchData = async () => {
      let id = window.localStorage.getItem("_id");
      let token = window.localStorage.getItem("token");

      let resuser = await getUserByIdTheToken(token);
      if (resuser.message == "ok") {
        SetUserData(resuser.data);
      }
      const dataStreamer = await getStreamById(id);
      if (dataStreamer != null && dataStreamer != undefined) {
        setStreamerData(dataStreamer.data);

        if (dataStreamer.data?.ModChat == "Following") {
          setChatOnliFollowers(true);
        } else {
          setChatOnliFollowers(false);
        }
        if (dataStreamer.data?.ModChat == "Subscriptions") {
          setChatOnliSubs(true);
        } else {
          setChatOnliSubs(false);
        }
      }
      if (dataStreamer.data?.ModSlowMode) {
        SetSecondModChatSlowMode(dataStreamer.data?.ModSlowMode);
      } else {
        SetSecondModChatSlowMode(0);
      }
      const res = await getStream(token);
      if (res != null && res != undefined) {
        setStream(res);

        const dataCategorie = getCategorieByName(res.stream_category);
        if (dataCategorie != null && dataCategorie != undefined) {
          setCategorie(dataCategorie);
        }
      }
    };

    fetchData();
  }, []);

  const [elapsedTime, setElapsedTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const formatNumber = (number) => (number < 10 ? `0${number}` : number);

  useEffect(() => {
    const calculateElapsedTime = () => {
      const startDateTime = new Date(streamerData?.start_date);
      const now = new Date();

      const timeDifference = now - startDateTime;
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));

      setElapsedTime({ hours, minutes, seconds });
    };

    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [streamerData?.start_date]);

  function getHlsSrc() {
    let keyTransmission = userData?.keyTransmission.substring(
      4,
      userData?.keyTransmission.length
    );
    const rtmp = process.env.REACT_APP_RTMP;
    // const rtmp = "http://localhost:8000/live";
    var url = `${rtmp}/${keyTransmission}.flv`;
    return url;
  }

  useEffect(() => {
    if (videoRef.current != null && videoRef.current != undefined) {
      const videoPlayer = videoRef.current;

      const handlePlayerLoad = () => {
        setVideoLoading(false);
      };

      const handlePlayerError = () => {
        setVideoLoading(false);
      };

      videoPlayer.addEventListener("loadeddata", handlePlayerLoad);
      videoPlayer.addEventListener("error", handlePlayerError);

      return () => {
        videoPlayer.removeEventListener("loadeddata", handlePlayerLoad);
        videoPlayer.removeEventListener("error", handlePlayerError);
      };
    }
  }, []);

  const [subMenu, setSubMenu] = useState(false);

  const [esClick, setEsClick] = useState(false);
  const habilitarSubMenu = (valor, e) => {
    if (e?.type === "click") {
      setEsClick(true);
    } else {
      setEsClick(false);
    }

    setTimeout(() => {
      setSubMenu(valor);
    }, [100]);
  };

  useEffect(() => {
    // Función para manejar el clic en cualquier parte de la página
    const handleClickOutside = () => {
      setSubMenu(false); // Cambiar el estado a false cuando se hace clic fuera del área deseada
    };

    // Agregar un event listener para escuchar clics en el documento
    document.addEventListener("click", handleClickOutside);

    // Limpiar el event listener en la fase de limpieza de useEffect
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleLogout = async () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("_id");
    window.localStorage.removeItem("avatar");
    window.location.href = "/";
  };

  const alert = useNotification();
  const [showKey, setShowKey] = useState(false);

  const copyToClipboard = (text) => {
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    alert({ type: "SUCCESS", message: "Copiado correctamente!" });
  };
  const [expanded, setExpanded] = useState(true);
  console.log("expand", expanded);
  return (
    <Grid style={{ display: "flex" }}>
      <NavbarLeft
        isMobile={isMobile}
        tyExpanded={expanded}
        user={user}
        tyDashboard={true}
        setExpanded={setExpanded}
      />

      <Grid
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          padding: expanded ? "0vh 0rem 0rem 10rem" : "0rem 0rem 0rem 0rem",
          width: expanded ? "95%" : "95%",
        }}
      >
        {mostrarditInfoStream && (
          <PopupEditInfo
            closePopup={toggleEditInfoStream}
            stream={streamerData}
            user={userData}
          />
        )}
        {/* Primera sección */}
        <div className="first-section">
          {/* Navegación */}
          <div className="navigation">
            <div className="navigation-container-stream-deshboard">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  padding: "1rem 5.8rem",
                }}
              >
                <a href="/" style={{ width: "20%" }}>
                  <img
                    style={{ width: "65%" }}
                    src="https://res.cloudinary.com/dcj8krp42/image/upload/v1712283573/categorias/logo_trazado_pndioh.png"
                    alt="Avatar"
                  />
                </a>

                <Grid>
                  <div className="session-info">
                    {!streamerData?.online && (
                      <div className="stats-container">
                        <span className="w-fit grow-0 rounded-[2px] px-[0.375rem] py-1 text-center text-[0.625rem] font-bold uppercase bg-[#F4F5F6] text-[#070809]">
                          Sin conexión
                        </span>
                        <span className="label">Sesión</span>
                      </div>
                    )}
                    <div className="stats-container">
                      <span className="data">
                        - {streamerData?.online && streamerData?.ViewerCount}
                      </span>
                      <span className="label"> espectadores</span>
                    </div>
                    <div className="stats-container">
                      <span className="data">
                        {/* - {userData && Object.keys(userData.FollowersCount)}{" "} */}
                        1
                      </span>
                      <span className="label"> seguidores</span>
                    </div>
                    <div className="stats-container">
                      <span className="data">
                        {streamerData?.online ? (
                          <p className="elapsedTime">
                            <p>{`${formatNumber(elapsedTime.hours)}`}</p>
                            <p>{`: ${formatNumber(elapsedTime.minutes)}`}</p>
                            <p>{`: ${formatNumber(elapsedTime.seconds)}`}</p>
                          </p>
                        ) : (
                          "-"
                        )}
                      </span>
                      <span className="label">Tiempo en vivo</span>
                    </div>
                  </div>
                </Grid>

                {/* <div className="container-relatives-deshboard">
                <div className="relative">
                  <button className="">
                    <div
                      className="base-icon icon"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.87504 7.11696H7.12503V8.86697H8.87504V7.11696Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M12.9919 12.9838L11.7581 11.75L13.25 10.2538V5.73001L11.7581 4.23376L12.9919 3L15 5.00376V10.98L12.9919 12.9838Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M3.00813 12.9838L1 10.98V5.00376L3.00813 3L4.24189 4.23376L2.75001 5.73001V10.2538L4.24189 11.75L3.00813 12.9838Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M5.19127 11.2338L4.06252 10.105V5.87876L5.19565 4.75001L6.4294 5.98376L5.81252 6.60502V9.37878L6.43378 10L5.19127 11.2338Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M10.8044 11.2338L9.5706 10L10.1875 9.37878V6.60502L9.5706 5.98376L10.8044 4.75001L11.9375 5.87876V10.105L10.8044 11.2338Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="relative">
                  <button className="!bg-transparent !border !border-primary variant-highlight size-md base-icon-button !bg-transparent !border !border-primary">
                    <div
                      className="base-icon icon"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.00501 2.94L3.435 2.94V1.94L1.005 1.94L1.005 4.28H2.00501L2.00501 2.94Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M2.00501 11.72H1.005L1.005 14.055H3.435V13.055H2.00501V11.72Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M12.565 1.94V2.94H13.995V4.28H14.995V1.94L12.565 1.94Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M13.995 13.055H12.565V14.055H14.995V11.72H13.995V13.055Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M10.63 3.865L5.37001 3.865C4.04501 3.865 2.97501 4.94 2.97501 6.26L2.97501 9.735C2.97501 11.06 4.05 12.13 5.37001 12.13L10.63 12.13C11.955 12.13 13.025 11.055 13.025 9.735L13.025 6.26C13.025 4.935 11.95 3.865 10.63 3.865ZM6.73501 10.3L6.73501 5.7L9.99001 8L6.73501 10.3Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      CommercialInStreamFunc();
                    }}
                  >
                    <div
                      className="base-icon icon"
                      style={{ width: "20px", height: "20px" }}
                    >
                      ADS
                    </div>
                  </button>
                </div>
              </div> */}
              </div>

              <Grid>
                <Grid
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div className="navbar-image-avatar-container">
                    <div
                      style={{
                        width: "40px",
                        background: "#2a2e38",
                        position: "relative",
                        left: "  ",
                        top: "2px",
                      }}
                      className="navbar-image-avatar"
                    >
                      {/* <img src={"/images/iconos/notificacion.png"} alt="" style={{ width: '60%' }} /> */}
                      <IoMdNotificationsOutline
                        style={{ fontSize: "20px", color: "white" }}
                      />
                    </div>
                  </div>
                  <div className="navbar-image-avatar-container">
                    <div
                      style={{
                        width: "40px",
                        background: "#2a2e38",
                        position: "relative",
                        left: "  ",
                        top: "2px",
                      }}
                      className="navbar-image-avatar"
                    >
                      {/* <img src={"/images/iconos/mensaje.png"} alt="" style={{ width: '60%' }} /> */}
                      <BsChatDots
                        style={{ fontSize: "20px", color: "white" }}
                      />
                    </div>
                  </div>
                  <div className="navbar-image-avatar-container">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#f36196",
                        position: "relative",
                        left: "  ",
                        top: "2px",
                      }}
                      className="navbar-image-avatar"
                      onClick={(e) => habilitarSubMenu(true, e)}
                      onMouseEnter={
                        esClick
                          ? console.log("activo")
                          : () => habilitarSubMenu(true)
                      }
                      onMouseLeave={
                        esClick
                          ? console.log("activo")
                          : () => habilitarSubMenu(false)
                      }
                    >
                      <img src={user?.Avatar ?? "/images/pixel.png"} alt="" />
                    </div>
                  </div>
                </Grid>

                {subMenu && (
                  <Grid
                    onMouseEnter={
                      esClick
                        ? console.log("activo")
                        : () => habilitarSubMenu(true)
                    }
                    onMouseLeave={
                      esClick
                        ? console.log("activo")
                        : () => habilitarSubMenu(false)
                    }
                    style={{
                      backgroundColor: "#121418",
                      border: "1px solid #343843",
                      position: "absolute",
                      padding: "1rem",
                      width: "16.25rem",
                      right: "105px",
                      borderRadius: "0.5rem",
                      zIndex: 99999,
                    }}
                  >
                    <Grid
                      style={{
                        backgroundColor: "#202329",
                        borderRadius: "5px",
                        display: "flex",
                        flexDirection: "column",
                        padding: "1rem",
                      }}
                    >
                      <Grid
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          padding: 10,
                        }}
                      >
                        <img
                          src={user?.Avatar ?? "/images/pixel.png"}
                          alt=""
                          style={{
                            width: "20%",
                            height: "20%",
                            borderRadius: "50%",
                          }}
                        />
                        <Grid
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1px",
                          }}
                        >
                          <Link
                            style={{
                              textDecoration: "none",
                              margin: 0,
                              padding: 0,
                            }}
                            to={"/" + user.NameUser}
                          >
                            <Typography
                              style={{
                                color: "white",
                                fontSize: "1rem",
                                fontFamily: "Inter",
                                fontWeight: 600,
                              }}
                            >
                              {user?.NameUser ?? "Usuario"}
                            </Typography>
                          </Link>
                          <Typography
                            style={{
                              color: "white",
                              fontSize: "12px",
                              fontFamily: "Inter",
                            }}
                          >
                            0 seguidores
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "15px",
                        marginTop: "15px",
                      }}
                    >
                      <Link
                        className="dropdownaccount-link"
                        to={"/" + user.NameUser}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <AiOutlineUser style={{ marginRight: "10px" }} />
                        Tu canal
                      </Link>

                      <Link
                        className="dropdownaccount-link"
                        to={"/" + user.NameUser + "/dashboard/stream"}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <LiaSlidersHSolid
                          style={{ marginRight: "10px", fontSize: "24px" }}
                        />
                        Panel de control del creador
                      </Link>

                      <Link
                        className="dropdownaccount-link"
                        to="/plataform/cartera"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TfiWallet style={{ marginRight: "10px" }} />
                        Cartera
                      </Link>

                      <Link
                        className="dropdownaccount-link"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        to={"/" + user.NameUser + "/settings"}
                      >
                        <AiOutlineSetting style={{ marginRight: "10px" }} />
                        Configuración
                      </Link>
                      <div
                        className="dropdownaccount-link"
                        onClick={() => handleLogout()}
                      >
                        <TbLogout2 style={{ marginRight: "10px" }} />
                        Cerrar sesión
                      </div>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              {/* Añade más botones aquí si es necesario */}
              {/* <div className="ml-auto flex flex-row items-center gap-4">
              <div className="relative">
                <button className="variant-text size-md base-icon-button">
                  <div
                    className="base-icon icon"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 1C4.135 1 1 4.135 1 8C1 11.865 4.135 15 8 15C11.865 15 15 11.865 15 8C15 4.135 11.865 1 8 1ZM9 12.38H7V7.045H9V12.38ZM9 5.545H7V3.615H9V5.545Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div className="relative ">
                <button className="variant-highlight size-md base-icon-button">
                  <div
                    className="base-icon icon"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.99981 3.34058L2.66622 10.6742L5.33298 13.3409L12.6666 6.00734L9.99981 3.34058Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M12.3362 1L11.0028 2.33338L13.6696 5.00014L15.003 3.66676L12.3362 1Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M1 14.3353C1.25457 14.5899 1.41014 14.7454 1.6647 15L4.33295 14.3353L1.6647 11.6718L1 14.34V14.3353Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div className="relative">
                <a href={"/" + userData?.NameUser} className="">
                  <button className="variant-highlight size-md base-icon-button">
                    <div
                      className="base-icon icon"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 1H1V15H8V1Z" fill="currentColor"></path>
                        <path
                          d="M11.3688 7.06806L12.4451 5.99181L11.2069 4.75806L7.96069 7.99993L11.2069 11.2418L12.4407 10.0081L11.2551 8.81806H15.0001V7.06806H11.3688Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </a>
              </div>
            </div> */}
            </div>
          </div>
          {/* Contenido */}
          <div className="content">
            {/* Parte 2 */}
            <div className="part-two">
              <div className="column">
                <div
                  style={{
                    display: showComandosList && "none",
                  }}
                  className="Broadcast-preview-dashboard"
                >
                  <div
                    title="Información de sesión"
                    className="vista-previa-stream-p1"
                  >
                    <MdOutlineOndemandVideo
                      style={{ color: "white", fontSize: "30px" }}
                    />

                    <span
                      style={{
                        padding: "0px 10px",
                      }}
                      className="max-w-full shrink truncate text-base font-bold text-white"
                    >
                      Vista previa del stream
                    </span>
                  </div>
                  {streamerData?.online ? (
                    <ReactFlvPlayer
                      allowFullScreen
                      id="pinkker-player"
                      videoRef={videoRef}
                      preload={"auto"}
                      webkit-playsinline={true}
                      playsInline={true}
                      src={getHlsSrc()}
                      autoPlay={true}
                      muted={true}
                      controls={false}
                      width={"100%"}
                      height={"100%"}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        padding: "5px",
                      }}
                    >
                      <img
                        style={{
                          width: "90%",
                          maxHeight: "100%",
                        }}
                        src={streamerData?.stream_thumbnail}
                        alt=""
                      />
                      <span
                        style={{
                          position: "relative",
                          display: streamerData?.online ? "none" : "",
                          top: "-75%",
                          zIndex: 99999,
                        }}
                        className="sin-conexion-s3"
                      >
                        SIN CONEXIÓN
                      </span>

                      <Grid
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        <Grid style={{ width: "10%" }}>
                          <img
                            src={"/images/pixel.png"}
                            style={{ width: "100%" }}
                          />
                        </Grid>
                        <Grid
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "79%",
                          }}
                        >
                          <Typography
                            style={{ fontWeight: "bold", color: "white" }}
                          >
                            {streamerData?.stream_title}
                          </Typography>
                          <TbEdit
                            style={{
                              color: "white",
                              fontSize: "25px",
                              cursor: "pointer",
                            }}
                            onClick={toggleEditInfoStream}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </div>

                <div
                  className="Información-sesión"
                  style={{
                    display: showComandosList && "none",
                  }}
                >
                  <section className="base-card !p-0">
                    <div className="Información-sesión-p1">
                      <div
                        title="Información de sesión"
                        className="flex flex-row items-center gap-1"
                      >
                        <CiStreamOn
                          style={{ color: "white", fontSize: "30px" }}
                        />

                        <span
                          style={{
                            padding: "0px 10px",
                          }}
                          className="shrinkS2"
                        >
                          Servidor y clave de stream
                        </span>
                      </div>
                      <Grid>
                        <input
                          value={process.env.REACT_APP_RTMPSTARTSTREAM}
                          className="settingstream-input"
                          style={{ width: "70%" }}
                          type="text"
                          readOnly
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <input
                            value={showKey ? user?.cmt : "******************"}
                            className="settingstream-input"
                            style={{ width: "70%" }}
                            type="text"
                          />
                          <div
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            <button
                              onClick={() => setShowKey(!showKey)}
                              className="button-copy"
                            >
                              {showKey ? "Ocultar" : "Mostrar"}
                            </button>
                            <button
                              onClick={() => copyToClipboard(user?.cmt)}
                              className="button-copy"
                            >
                              Copiar
                            </button>
                            <button className="button-copy">Restablecer</button>
                          </div>
                        </div>
                      </Grid>
                    </div>
                  </section>
                </div>

                {/* <div
                style={{
                  height: showComandosList && "100%",
                }}
                className="ConfigComandosChat"
              >
                <ConfigComandosChat
                  showComandosList={showComandosList}
                  handleToggleComandosList={handleToggleComandosList}
                />
              </div> */}
              </div>
            </div>

            <Grid
              style={{
                width: "35%",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
              }}
            >
              <div className="base-card-act">
                <div className="Feeddeactividades_container">
                  <div
                    title="Feed de actividades"
                    className="Feeddeactividades"
                  >
                    <span className="max-w-full shrink truncate text-base font-bold text-white">
                      Notificaciones en vivo
                    </span>
                  </div>

                  <div className="FeedAct">
                    <div className="mapFeedAct">
                      {ActivityFeed.map((item, index) => (
                        <div key={index} className="activity-feed-item">
                          {/* {item?.action === "follow" && ( */}
                          <div
                            className="base-icon icon"
                            style={{ width: "20px", height: "20px" }}
                          >
                            <GoHeartFill style={{ color: "#ff69c4" }} />
                          </div>
                          {/* )} */}
                          <div className="activity-feed-item__info">
                            <span className="activity-feed-item__info_name">
                              {item?.data}
                            </span>
                            <span>
                              {item?.action === "follow" && (
                                <span className="activity-feed-item__info_action">
                                  {" "}
                                  Te comenzó a seguir
                                </span>
                              )}
                              {item?.action === "DonatePixels" && (
                                <span className="activity-feed-item__info_action">
                                  {" "}
                                  Dono {item?.Pixeles} Pixeles
                                </span>
                              )}
                              {item?.action === "Suscribirse" && (
                                <span className="activity-feed-item__info_action">
                                  {" "}
                                  Se suscribió
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="right-panel flex flex-col bg-[#171C1E] grow">
                  <div
                    className="right-panel__header flex flex-row items-center justify-between gap-2 px-6"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div className="flex flex-row items-center">
                      <span className="text-base font-bold">
                        Acciones rápidas
                      </span>
                    </div>
                    <Grid
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        gap: "15px",
                      }}
                    >
                      <SlUserFollow
                        style={{
                          color: "white",
                          fontSize: "35px",
                          borderRadius: "5px",
                          backgroundColor: ChatOnliFollowers
                            ? "#fe68c3"
                            : "#171C1E",
                          width: "30%",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleChatOnliFollowers()}
                      />
                      <FaGratipay
                        style={{
                          color: "white",
                          fontSize: "35px",
                          borderRadius: "5px",
                          backgroundColor: ChatOnliSubs ? "#fe68c3" : "#171C1E",
                          width: "30%",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleChatOnliSubs()}
                      />
                      <MdSlowMotionVideo
                        style={{
                          color: "white",
                          fontSize: "35px",
                          borderRadius: "5px",
                          backgroundColor: "#171C1E",
                          width: "30%",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          togglemenuModChatSlowMode();
                        }}
                      />
                      <Typography
                        style={{
                          color: "white",
                          fontSize: "25px",
                          borderRadius: "5px",
                          backgroundColor: "#171C1E",
                          width: "30%",
                          padding: "10px",
                          cursor: "pointer",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                        onClick={() => {
                          CommercialInStreamFunc();
                        }}
                      >
                        ADS
                      </Typography>
                    </Grid>
                  </div>
                  <div className="right-panel__content">
                    <div className="flex shrinkS2 grow flex-col gap-2 overflow-y-hidden p-2.5">
                      <div
                        style={{
                          animation: "200ms all",
                          height: Channelshares ? "auto" : "0",
                          display: Channelshares ? "" : "none",
                        }}
                      >
                        <div>
                          {menuModChatSlowMode && (
                            <div className="dropdown-menu">
                              {[2, 5, 7, 15, 20, 60].map((seconds) => (
                                <div
                                  key={seconds}
                                  className=" menuModChatSlowMode"
                                  onClick={() => updateModChatSlowMode(seconds)}
                                >
                                  <div>
                                    <span
                                      style={{
                                        padding: "10px",
                                      }}
                                    >
                                      {seconds}
                                    </span>
                                    <span>segundos</span>
                                  </div>
                                  <div
                                    className="toggle-size-sm"
                                    onClick={() =>
                                      updateModChatSlowMode(seconds)
                                    }
                                  ></div>
                                  <div className="base-toggle">
                                    <div
                                      className="base-toggle-indicator"
                                      style={{
                                        left:
                                          SecondModChatSlowMode === seconds &&
                                          "16.4px",
                                        background:
                                          SecondModChatSlowMode === seconds &&
                                          "#53fc18",
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                              <div className="SecondModChatSlowModeInput">
                                <input
                                  type="number"
                                  placeholder="Escriba un tiempo en segundos"
                                  value={SecondModChatSlowMode}
                                  onChange={(e) => {
                                    SetSecondModChatSlowMode(e.target.value);
                                  }}
                                  min="1"
                                />
                                <button
                                  onClick={() =>
                                    updateModChatSlowMode(SecondModChatSlowMode)
                                  }
                                >
                                  Confirmar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>

            {/* Parte 1 */}

            {streamerData && userData && (
              <ChatStreaming
                streamerChat={streamerData}
                chatExpandeds={true}
                streamerData={streamerData}
                user={userData}
                isMobile={isMobile}
                DashboardStream={true}
              />
            )}
          </div>
        </div>
        {/* Segunda sección */}
      </Grid>
    </Grid>
  );
}
