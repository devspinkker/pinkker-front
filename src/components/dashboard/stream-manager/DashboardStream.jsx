import React, { useState, useEffect, useRef } from "react";
import "./DashboardStream.css";
import { ChatStreaming } from "./chat/ChatStreaming";
import { getUserByIdTheToken } from "../../../services/backGo/user";
import { getStreamById, updateModChat } from "../../../services/backGo/streams";
import { getCategorieByName } from "../../../services/categories";
import { getStream } from "../../../services/stream";
import ReactFlvPlayer from "../../../player/PlayerMain";
import PopupEditInfo from "./popup/PopupEditInfo";
import ConfigComandosChat from "./ConfigComandosChat";

export default function DashboardStream({ isMobile, tyExpanded }) {
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

  const toggleChatOnliFollowers = async () => {
    let token = window.localStorage.getItem("token");
    if (token && streamerData?.ModChat == "Following") {
      await updateModChat(token, { title: "" });
    } else {
      await updateModChat(token, { title: "Following" });
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

        console.log(dataStreamer.data);
        if (dataStreamer.data?.ModChat == "Following") {
          setChatOnliFollowers(true);
        } else {
          setChatOnliFollowers(false);
        }
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

  return (
    <div
      id="DashboardStream-container"
      style={{
        padding: !tyExpanded && "0rem 4rem",
        width: !tyExpanded && "96%",
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
                width: "28%",
                justifyContent: "space-between",
              }}
            >
              <div className="navigation-container-stream-deshboard-infouser">
                <figure
                  style={{
                    display: "flex",
                  }}
                  className="b"
                  data-label="Live"
                >
                  <img
                    style={{
                      width: "27px",
                      borderRadius: "50%",
                    }}
                    src={userData?.Avatar}
                    alt="Avatar"
                  />
                </figure>
                <div className="">
                  <span>{userData?.NameUser}</span>
                </div>
              </div>
              <div className="container-relatives-deshboard">
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
              </div>
            </div>
            {/* Añade más botones aquí si es necesario */}
            <div className="ml-auto flex flex-row items-center gap-4">
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
            </div>
          </div>
        </div>
        {/* Contenido */}
        <div className="content">
          {/* Parte 2 */}
          <div className="part-two">
            <div className="column">
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
                      <div
                        className="base-icon"
                        style={{ width: "20px", height: "20px" }}
                      >
                        <svg
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
                      <span
                        style={{
                          padding: "0px 10px",
                        }}
                        className="shrinkS2"
                      >
                        Información de sesión
                      </span>
                    </div>
                    <div className="shrinkS2">
                      <div data-headlessui-state="" className="relative">
                        <button
                          id="headlessui-menu-button-25"
                          aria-haspopup="menu"
                          aria-expanded="false"
                          className="variant-text size-sm base-icon-button"
                          type="button"
                          style={{
                            background: "none",
                            border: "none",
                          }}
                        >
                          <div
                            className="base-icon icon"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.5 2H6.5V5H9.5V2Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M9.5 6.5H6.5V9.5H9.5V6.5Z"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M9.5 11H6.5V14H9.5V11Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
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
                        - {userData && Object.keys(userData.Followers).length}{" "}
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
                </section>
              </div>
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
                  <div style={{ width: "20px", height: "20px" }}>
                    <svg
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
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
                    height={"85%"}
                  />
                ) : (
                  <div
                    style={{
                      minWidth: "400px",
                      height: "80%",
                    }}
                  >
                    <img
                      style={{
                        minWidth: "428px",
                        maxHeight: "277px",
                      }}
                      src={streamerData?.stream_thumbnail}
                      alt=""
                    />
                  </div>
                )}
                <span
                  style={{
                    display: streamerData?.online ? "none" : "",
                  }}
                  className="sin-conexion-s3"
                >
                  SIN CONEXIÓN
                </span>
              </div>
              <div
                style={{
                  height: showComandosList && "100%",
                }}
                className="ConfigComandosChat"
              >
                <ConfigComandosChat
                  showComandosList={showComandosList}
                  handleToggleComandosList={handleToggleComandosList}
                />
              </div>
            </div>
          </div>
          {/* Parte 1 */}
          <div className="part-one-chat">
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
      </div>
      {/* Segunda sección */}
      <div className="second-section">
        <div className="right-panel flex flex-col bg-[#171C1E] grow">
          <div className="right-panel__header flex flex-row items-center justify-between gap-2 px-6">
            <div className="flex flex-row items-center">
              <span className="text-base font-bold">Herramientas de canal</span>
            </div>
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
                    d="M15 11.75H6.25V13.5H15V11.75Z"
                    fill="currentColor"
                  ></path>
                  <path d="M15 3H6.25V4.75H15V3Z" fill="currentColor"></path>
                  <path
                    d="M15 7.375H8V9.125H15V7.375Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M2.75 3.875L6.6875 7.63125C6.6875 8.11226 6.6875 8.38337 6.6875 8.86875L2.75 12.625H1V3.875H2.75Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
          <div className="right-panel__content">
            <div className="flex shrinkS2 flex-col gap-0.5 overflow-y-hidden p-2.5">
              <div
                onClick={() => toggleEQuickActionShow()}
                className="flex flex-row items-center justify-between px-2"
              >
                <span className="text-base font-bold">Acciones rápidas</span>
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
                      style={{
                        transform: QuickActionShow
                          ? "rotate(-180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <path
                        d="M14.7136 11.6L8.99463 6.70318L3.27562 11.6L1.99463 10.4984L8.99463 4.5L15.9946 10.4984L14.7136 11.6Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div
                className={`flex flex-col gap-0 transition-all`}
                style={{
                  animation: "200ms all",
                  height: QuickActionShow ? "auto" : "0",
                  display: QuickActionShow ? "" : "none",
                }}
              >
                <div className="creator-actions-item !h-11 items-center !py-0 !pr-1.5">
                  <div
                    onClick={toggleEditInfoStream}
                    className="base-icon"
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  >
                    <svg
                      width="16"
                      height="16"
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
                  <span>Editar información del stream</span>
                  {/* <button className="ml-auto hover:!bg-[#555c62] variant-text size-sm base-icon-button ml-auto hover:!bg-[#555c62]">
                    <div
                      className="base-icon icon"
                      style={{ width: "16px", height: "16px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.51501 12.485H12.485V10.8H14.485V14.485H1.51501V1.51501H5.20501V3.51501H3.51501V12.485Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M7.755 3.50001V1.51501H14.485V8.24501H12.5V4.91001L6.99 10.415L5.59 9.01002L11.09 3.50001H7.755Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button> */}
                </div>
                {/* <div className="creator-actions-item disabled">
                  <div
                    className="base-icon"
                    style={{ width: "16px", height: "16px" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.555 2.39C12.965 1.805 12.15 1.44 11.255 1.44C9.45499 1.44 7.99999 2.895 7.99999 4.695C7.99999 2.895 6.54499 1.44 4.74499 1.44C2.94499 1.44 1.48999 2.895 1.48999 4.695V11.305C1.48999 13.1 2.94999 14.56 4.74499 14.56C5.64499 14.56 6.45999 14.195 7.04999 13.605C7.63499 13.015 7.99999 12.2 7.99999 11.305C7.99999 13.1 9.45499 14.56 11.255 14.56C13.055 14.56 14.51 13.1 14.51 11.305V4.695C14.51 3.795 14.145 2.98 13.555 2.39ZM9.45499 10.505V9.34H6.49999V11.305C6.49999 12.27 5.71499 13.06 4.74499 13.06C3.77499 13.06 2.98999 12.27 2.98999 11.305V4.695C2.98999 3.725 3.77999 2.94 4.74499 2.94C5.70999 2.94 6.49999 3.725 6.49999 4.695V6.66H9.45499V5.495L13.015 8L9.45499 10.505Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <span>Alojar canal</span>
                </div> */}
              </div>
            </div>
            <div className="flex shrinkS2 grow flex-col gap-2 overflow-y-hidden p-2.5">
              <div
                onClick={() => toggleChannelshares()}
                className="flex flex-row items-center justify-between px-2 py-[2.5px]"
              >
                <span className="text-base font-bold">Acciones de canal</span>
                <button className="variant-text size-md base-icon-button">
                  <div
                    className="base-icon icon"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <svg
                      style={{
                        transform: Channelshares
                          ? "rotate(-180deg)"
                          : "rotate(0deg)",
                      }}
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.7136 11.6L8.99463 6.70318L3.27562 11.6L1.99463 10.4984L8.99463 4.5L15.9946 10.4984L14.7136 11.6Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
              <div
                style={{
                  animation: "200ms all",
                  height: Channelshares ? "auto" : "0",
                  display: Channelshares ? "" : "none",
                }}
              >
                <div className="channel-actions-item">
                  <span>Chat sólo para seguidores</span>
                  <div className="flex flex-row items-center gap-2">
                    <div id="base-toggle-wrapper" className="toggle-size-sm">
                      <div
                        className="base-toggle"
                        onClick={() => toggleChatOnliFollowers()}
                      >
                        <div
                          style={{
                            left: ChatOnliFollowers && "16.4px",
                            background: ChatOnliFollowers && "#53fc18",
                          }}
                          className="base-toggle-indicator"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="channel-actions-item">
                  <span>Modo lento</span>
                  <div className="flex flex-row items-center gap-2">
                    <div id="base-toggle-wrapper" className="toggle-size-sm">
                      <div className="base-toggle">
                        <div className="base-toggle-indicator"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="channel-actions-item">
                  <span>Chat de solo-emotes</span>
                  <div id="base-toggle-wrapper" className="toggle-size-sm">
                    <div className="base-toggle">
                      <div className="base-toggle-indicator"></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="channel-actions-item !pb-0">
                    <span>Advanced bot protection</span>
                    <div id="base-toggle-wrapper" className="toggle-size-sm">
                      <div className="base-toggle">
                        <div className="base-toggle-indicator"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="channel-actions-item channel-actions-link">
                  <span>Términos bloqueados</span>
                  <div
                    className="base-icon"
                    style={{ width: "16px", height: "16px" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.49463 12.902L10.3927 8L5.49463 3.09799L6.59651 2L12.5965 8L6.59651 14L5.49463 12.902Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </div>
                <a
                  aria-current="page"
                  href="/dashboard/stream"
                  className="router-link-active router-link-exact-active"
                >
                  <div className="channel-actions-item channel-actions-link">
                    <span>Panel de control del creador</span>
                    <div
                      className="base-icon"
                      style={{ width: "16px", height: "16px" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.5 12.5V2H2V14H14V12.5H3.5Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M11.4387 3.5L5.97119 8.97125V5.52875H4.47119V11.5287H10.4712V10.0287H7.02869L12.4999 4.56125L11.4387 3.5Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
