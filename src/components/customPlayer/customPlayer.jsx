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
export default function CustomPlayer({
  isMobile,
  expanded,
  dashboard,
  setViewInfoStream,
  streamerName,
  width,
  height,
  left,
  marginLeft,
  time,
  vod,
  popup,
  closePopup,
  streamerData,
}) {
  const { streamer } = useParams();

  const videoRef = useRef();
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volumePlayer, setVolumePlayer] = useState(0.5);

  const [dropdownSettings, setDropdownSettings] = useState(false);

  const [popupClipCreator, setPopupClipCreator] = useState(false);
  const [video, setVideo] = useState(null);

  const [startTime, setStartTime] = useState(time);

  const [multiverse, setMultiverse] = useState(false);

  const [volumeHovered, setVolumeHovered] = useState(false);

  const [quality, setQuality] = useState("auto");

  const [showScreenMute, setShowScreenMute] = useState(true);

  const [currentTime, setCurrentTime] = useState(null);

  const togglePopupClipCreator = (video) => {
    setVideo(video);
    setPopupClipCreator(!popupClipCreator);
  };

  const [videoLoading, setVideoLoading] = useState(true);

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

  useEffect(() => {
    if (
      videoRef.current?.currentTime != NaN &&
      videoRef.current?.currentTime != undefined &&
      videoRef.current?.currentTime != null &&
      videoRef.current?.currentTime != 0
    ) {
      if (videoRef.current?.duration - videoRef.current?.currentTime > 60) {
        videoRef.current.currentTime = videoRef.current.duration - 30;
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
    var el = document.getElementById("pinkker-player");
    if (el) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    }
  };

  function getHlsSrc() {
    let keyTransmission = streamerData?.keyTransmission.substring(
      4,
      streamerData.keyTransmission.length
    );
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
        width={width ? width : "100%"}
        height={height ? height : "835px"}
        expanded={expanded}
      />
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

    window.open(`/clips/create/?totalKey=${totalKey}`, "_blank");
  };

  function getTopButtom() {
    if (videoRef.current != null && videoRef.current != undefined) {
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
            style={{ marginLeft: expanded && "-50px" }}
            className="customPlayer-top"
          >
            <div className="channel--player-online">
              {/* <h4>EN DIRECTO</h4> */}
            </div>
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
          <div className="customPlayer-container">
            <div
              style={{ marginTop: "-85px", justifyContent: "center" }}
              className="customPlayer-primary"
            >
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
          <div className="customPlayer-container">
            <div
              style={{ position: "relative", top: "-86px" }}
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
                      <i
                        onClick={() => videoHandler()}
                        style={{ cursor: "pointer" }}
                        class="fas fa-pause pinkker-button-more"
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
                    style={{ opacity: volumeHovered ? "1" : "0" }}
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
                    <i
                      onClick={() => handleClip()}
                      style={{ cursor: "pointer" }}
                      class="fas fa-cut pinkker-button-more button-more-player"
                    />
                  </Tippy>
                </div>

                {/* <div className="customPlayer-card">
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
                    <i
                      onClick={onMouseEnterSettings}
                      style={{ cursor: "pointer" }}
                      class="fas fa-cog pinkker-button-more button-more-player"
                    />
                  </Tippy>
                </div> */}

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
      {getTopButtom()}
      {popup === false && <div className="customPlayer-shadow-1"></div>}
      {getHlsPlayer()}

      {dashboard === false && videoLoading === true && (
        <div className="pinkker-player-loading">
          <ScaleLoader color="#f36197d7" />
        </div>
      )}
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
    </div>
  );
}
