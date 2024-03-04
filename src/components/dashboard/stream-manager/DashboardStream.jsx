import React, { useState, useEffect, useRef } from "react";
import "./DashboardStream.css";
import { ChatStreaming } from "./chat/ChatStreaming";
import { getUserByIdTheToken } from "../../../services/backGo/user";
import { getStreamById } from "../../../services/backGo/streams";
import { getCategorieByName } from "../../../services/categories";
import { getStream } from "../../../services/stream";
import ReactFlvPlayer from "../../../player/PlayerMain";

export default function DashboardStream({ isMobile }) {
  const [streamerData, setStreamerData] = useState(null);
  const [userData, SetUserData] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const [videoLoading, setVideoLoading] = useState(true);

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
    <div id="DashboardStream-container">
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
              <div className="Información-sesión">
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
                        className="max-w-full shrink truncate text-base font-bold text-white"
                      >
                        Información de sesión
                      </span>
                    </div>
                    <div className="ml-auto flex shrink-0 flex-row items-center gap-1">
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
                    {/* <div className="stats-container">
                      <span className="w-fit grow-0 rounded-[2px] px-[0.375rem] py-1 text-center text-[0.625rem] font-bold uppercase bg-[#F4F5F6] text-[#070809]">
                        Sin conexión
                      </span>
                      <span className="label">Sesión</span>
                    </div> */}
                    <div className="stats-container">
                      <span className="data">
                        - {streamerData?.ViewerCount}
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
                        <p className="elapsedTime">
                          <p>{`${formatNumber(elapsedTime.hours)}`}</p>
                          <p>{`: ${formatNumber(elapsedTime.minutes)}`}</p>
                          <p>{`: ${formatNumber(elapsedTime.seconds)}`}</p>
                        </p>
                      </span>
                      <span className="label">Tiempo en vivo</span>
                    </div>
                  </div>
                </section>
              </div>
              <div className="Broadcast-preview-dashboard">
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
              </div>
              <div>Elemento 3</div>
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
      <div className="second-section">Segunda sección</div>
    </div>
  );
}
