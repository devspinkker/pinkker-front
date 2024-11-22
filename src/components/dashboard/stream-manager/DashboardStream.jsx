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
import { Button, Drawer, Grid, Slider, TextField, Typography } from "@mui/material";
import {
  AiFillSetting,
  AiFillThunderbolt,
  AiOutlineSetting,
  AiOutlineUser,
} from "react-icons/ai";
import { TbEdit, TbLogout2 } from "react-icons/tb";
import { TfiWallet } from "react-icons/tfi";
import { LiaSlidersHSolid } from "react-icons/lia";
import { BsChatDots } from "react-icons/bs";
import { IoMdNotificationsOutline, IoMdPause } from "react-icons/io";
import { Link } from "react-router-dom";
import SettingsStream from "../settings/stream/SettingsStream";
import { useNotification } from "../../Notifications/NotificationProvider";
import { CiStreamOn } from "react-icons/ci";
import { MdHd, MdOutlineOndemandVideo, MdSlowMotionVideo } from "react-icons/md";
import { SlUserFollow } from "react-icons/sl";
import { FaGratipay, FaHeart } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import NavbarLeft from "../../navbarLeft/NavbarLeft";
import DashboarLayout from "../DashboarLayout";
import Tippy from "@tippyjs/react";
import { LuClapperboard } from "react-icons/lu";

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
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);

  const [volumePlayer, setVolumePlayer] = useState(0.5);
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
        `${REACT_APP_BACKCOMMERCIALWS}/ws/notification/ActivityFeed/${id}`
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

      newSocket.onopen = () => { };

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

  function getHlsPlayer() {
    // console.log(getHlsSrc());
    // if (isMobile) {
    //   alert("mobile es true");
    //   return (
    //     <video
    //       id="pinkker-player"
    //       style={{ position: "relative", top: "60px" }}
    //       controls={isMobile}
    //       autoPlay={true}
    //       onPlaying={true}
    //     >
    //       <source src={getHlsSrc()} type="application/x-mpegURL" />
    //     </video>
    //   );
    // }
    return (
      <Grid
        style={{
          display: "flex",
        }}
      >
        <ReactFlvPlayer
          allowFullScreen
          id="pinkker-player"
          videoRef={videoRef}
          preload={"auto"}
          webkit-playsinline={true}
          playsInline={true}
          src={getHlsSrc()}
          autoPlay={false}
          muted={true}
          controls={true}
          dashboard={true}
          width={"100%"}
          height={"100%"}
        />
      </Grid>
    );
  }

  function getVolumeButton() {
    if (muted === true) {
      return (
        <Tippy
          theme="pinkker"
          content={
            <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
              Volumen
            </h1>
          }
        >
          <i
            onMouseEnter={() => setVolumeHovered(true)}
            onMouseLeave={() => setVolumeHovered(false)}
            onClick={() => mutedPlayer()}
            style={{ cursor: "pointer" }}
            className="fas fa-volume-mute pinkker-button-more"
          />
        </Tippy>
      );
    } else {
      if (volumePlayer === 0) {
        return (
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Volumen
              </h1>
            }
          >
            <i
              onMouseEnter={() => setVolumeHovered(true)}
              onMouseLeave={() => setVolumeHovered(false)}
              onClick={() => mutedPlayer()}
              style={{ cursor: "pointer" }}
              className="fas fa-volume-down pinkker-button-more"
            />
          </Tippy>
        );
      }

      if (volumePlayer <= 0.5) {
        return (
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Volumen
              </h1>
            }
          >
            <i
              onMouseEnter={() => setVolumeHovered(true)}
              onMouseLeave={() => setVolumeHovered(false)}
              onClick={() => mutedPlayer()}
              style={{ cursor: "pointer" }}
              className="fas fa-volume-down pinkker-button-more"
            />
          </Tippy>
        );
      }
      if (volumePlayer > 0.5) {
        return (
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Volumen
              </h1>
            }
          >
            <i
              onMouseEnter={() => setVolumeHovered(true)}
              onMouseLeave={() => setVolumeHovered(false)}
              onClick={() => mutedPlayer()}
              style={{ cursor: "pointer" }}
              className="fas fa-volume-down pinkker-button-more"
            />
          </Tippy>
        );
      }
    }
  }
  const mutedPlayer = () => {
    if (!videoLoading) {
      if (muted === true) {
        videoRef.current.muted = false;
        setMuted(false);
        setVolumePlayer(0.2);
      } else if (muted === false) {
        videoRef.current.muted = true;
        setMuted(true);
        setVolumePlayer(0);
      }
    }
  };
  const setVolume = (volume) => {
    if (volume === 0) {
      setMuted(true);
      setVolumePlayer(volume);
    } else {
      videoRef.current.volume = volume;
      setVolumePlayer(volume);
      setMuted(false);
    }
  };
  const videoHandler = () => {
    if (!videoLoading) {
      if (playing === false) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  };

  function getBottomButtons() {
    if (videoRef.current != null && videoRef.current != undefined) {

      return (
        <div
          className="customPlayer-container"
          style={{
            opacity: 1
          }}
        >
          <div
            style={{
              position: "relative",
              top: "-73px",

            }}
            className="customPlayer-primary"
          >
            <div className="customPlayer-secundary-div" style={{width:'100%'}}>
              <div className="customPlayer-card">
                {playing ? (
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Pausa
                      </h1>
                    }
                  >
                    <IoMdPause
                      onClick={() => videoHandler()}
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      className="pinkker-button-more"
                    />
                  </Tippy>
                ) : (
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Play
                      </h1>
                    }
                  >
                    <i
                      onClick={() => videoHandler()}
                      style={{ cursor: "pointer" }}
                      class="fas fa-play pinkker-button-more"
                    />
                  </Tippy>
                )}
              </div>
              <div className="customPlayer-card">{getVolumeButton()}</div>

              <div
                style={{ marginLeft: "15px", width: "125px" }}
                className="customPlayer-card"
              >
                <Slider
                  onMouseEnter={() => setVolumeHovered(true)}
                  onMouseLeave={() => setVolumeHovered(false)}
                  aria-label="Temperature"
                  defaultValue={volumePlayer}
                  max={1}
                  step={0.01}
                  color="secondary"
                  value={volumePlayer}
                  style={{
                    color: "#fff",
                    opacity: volumeHovered ? "1" : "0",
                  }}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      );

    }
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

  return (
    <DashboarLayout user={user} isMobile={isMobile}>
      {/* Contenido */}
      <div style={{ height: "80%" }}>
        <div className="content" style={{ gap: "1%" }}>
          {/* Parte 2 */}
          <div className="part-two">
            <div className="column">
              <Grid
                style={{
                  backgroundColor: "#131418",
                  borderRadius: "10px",
                }}
              >
                <div
                  title="Información de sesión"
                  className="vista-previa-stream-p1"
                  style={{
                    backgroundColor: "#131418",
                  }}
                >
                  <CiStreamOn style={{ color: "white", fontSize: "30px" }} />

                  <span
                    style={{
                      padding: "0px 10px",
                    }}
                    className="max-w-full shrink truncate text-base font-bold text-white"
                  >
                    Información de sesión
                  </span>
                </div>
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
                      - {userData && userData.FollowersCount}{" "}
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

              <div
                style={{
                  display: showComandosList && "none",
                }}
                className="Broadcast-preview-dashboard"
              >
                <div
                  title="Información de sesión"
                  className="vista-previa-stream-p1"
                  style={{
                    backgroundColor: "#131418",
                  }}
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
                  <>
                    {getHlsPlayer()}
                    {getBottomButtons()}
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        maxHeight: "100%",
                        borderRadius: "5px",
                      }}
                      src={streamerData?.stream_thumbnail}
                      alt=""
                    />
                  </div>
                )}
                <Grid
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                    alignItems: "center",
                  }}
                >
                  <Grid style={{ width: "10%" }}>
                    <img
                      src={streamerData?.ImageCategorie}
                      style={{ width: "100%" }}
                    />
                  </Grid>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "79%",
                      wordBreak:'break-word'
                    }}
                  >
                    <Typography style={{ fontWeight: "bold", color: "white" }}>
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

              <div
                style={{
                  display: "flex",
                  alignItems: "top",
                  padding: 3,
                  gap: "10px",
                }}
              >
                <div style={{ backgroundColor: "#131418", width: "100%" }}>
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
                        <Grid
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "30%",
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
                              width: "85%",
                              padding: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => toggleChatOnliFollowers()}
                          />
                          <Typography
                            style={{
                              color: "white",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Chat solo seguidores
                          </Typography>
                        </Grid>
                        <Grid
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "30%",
                          }}
                        >
                          <FaGratipay
                            style={{
                              color: "white",
                              fontSize: "35px",
                              borderRadius: "5px",
                              backgroundColor: ChatOnliSubs
                                ? "#fe68c3"
                                : "#171C1E",
                              width: "85%",
                              padding: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => toggleChatOnliSubs()}
                          />
                          <Typography
                            style={{
                              color: "white",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Chat solo suscriptores
                          </Typography>
                        </Grid>
                        <Grid
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "30%",
                          }}
                        >
                          <MdSlowMotionVideo
                            style={{
                              color: "white",
                              fontSize: "35px",
                              borderRadius: "5px",
                              backgroundColor: "#171C1E",
                              width: "85%",
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
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Chat modo lento
                          </Typography>
                        </Grid>
                        <Grid
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "30%",
                          }}
                        >
                          <Typography
                            style={{
                              color: "white",
                              fontSize: "25px",
                              borderRadius: "5px",
                              backgroundColor: "#171C1E",
                              width: "85%",
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
                          <Typography
                            style={{
                              color: "white",
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            Anuncio
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>

                    <div className="right-panel__content">
                      {/* <div className="flex shrinkS2 grow flex-col gap-2 overflow-y-hidden p-2.5">
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
                                      onClick={() => updateModChatSlowMode(seconds)}
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
                      </div> */}
                    </div>
                  </div>
                </div>
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
          <div
            className="base-card-act"
            style={{
              
              width: "50%",
              height: "85%",
              display: "flex",
              flexDirection: "column",
              gap: '10px'
            }}
          >
            <div
              className="Información-sesión"
              style={{
                display: showComandosList && "none",
                borderRadius: '10px'
              }}
            >
              <section className="base-card !p-0">
                <div className="Información-sesión-p1">
                  <div
                    title="Información de sesión"
                    className="flex flex-row items-center gap-1"
                  >
                    <CiStreamOn style={{ color: "white", fontSize: "30px" }} />

                    <span
                      style={{
                        padding: "0px 10px",
                      }}
                      className="shrinkS2"
                    >
                      Servidor y clave de stream
                    </span>
                  </div>
                  <Grid style={{ display: "flex", alignItems: "center" }}>
                    <Grid
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "80%",
                      }}
                    >
                      <input
                        value={process.env.REACT_APP_RTMPSTARTSTREAM}
                        className="settingstream-input"
                        style={{ width: "90%" }}
                        type="text"
                        readOnly
                      />

                      <input
                        value={showKey ? user?.cmt : "******************"}
                        className="settingstream-input"
                        style={{ width: "90%" }}
                        type="text"
                      />
                    </Grid>

                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        flexDirection: "column",
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
                  </Grid>
                </div>
              </section>
            </div>

            <div className="Feeddeactividades_container" style={{ height: '58vh', backgroundColor: 'rgb(19, 20, 24)', borderRadius:'10px' }}>
              <div title="Feed de actividades" className="Feeddeactividades">
                <span
                  className="max-w-full shrink truncate text-base font-bold text-white"
                  style={{ display: "flex", alignItems: "center", gap: "5%" }}
                >
                  <AiFillThunderbolt style={{ fontSize: "2rem" }} />
                  Feed de actividades
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
                          {item?.Nameuser}
                        </span>

                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          {item?.Type === "follow" && (
                            <span className="activity-feed-item__info_action">
                              {" "}
                              Te comenzó a seguir
                            </span>
                          )}
                          {item?.Type === "DonatePixels" && (
                            <span className="activity-feed-item__info_action">
                              {" "}
                              Dono {item?.Pixeles} Pixeles
                            </span>
                          )}
                          {item?.Type === "Suscribirse" && (
                            <span className="activity-feed-item__info_action">
                              {" "}
                              Se suscribió
                            </span>
                          )}

                          {/* <span>Ahora</span> */}
                        </span>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {mostrarditInfoStream && (
            <PopupEditInfo
              closePopup={toggleEditInfoStream}
              stream={streamerData}
              user={userData}
            />
          )}

          {/* Parte 1 */}

          {streamerData && userData && !isMobile && (
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
    </DashboarLayout>
  );
}
