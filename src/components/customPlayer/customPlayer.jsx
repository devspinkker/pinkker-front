import React, { useState, useRef, useEffect } from "react";

import "./customPlayer.css";
import ReactFlvPlayer from "../../player/PlayerMain";

import DropdownSettings from "./DropdownSettings";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

import PopupClipCreator from "../popup/PopupClipCreator/PopupClipCreator";

import Slider from "@mui/material/Slider";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { LuClapperboard } from "react-icons/lu";
import { MdHd, MdOutlineFitScreen } from "react-icons/md";
import { Grid, Typography } from "@mui/material";
import { ChatStreaming } from "../dashboard/stream-manager/chat/ChatStreaming";
import { IoIosPause, IoMdPause } from "react-icons/io";
import { AiFillSetting } from "react-icons/ai";
import { FcClapperboard } from "react-icons/fc";
import { getUserByIdTheToken } from "../../services/backGo/user";

export default function CustomPlayer({
  isMobile,
  expanded,
  dashboard,
  streamerName,
  width,
  height,
  left,
  marginLeft,
  chatExpanded,
  setChatExpanded,
  time,
  vod,
  popup,
  closePopup,
  ToggleChat,
  streamerData,
  stream,
}) {
  const { streamer } = useParams();
  let token = window.localStorage.getItem("token");
  const [user, setUser] = useState(null);

  const videoRef = useRef();
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volumePlayer, setVolumePlayer] = useState(0.5);
  const [GetInfoUserInRoom, setGetInfoUserInRoom] = useState(null);

  const [followParam, setFollowParam] = useState(false);
  const [dropdownSettings, setDropdownSettings] = useState(false);

  const [popupClipCreator, setPopupClipCreator] = useState(false);
  const [video, setVideo] = useState(null);

  const [startTime, setStartTime] = useState(time);

  const [multiverse, setMultiverse] = useState(false);

  const [volumeHovered, setVolumeHovered] = useState(false);
  const [FullScreen, setFullScreen] = useState(false);

  const [quality, setQuality] = useState("auto");

  const [showScreenMute, setShowScreenMute] = useState(true);
  const [enableQuality, setEnableQuality] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);

  const togglePopupClipCreator = (video) => {
    setVideo(video);
    setPopupClipCreator(!popupClipCreator);
  };

  const [videoLoading, setVideoLoading] = useState(true);

  async function getUserToken() {
    if (token) {
      try {
        const res = await getUserByIdTheToken(token);
        if (res?.message === "ok" && res?.data?.id) {
          setUser(res.data);
          return res.data;
        }
      } catch (error) { }
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
  }, [streamerData]);

  const [preLoad, setPreLoad] = useState(false);

  useEffect(() => {
    if (preLoad === false) {
      if (
        videoRef.current?.currentTime != NaN &&
        videoRef.current?.currentTime != undefined &&
        videoRef.current?.currentTime != null &&
        videoRef.current?.currentTime != 0
      ) {
        videoRef.current.currentTime = videoRef.current.duration;
        setPreLoad(true);
        setCurrentTime(videoRef.current.currentTime);
      }
    }
  }, []);

  const onMouseEnterSettings = () => {
    if (dropdownSettings === true) {
      setDropdownSettings(false);
    } else {
      setDropdownSettings(true);
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

  function activateSound() {
    setShowScreenMute(false);
    //Play video
    videoRef.current.play();
    videoRef.current.muted = false;
    setMuted(false);
    setVolumePlayer(0.2);
  }

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

  const toggleFullScreen = () => {
    const videoContainer = document.querySelector(".contentCustomScreen");
    setChatExpanded(true);
    setFullScreen(!FullScreen);
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else {
      if (videoContainer) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
          videoContainer.msRequestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) {
          videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) {
          videoContainer.webkitRequestFullscreen();
        }
      }
    }
  };

  const toggleTheaterMode = () => {
    const videoContainer = document.querySelector(".contentCustomScreen");
    const body = document.body;

    if (!videoContainer) return;

    // Alterna el modo teatro
    const isTheaterMode = videoContainer.classList.toggle("theater-mode");
    body.classList.toggle("theater-mode-active", isTheaterMode);

    if (isTheaterMode) {
      // Aplica los estilos de modo teatro
      videoContainer.style.width = "100vw";
      videoContainer.style.height = "100vh";
      videoContainer.style.display = "flex";
      videoContainer.style.alignItems = "center";
      videoContainer.style.justifyContent = "center";
      videoContainer.style.position = "fixed";
      videoContainer.style.top = "0";
      videoContainer.style.left = "0";
      videoContainer.style.backgroundColor = "black";
      videoContainer.style.zIndex = "9999";

      // Asegura que el contenido dentro del contenedor se mantenga en su proporción
      const media = videoContainer.querySelector("img, video");
      if (media) {
        media.style.maxWidth = "100%";
        media.style.maxHeight = "100%";
        media.style.objectFit = "contain";
      }
    } else {
      // Restaura los estilos originales
      videoContainer.style.width = "";
      videoContainer.style.height = "";
      videoContainer.style.display = "";
      videoContainer.style.alignItems = "";
      videoContainer.style.justifyContent = "";
      videoContainer.style.position = "";
      videoContainer.style.top = "";
      videoContainer.style.left = "";
      videoContainer.style.backgroundColor = "";
      videoContainer.style.zIndex = "";

      // Restaura el estilo del contenido interno
      const media = videoContainer.querySelector("img, video");
      if (media) {
        media.style.maxWidth = "";
        media.style.maxHeight = "";
        media.style.objectFit = "";
      }
    }
  };

  function getHlsSrc() {
    var keyTransmission;
    keyTransmission = streamerData?.keyTransmission.substring(
      4,
      streamerData.keyTransmission.length
    );

    // if (quality === "720") {
    //   keyTransmission =
    //     streamerData.keyTransmission.substring(
    //       4,
    //       streamerData.keyTransmission.length
    //     ) + "_720";
    // }

    // if (quality === "480") {
    //   keyTransmission =
    //     streamerData.keyTransmission.substring(
    //       4,
    //       streamerData.keyTransmission.length
    //     ) + "_480";
    // }

    // if (quality === "360") {
    //   keyTransmission =
    //     streamerData.keyTransmission.substring(
    //       4,
    //       streamerData.keyTransmission.length
    //     ) + "_360";
    // }

    const rtmp = process.env.REACT_APP_RTMP;
    // const rtmp = "http://localhost:8000/live";
    var url = `${rtmp}/${keyTransmission}`;
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
          height: FullScreen && "100%",
          width: FullScreen && chatExpanded && "100%",
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
          autoPlay={playing}
          muted={muted}
          controls={false}
          width={width ? width : FullScreen ? "80% " : "100%"}
          height={height ? height : FullScreen ? "100%" : "835px"}
          expanded={expanded}
          quality={quality}
          stream={stream?.id}
          streamerDataID={streamerData.id}
          stream_thumbnail={stream?.stream_thumbnail}
        />
        {FullScreen && (
          <div
            className="channel-chat"
            style={{
              width: "30%",
              display: !chatExpanded && "none",
              height: "100%",
              top: "-1%",
            }}
          >
            <ChatStreaming
              streamerChat={stream}
              chatExpandeds={chatExpanded}
              ToggleChat={ToggleChat}
              streamerData={streamerData}             
              user={user}
              isMobile={isMobile}
              
            />
          </div>
        )}
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

  //Get Random String
  function getRandomString() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  const handleClip = async () => {
    const totalKey = streamerData?.keyTransmission.substring(4);
    window.open(
      `/clips/create/?totalKey=${totalKey}`,
      "ClipCreation",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
    // window.open(
    //   `/clips/create/?totalKey=${totalKey}`,

    //   "_blank"
    // );
  };

  function getTopButtom() {
    if (videoRef?.current != null && videoRef?.current != undefined) {
      if (popup === true) {
        return (
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.541)",
              justifyContent: "space-between",
              width: "100%",
              zIndex: "9999",
              left: "0px",
              top: "50px",
            }}
            className="customPlayer-top"
          >
            <div
              style={{ width: "180px", textAlign: "left", marginLeft: "5px" }}
            >
              <h4
                style={{
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  color: "#ededed",
                }}
              >
                Estas viendo a {streamerName}
              </h4>
            </div>
            <div
              style={{ position: "relative", top: "-0px", left: "-5px" }}
              onClick={() => closePopup()}
              className="customPlayer-close-popup"
            >
              <i style={{ cursor: "pointer" }} class="fas fa-times" />
            </div>
          </div>
        );
      } else {
        return (
          <div
            style={{
              width: FullScreen && chatExpanded && "75%",
              justifyContent: !FullScreen && "flex-end",
            }}
            className="customPlayer-top"
          >
            {FullScreen && (
              <Grid
                style={{
                  display: "flex",
                  gap: "10px",
                  borderRadius: "5px",
                  padding: 5,
                }}
              >
                <img
                  src={streamerData?.Avatar}
                  style={{
                    width: "60px", // Ajusta este tamaño según tu preferencia
                    height: "60px",
                    borderRadius: "50%",
                    border: "1px solid #fff",
                  }}
                />

                {/* Contenedor de Nombre y Botones */}
                <Grid
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  {/* Nombre del usuario */}
                  <Typography
                    style={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: "16px", // Tamaño grande como en la imagen
                    }}
                  >
                    {streamerData?.NameUser}
                  </Typography>
                  <Typography style={{ color: "white", fontSize: 14 }}>
                    {stream?.stream_title}
                  </Typography>
                  <Typography
                    style={{ color: "white", fontSize: 14, fontWeight: 800 }}
                  >
                    Está transmitiendo {stream?.stream_category} para{" "}
                    {stream?.ViewerCount} personas
                  </Typography>
                </Grid>
              </Grid>
            )}

            <Typography
              style={{
                color: "white",
                fontSize: ".9rem",

                background: "red",
                padding: "0px .5rem",
                fontFamily: "inter",
                borderRadius: 5,
              }}
            >
              EN DIRECTO
            </Typography>

            {FullScreen && !chatExpanded && (
              <img
                onClick={ToggleChat}
                style={{
                  width: "1%",
                  cursor: "pointer",
                  textAlign: "center",
                  color: "white",
                  position: "fixed",
                  right: "1%",
                  transform: "rotate(180deg)",
                  zIndex: "99999",
                }}
                className="chat-button-more"
                src="/images/iconos/contraer.png"
              />
            )}
          </div>
        );
      }
    }
  }

  function popupwindow(url, title, w, h) {
    var y = window.outerHeight / 2 + window.screenY - h / 2;
    var x = window.outerWidth / 2 + window.screenX - w / 2;
    return window.open(
      url,
      title,
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        y +
        ", left=" +
        x
    );
  }

  function getBottomButtons() {
    if (videoRef.current != null && videoRef.current != undefined) {
      if (popup === true) {
        return (
          <div
            className="customPlayer-container"
            style={{ width: FullScreen && chatExpanded && "80% !important" }}
          >
            <div className="customPlayer-primary">
              <div
                style={{ justifyContent: "center" }}
                className="customPlayer-secundary-div"
              >
                <div
                  style={{ marginRight: "15px" }}
                  className="customPlayer-card"
                >
                  {playing ? (
                    <Tippy
                      theme="pinkker"
                      content={
                        <h1
                          style={{
                            fontSize: "12px",
                            fontFamily: "Montserrat",
                            marginRight: "10px",
                          }}
                        >
                          Pausa
                        </h1>
                      }
                    >
                      <i
                        onClick={() => videoHandler()}
                        style={{ cursor: "pointer" }}
                        class="fas fa-pause custom-player-popup-icon"
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
                        class="fas fa-play custom-player-popup-icon"
                      />
                    </Tippy>
                  )}
                </div>
                <div className="customPlayer-card">
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Volver al stream
                      </h1>
                    }
                  >
                    <Link to={"/" + streamerName}>
                      <i
                        onClick={() => videoHandler()}
                        style={{ cursor: "pointer", color: "#ededed" }}
                        class="fas fa-expand-alt custom-player-popup-icon"
                      />
                    </Link>
                  </Tippy>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div
            className="customPlayer-container"
            style={{ width: FullScreen && chatExpanded && "80%" }}
          >
            <div
              style={{
                position: "relative",
                top: "-73px",
                width: FullScreen && chatExpanded && "97%",
              }}
              className="customPlayer-primary"
            >
              <div className="customPlayer-secundary-div">
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

              <div
                style={{ marginLeft: expanded && "-50px" }}
                className="customPlayer-secundary-div2"
              >
                {/*<div className="customPlayer-card">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Entrar al Multiverso</h1>}>
                                    <i onClick={() => setMultiverse(true)} style={{cursor: "pointer"}} class="fas fa-hotel button-more-player"/>
                                </Tippy>
                                </div>*/}

                <div className="customPlayer-card">
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Crear clip
                      </h1>
                    }
                  >
                    <Grid
                      style={{
                        color: "white",
                        padding: 5,
                        borderRadius: 5,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.13)",
                        gap: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleClip()}
                    >
                      <LuClapperboard
                        style={{
                          cursor: "pointer",
                          fontSize: "18px !important",
                          color: "white",
                        }}
                      />
                      <Typography>Crear Clip</Typography>
                    </Grid>
                  </Tippy>
                </div>
                <div className="customPlayer-card">
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Calidad
                      </h1>
                    }
                  >
                    <MdHd
                      class=" pinkker-button-more button-more-player"
                      onClick={() => setEnableQuality(!enableQuality)}
                      style={{ cursor: "pointer", fontSize: "18px !important" }}
                    />
                  </Tippy>
                </div>

                <div className="customPlayer-card">
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Configuración
                      </h1>
                    }
                  >
                    <AiFillSetting
                      onClick={onMouseEnterSettings}
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      className="pinkker-button-more"
                    />
                  </Tippy>
                </div>

                <div className="customPlayer-card">
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Full Screen
                      </h1>
                    }
                  >
                    <i
                      onClick={() => toggleFullScreen()}
                      style={{ cursor: "pointer" }}
                      class="fas fa-expand pinkker-button-more button-more-player"
                    />
                  </Tippy>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div
      style={{
        left: expanded === true ? "225px" : "70px",
      }}
      className={popup === true ? "custom-player-popup" : "custom-player"}
    >
      {popup === false && <div className="customPlayer-shadow-1"></div>}
      <div className="contentCustomScreen">
        {getTopButtom()}
        {getHlsPlayer()}

        {/* {dashboard === false && videoLoading === true && (
        <div className="pinkker-player-loading">
          <ScaleLoader color="#f36197d7" />
        </div>
      )} */}
        {/* {dashboard ===  && showScreenMute === true && ( */}
        {/* )} */}
        {/* <div className="customPlayer-shadow-1"></div> */}
        {getBottomButtons()}
        {dropdownSettings && (
          <DropdownSettings
            streamer={streamer}
            quality={quality}
            changeQuality={(e) => setQuality(e)}
          />
        )}
        {popupClipCreator && (
          <PopupClipCreator
            streamer={streamer}
            closePopup={() => togglePopupClipCreator()}
            video={video}
          />
        )}
        {enableQuality && (
          <ul className={"dropdownsettings-menu"}>
            <div
              className={
                "dropdownsettings-container " + FullScreen &&
                "dropdownsettings-FullScreen"
              }
            >
              <div>
                <li>
                  <div className="dropdownsettings-content">
                    <div onClick={() => setEnableQuality(false)}>
                      <h4>
                        <i
                          style={{ marginRight: "5px" }}
                          class="fas fa-chevron-left"
                        ></i>{" "}
                        Calidad de video
                      </h4>
                    </div>
                  </div>
                </li>

                <hr
                  style={{ border: "1px solid #4b4b4b8f", margin: "10px auto" }}
                />

                <li onClick={() => setQuality("auto")}>
                  <div className="dropdownsettings-content">
                    <div
                      className="dropdownsettings-radio"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input type="radio" checked={quality === "auto"} />
                      <span style={{ marginLeft: "5px" }}>Automática</span>
                    </div>
                  </div>
                </li>
                <li onClick={() => setQuality("1080")}>
                  <div className="dropdownsettings-content">
                    <div
                      className="dropdownsettings-radio"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input type="radio" checked={quality === "1080"} />
                      <span style={{ marginLeft: "5px" }}>1080p</span>
                    </div>
                  </div>
                </li>
                <li onClick={() => setQuality("720")}>
                  <div className="dropdownsettings-content">
                    <div
                      className="dropdownsettings-radio"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input type="radio" checked={quality === "720"} />
                      <span style={{ marginLeft: "5px" }}>720p</span>
                    </div>
                  </div>
                </li>

                <li onClick={() => setQuality("480")}>
                  <div className="dropdownsettings-content">
                    <div
                      className="dropdownsettings-radio"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input type="radio" checked={quality === "480"} />
                      <span style={{ marginLeft: "5px" }}>480p</span>
                    </div>
                  </div>
                </li>

                <li onClick={() => setQuality("360")}>
                  <div className="dropdownsettings-content">
                    <div
                      className="dropdownsettings-radio"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input type="radio" checked={quality === "360"} />
                      <span style={{ marginLeft: "5px" }}>360p</span>
                    </div>
                  </div>
                </li>
              </div>
            </div>
          </ul>
        )}
      </div>
    </div>
  );
}
