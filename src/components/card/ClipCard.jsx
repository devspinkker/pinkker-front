import React, { useEffect, useRef, useState } from "react";
import "./ClipCard.css";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Tippy from "@tippyjs/react";

export default function ClipCard({ video, ...props }) {
  const [viewVideo, setViewVideo] = useState(false);
  const videoRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [volumePlayer, setVolumePlayer] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);

  const handleEnter = () => {
    setIsModalOpen(true);
  };

  const handleLeave = () => {
    setShowVolumeControls(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const playVideo = () => {
    videoRef.current.play();
    setPlaying(true);
  };

  const pauseVideo = () => {
    videoRef.current.pause();
    setPlaying(false);
  };

  const handleVolumeChange = (e) => {
    videoRef.current.volume = e.target.value;
    if (videoRef.current.volume === 0) {
      setMuted(true);
    } else {
      setMuted(false);
    }
    setVolumePlayer(e.target.value);
  };

  const handleTimeUpdate = () => {
    const currentProgress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);
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

  const handleHover = () => {
    setShowVolumeControls(true);
  };

  const videoHandler = () => {
    if (playing) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  const toggleFullScreen = () => {
    const player = document.querySelector(".reactPlayer");
    player.requestFullscreen();
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
                    volumePlayer === 0
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
              {/* <ProgressBar /> */}
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
  const handleCardClick = () => {
    if (props.User && props.id) {
      const url = `/${props.User.NameUser}/${props.id}`;
      window.location.href = url;
    } else {
      console.error("User or id is missing");
    }
  };
  const handleCardClickClip = () => {
    const url = `/plataform/clips/${props.id}`;
    window.location.href = url;
  };
  function getImagePreview() {
    return (
      <div
        className="clipcard-image-preview"
        onClick={() => {
          if (video.StreamThumbnail) {
            handleCardClick();
          } else {
            handleCardClickClip();
          }
        }}
      >
        <img
          style={{
            borderRadius: "15px",
            width: "100%",
          }}
          src={video?.streamThumbnail ?? video?.StreamThumbnail}
          alt=""
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={video?.Avatar ?? video?.UserInfo?.Avatar}
            className="clip-image-avatar"
          />
          <div
            style={{
              marginTop: "10px",
              marginLeft: "5px",
              display: "flex",
              gap: "2px",
              flexDirection: "column",
            }}
          >
            <h4 style={{ color: "white", fontSize: "14px" }}>
              {video?.clipTitle ?? video?.Title}
            </h4>
            <p style={{ fontSize: "12px" }}>{video?.streamerId}</p>
            <p style={{ fontSize: "10px" }}>
              {video?.nameUserCreator && (
                <>Clipeado por<Link to={`/${video?.nameUserCreator}`} className="clipName">{video?.nameUserCreator}</Link></>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "maxContent",
        display: props.dashboard ? "flex" : "block",
      }}
      className="clipcard-body"
    >
      <div className="clipcard-container">
        <div className="clipcard-image">
          {getImagePreview()}
          <p
            style={{ color: "#ededed", fontFamily: "Poppins" }}
            className="clipcard-duration"
          >
            <i style={{ marginRight: "2px" }} className="fas fa-play" />{" "}
            {video?.views}
          </p>
        </div>
      </div>

      {selectedVideo && (
        <Modal
          isOpen={isModalOpen}
          contentLabel="Video Modal"
          className="video-modal"
          overlayClassName="video-overlay"
          ariaHideApp={false}
          onRequestClose={closeModal}
        >
          {selectedVideo?.video?.url && (
            <div className="video-container">
              <div className="video-header">
                <div className="video-user-info">
                  <Link to={"/" + selectedVideo?.video?.streamerId}>
                    <img
                      src={selectedVideo?.video?.Avatar}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span className="video-username">
                      {selectedVideo?.video?.nameUserCreator}
                    </span>
                    <span className="video-views">
                      {selectedVideo?.video?.views} views
                    </span>
                  </div>
                </div>
                <button className="close-button" onClick={closeModal}>
                  X
                </button>
              </div>
              <video
                className="reactPlayer"
                ref={videoRef}
                src={selectedVideo?.video?.url}
                autoPlay
                controls
                onTimeUpdate={handleTimeUpdate}
              />
              <div className="video-controls">
                {playing ? (
                  <i
                    onClick={pauseVideo}
                    style={{ cursor: "pointer", color: "white" }}
                    className="fas fa-pause"
                  />
                ) : (
                  <i
                    onClick={playVideo}
                    style={{ cursor: "pointer", color: "white" }}
                    className="fas fa-play"
                  />
                )}
                <i
                  onClick={() => setVolumePlayer(0)}
                  style={{ cursor: "pointer", color: "white" }}
                  className={
                    volumePlayer == 0
                      ? "fas fa-volume-mute pinkker-button-more-selectClips"
                      : "fas fa-volume-up pinkker-button-more-selectClips"
                  }
                />
                <div
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                  style={{
                    position: "absolute",
                    left: "-3%",
                    top: "70%",
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
                <div className="progress-barHome">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => {
                      const seekTo =
                        videoRef.current.duration * (e.target.value / 100);
                      videoRef.current.currentTime = seekTo;
                    }}
                  />
                </div>
              </div>
              <div className="video-footer">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <p>{selectedVideo?.video?.clipTitle}</p>
                  <p>
                    Clipped by{" "}
                    <span className="video-username">
                      {selectedVideo?.video?.nameUserCreator}
                    </span>
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <span>
                    {formatTimestamp(
                      selectedVideo?.video?.timestamps.createdAt
                    )}
                  </span>
                  <a
                    href={selectedVideo?.video?.url}
                    className="download-button"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
