import React, { useEffect, useState } from "react";

import "./ClipCard.css";

export default function ClipCard({ video, ...props }) {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [viewVideo, setViewVideo] = useState(false);
  const [timeHover, setTimeHover] = useState(false);
  useEffect(() => {
    console.log(video.Avatar);
  }, []);

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
            src={props.url}
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
            src={
              "https://static-cdn.jtvnw.net/previews-ttv/live_user_markitonavaja-440x248.jpg"
            }
            alt=""
          />
        )}

        <div
          style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}
        >
          <img
            style={{ width: "35px", borderRadius: "50px", marginTop: "10px" }}
            src={video.Avatar}
          />
          <div style={{ marginTop: "10px", marginLeft: "5px" }}>
            <h4 style={{ color: "white", fontSize: "14px" }}>{props.title}</h4>
            <p style={{ fontSize: "13px" }}>{props.views} vistas · hace 2m </p>
          </div>
        </div>
      </div>
    );
  }

  function getImagePreview() {
    return (
      <div className="clipcard-image-preview">
        <img
          style={{
            borderRadius: "5px",
            width: props.imageWidth ? props.imageWidth : props.width,
            height: props.height,
            objectFit: "cover",
          }}
          src={
            "https://static-cdn.jtvnw.net/previews-ttv/live_user_markitonavaja-440x248.jpg"
          }
          alt=""
        />
        <div
          style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}
        >
          <img
            style={{ width: "35px", borderRadius: "50px", marginTop: "10px" }}
            src={video.Avatar}
          />
          <div style={{ marginTop: "10px", marginLeft: "5px" }}>
            <h4 style={{ color: "white", fontSize: "14px" }}>{props.title}</h4>
            <p style={{ fontSize: "12px" }}>{video?.nameUserCreator}</p>
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
        maxWidth: props.width,
        minWidth: props.width,
        height: props.height,
        display: props.dashboard ? "flex" : "block",
      }}
      className="clipcard-body"
    >
      <div className="clipcard-container">
        <div className="clipcard-image">
          {mouseEnter ? getVideoPreview() : getImagePreview()}
          <p
            style={{ color: "#ededed", fontFamily: "Poppins" }}
            className="clipcard-duration"
          >
            <i style={{ marginRight: "2px" }} class="fas fa-play" />{" "}
            {props.views}
          </p>
        </div>
      </div>
    </div>
  );
}
