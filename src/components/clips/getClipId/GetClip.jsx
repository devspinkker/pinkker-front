import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Clip.css";

export function GetClip() {
  const [clipData, setClipData] = useState({});
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoUrlParam = urlParams.get("videoUrl");

    if (videoUrlParam) {
      axios
        .get(`http://localhost:8080/GetClipId?clipId=${videoUrlParam}`)
        .then((response) => {
          const data = response.data;
          console.log("Video URL:", data.dataClip.url);
          console.log("Video URL status:", data.videoURL);

          if (data.videoURL) {
            setVideoElement(
              <video controls width="500" height="300">
                <source src={data.dataClip.url} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            );
          } else if (!data.videoURL) {
            // ...
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud GetClipId:", error);
        });
    }
  }, []);

  return (
    <div className="container">
      <h1>Video</h1>
      {videoElement}
    </div>
  );
}
