import React, { useEffect, useState } from "react";

import "./ClipCard.css";
import { Link } from "react-router-dom";
import SelectVideoClip from "../home/clips/SelectVideoClip";

export default function ClipCard({ video, ...props }) {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [viewVideo, setViewVideo] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const toggleSelect = () => {
    setSelectedVideo(!selectedVideo);
  };
  const handleEnter = () => {
    setMouseEnter(true);
    setTimeout(() => {
      setViewVideo(true);
    }, 1000);
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
      onMouseOver={() => handleEnter()}
      onMouseLeave={() => handleLeave()}
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
        <SelectVideoClip
          clip={selectedVideo.video}
          toggleSelect={toggleSelect}
        />
      )}
    </div>
  );
}
