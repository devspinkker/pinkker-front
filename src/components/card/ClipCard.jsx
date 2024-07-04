import React, { useEffect, useRef, useState } from "react";

import "./ClipCard.css";
import { Link } from "react-router-dom";
import SelectVideoClip from "../home/clips/SelectVideoClip";
import Modal from 'react-modal';
export default function ClipCard({ video, ...props }) {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [viewVideo, setViewVideo] = useState(false);
  const videoRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const toggleSelect = () => {
    setSelectedVideo(!selectedVideo);
  };

  const handleEnter = () => {
    setMouseEnter(!mouseEnter);
    
  };

  const handleLeave = () => {
    setMouseEnter(false);
    setViewVideo(false);
  };

  function getVideoPreview() {
    return (
      <div className="clipcard-video-preview">
        {viewVideo ? (
          <video
            src={video.url}
            muted={true}
            autoPlay={true}
            style={{
              borderRadius: "5px",
              width: props.imageWidth ? props.imageWidth : props.width,
              height: props.height,
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            style={{
              borderRadius: "5px",
              width: props.imageWidth ? props.imageWidth : props.width,
              height: props.height,
              objectFit: "cover",
            }}
            src={video.streamThumbnail}
            alt=""
          />
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ width: "35px", borderRadius: "50px", marginTop: "10px" }}
            src={video.Avatar}
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
              {video?.clipTitle}
            </h4>
            <p style={{ fontSize: "12px" }}>{video?.streamerId}</p>
            <p style={{ fontSize: "10px" }}>
              Clipeado por {video?.nameUserCreator}
            </p>
          </div>
        </div>
      </div>
    );
  }
  const playVideo = () => {
    videoRef.current.play();
  };

  const pauseVideo = () => {
    videoRef.current.pause();
  };

  const handleVolumeChange = (e) => {
    videoRef.current.volume = e.target.value;
  };
  function getImagePreview() {
    return (
      <div
        className="clipcard-image-preview"
        onClick={() => setSelectedVideo({ video })}
      >
        <img
          style={{
            borderRadius: "5px",
            width: "100%",
          }}
          src={video?.streamThumbnail}
          alt=""
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            src={video?.Avatar}
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
              {video?.clipTitle}
            </h4>
            <p style={{ fontSize: "12px" }}>{video?.streamerId}</p>
            <p style={{ fontSize: "10px" }}>
              Clipeado por {video?.nameUserCreator}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => handleEnter()}
      // onMouseLeave={() => handleLeave()}
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
            <i style={{ marginRight: "2px" }} class="fas fa-play" />{" "}
            {video?.views}
          </p>
        </div>
      </div>

      {selectedVideo && (
        <Modal
          isOpen={mouseEnter}
          ariaHideApp={false}
          onRequestClose={toggleSelect}
          contentLabel="Video Modal"
          className="video-modal"
          overlayClassName="video-overlay"
        >
          {selectedVideo?.video?.url && (
            <div className="video-container">
              <video ref={videoRef} src={selectedVideo?.video.url} controls autoPlay />
              {/* <div className="video-controls">
              <button onClick={playVideo}>Play</button>
              <button onClick={pauseVideo}>Pause</button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={handleVolumeChange}
              />
            </div> */}
            </div>
          )}
        </Modal>
        // <SelectVideoClip
        //   clip={selectedVideo.video}
        //   toggleSelect={toggleSelect}
        // />
      )}
    </div>
  );
}
