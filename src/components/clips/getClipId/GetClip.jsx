import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Clip.css";
import { GetClipId } from "../../../services/backGo/clip";
import { Link } from "react-router-dom";

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

export function GetClip() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [DataClip, setDataClip] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoUrlParam = urlParams.get("videoUrl");

    if (videoUrlParam) {
      GetClipId(videoUrlParam)
        .then((response) => {
          const data = response.data;
          setDataClip(data.dataClip);
          if (data.videoURL) {
            setVideoUrl(data.dataClip.url);
          } else {
            alert("No disponible");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud GetClipId:", error);
        });
    }
  }, []);

  return (
    <div id="container_clip">
      <div className="container_clip_data">
        {videoUrl && (
          <ReactPlayer
            url={videoUrl}
            className="reactPlayer"
            controls
            width="70%"
            height="100%"
          />
        )}
        {DataClip && (
          <div className="container_data">
            <div style={{ width: "100%", borderBottom: "1px solid #ccc" }}>
              <div className="container_data_user">
                <Link to={"/" + DataClip?.streamerId}>
                  <img src={DataClip?.Avatar} alt="" />
                </Link>
                <div>
                  <Link to={"/" + DataClip?.streamerId}>
                    <h1>{DataClip?.streamerId}</h1>
                  </Link>
                  <Link to={"/" + DataClip?.nameUserCreator}>
                    <p>Clip by: {DataClip?.nameUserCreator}</p>
                  </Link>
                </div>
              </div>
            </div>
            <div style={{ width: "100%", height: "100%" }}>
              <div className="container_data_clip">
                <span>
                  <i class="fas fa-eye" style={{ marginRight: "10px" }} />
                  {DataClip?.views} views
                </span>
                <span>{DataClip?.clipTitle}</span>
                <span>{formatTimestamp(DataClip.timestamps.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
