import React, { useState, useEffect } from "react";
import "./Clip.css";
import { GetClipId } from "../../../services/backGo/clip";

export function GetClip() {
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoUrlParam = urlParams.get("videoUrl");

    if (videoUrlParam) {
      GetClipId(videoUrlParam)
        .then((response) => {
          const data = response.data;
          if (data.videoURL) {
            setVideoElement(
              <video controls width="500" height="300">
                <source src={data.dataClip.url} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            );
          } else if (!data.videoURL) {
            alert("no disponible");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud GetClipId:", error);
        });
    }
  }, []);

  return <div className="container">{videoElement}</div>;
}
