import React, { useState, useRef } from "react";
import "./Clips.css";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { MoreViewOfTheClip } from "../../../services/backGo/clip";

import Tippy from "@tippyjs/react";
import VideoClipsExplorar from "../../../player/VideoClipsExplorar";

export default function SelectVideoClip({ clip, toggleSelect }) {

  const [progress, setProgress] = useState(0);
  const token = window.localStorage.getItem("token");
  const [showLoader, setShowLoader] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [volumePlayer, setVolumePlayer] = useState(1);
  const [muted, setMuted] = useState(false);
  const player = useRef(null);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const handleProgress = async (e) => {
    if (e.target) {
      const { duration, currentTime } = e.target;
      const newProgress = (currentTime / duration) * 100;
      setProgress(newProgress);

      if (newProgress > 50.0 && newProgress < 50.5) {
        if (token) {
          await MoreViewOfTheClip(clip.id, token);
        }
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const currentDate = new Date();
    const clipDate = new Date(timestamp);
    const diffInSeconds = Math.floor((currentDate - clipDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  const closedClip = () => {
    setShowLoader(true);
    toggleSelect();
  };

  const handleOnReady = () => {
    setShowLoader(false);
  };

  const handleOnError = () => {
    setShowLoader(true);
  };

  const videoHandler = () => {
    if (player.current) {
      if (playing) {
        player.current.pause(); // Pausar el video
      } else {
        player.current.play(); // Reproducir el video
      }
      setPlaying(!playing); // Cambiar el estado de reproducción
    }
};

  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    if (volume === 0) {
      setMuted(true);
    } else {
      setMuted(false);
    }
    setVolumePlayer(volume);
  };
  const toggleFullScreen = () => {
    const videoElement = player.current; 
    if (videoElement && videoElement.requestFullscreen) {
      videoElement.requestFullscreen(); 
    } else {
      console.error("El elemento no soporta requestFullscreen o es null.");
    }
  };
  
  const handleProgressChange = (e) => {
    const videoElement = player.current; 
    if (videoElement && videoElement.duration) {
      const newTime = (e / 100) * videoElement.duration; 
      videoElement.currentTime = newTime; 
      setProgress(e); 
    }
  };
  

  const ProgressBar = () => {
    return (
      <input
        type="range"
        min={0}
        max={100}
        step={0.01}
        value={progress}
        onChange={(e) => handleProgressChange(parseFloat(e.target.value))}
      />
    );
  };
  const handleHover = () => {
    setShowVolumeControls(true);
  };

  const handleLeave = () => {
    setShowVolumeControls(false);
  };

  const handleDownload = async () => {
    if (!player.current) {
      console.error("El reproductor no está inicializado.");
      return;
    }
    
    const videoElement = player.current;
    const videoSrc = videoElement.src;
    
    if (!videoSrc) {
      console.error("No se pudo acceder al contenido del video.");
      return;
    }
    
    if (videoSrc.endsWith(".mp4")) {
      const anchor = document.createElement("a");
      anchor.href = videoSrc;
      anchor.download = "video.mp4";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else if (clip.m3u8Content) {
      const blob = new Blob([clip.m3u8Content], { type: "application/vnd.apple.mpegurl" });
      const m3u8Url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = m3u8Url;
      anchor.download = "stream.m3u8";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(m3u8Url);
    } else {
      console.error("El formato del video no es compatible para la descarga.");
    }
  };


  function getBottomButtons() {
    return (
      <div className="customPlayer-container-selectClips">
        <div
          style={{ position: "relative" }}
          className="customPlayer-primary-selectClips"
        >
          <div className="customPlayer-secundary-div-selectClips">
            <div className="customPlayer-card-selectClips">
              {playing ? (
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Pausa
                    </h1>
                  }
                >
                  <i
                    onClick={() => videoHandler()}
                    style={{ cursor: "pointer" }}
                    className="fas fa-pause pinkker-button-more-selectClips"
                  />
                </Tippy>
              ) : (
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Play
                    </h1>
                  }
                >
                  <i
                    onClick={() => videoHandler()}
                    style={{ cursor: "pointer" }}
                    className="fas fa-play pinkker-button-more-selectClips"
                  />
                </Tippy>
              )}
            </div>
            <div
              className="customPlayer-card-selectClips"
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Volumen
                  </h1>
                }
              >
                <i
                  onClick={() => setVolumePlayer(0)}
                  style={{ cursor: "pointer" }}
                  className={
                    volumePlayer == 0
                      ? "fas fa-volume-mute pinkker-button-more-selectClips"
                      : "fas fa-volume-up pinkker-button-more-selectClips"
                  }
                />
              </Tippy>
            </div>

            <div
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
              style={{
                position: "absolute",
                left: "-23px",
                top: "-88px",
                width: "",
                transition: "1s ",
                opacity: !showVolumeControls && "0",
              }}
              className="customPlayer-card-selectClips"
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volumePlayer}
                onChange={handleVolumeChange}
                style={{ transform: "rotate(270deg)" }}
              />
            </div>
            <div
              style={{ width: "100%" }}
              className="customPlayer-card-selectClips"
            >
              <ProgressBar />
            </div>
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Full Screen
                </h1>
              }
            >
              <i
                onClick={() => toggleFullScreen()}
                style={{ cursor: "pointer" }}
                className="fas fa-expand pinkker-button-more button-more-player"
              />
            </Tippy>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="container_clip"
      style={{
        position: "fixed",
        top: "15px ",
        left: 0,
        width: "100%",
        height: "110%",
        background: "rgba(0, 0, 0, 0.8)",
        zIndex: 999898898,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      <div className="container_clip_data">
        <div
          style={{
            width: "100%",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="container_data_user">
            <Link to={"/" + clip.streamerId}>
              <img src={clip.Avatar} alt="" />
            </Link>
            <div>
              <Link to={"/" + clip.streamerId}>
                <h1 style={{ fontWeight: "bolder" }}>{clip.streamerId}</h1>
              </Link>
              <span style={{ color: "#fff", paddingLeft: "4px" }}>
                <span style={{ fontSize: "20px", paddingRight: "5px" }}>
                  {clip.views}
                </span>
                views
              </span>
            </div>
          </div>
          <div className="closedTargetClip" onClick={() => closedClip()}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 1.99602L10.504 0.5L6 4.99867L1.49602 0.5L0 1.99602L4.49867 6.5L0 11.004L1.49602 12.5L6 8.00133L10.504 12.5L12 11.004L7.50133 6.5L12 1.99602Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>

        <div
          style={{
            height: "50vh",
          }}
        >

<VideoClipsExplorar
         url={clip.url}
         className="reactPlayer"
         controls={true}
         playing={playing} // Agregado para controlar la reproducción/pausa
         volume={volumePlayer} // Agregado para controlar el volumen
         width="100%"
         height="100%"
         onError={handleOnError}
        //  style={{ display: showLoader && "none" }}
        videoRef={player}
         src={clip.url}
         m3u8Content={clip.m3u8Content}
         streamThumbnail={clip.streamThumbnail}
         isMuted={muted}
         onTimeUpdate={handleProgress} 
         onPlay={handleOnReady}

/>

          {!showLoader && getBottomButtons()}

          {showLoader && (
            <div className="loader-container">
              <div className="loading-spinner"></div>
            </div>
          )}
          <div
            style={{ width: "100%", borderRadius: "0", height: "2px" }}
            className="time_progressbarContainer"
          >
            <div
              style={{ width: `${progress}%` }}
              className="time_progressBar"
            ></div>
          </div>
        </div>
        <div className="container_data">
          <div style={{ width: "100%", height: "100%" }}>
            <div className="container_data_clip">
              <div className="containerCreator-title">
                <span className="title-clip-card-select">{clip.clipTitle}</span>
                <Link to={"/" + clip.nameUserCreator}>
                  <p>
                    <span style={{ color: "#6b7280", fontFamily: "inter" }}>
                      Clipeado por{" "}
                    </span>
                    <span style={{ color: "#3dd179" }}>
                      {clip.nameUserCreator}
                    </span>
                  </p>
                </Link>
              </div>
              <div
                className=""
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span>{formatTimestamp(clip.timestamps.createdAt)}</span>
                <div
                  style={{
                    cursor: "pointer",
                    background: "#3f4448",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    marginTop: "2px",
                  }}
                >
                  <span
                 onClick={  handleDownload}
                  >
            
                      Download
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
