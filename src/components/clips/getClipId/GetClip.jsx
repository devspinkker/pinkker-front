import React, { useState, useEffect } from "react";
import "./Clip.css";
import { GetClipId, GetClipIdlogeado } from "../../../services/backGo/clip";
import ClipCard from "../main/card/ClipCard";

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
    let token = window.localStorage.getItem("token");

    if (videoUrlParam && !token) {
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
    } else {
      GetClipIdlogeado(videoUrlParam, token)
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
    <div id="container_clipGet">
      <div className="container_clip_dataGet">
        {DataClip && <ClipCard clip={DataClip} />}
      </div>
    </div>
  );
}
