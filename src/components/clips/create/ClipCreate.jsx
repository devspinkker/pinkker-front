import React, { useState, useEffect, useRef } from "react";
import "./Clip.css";

import { Create_Clip, GetBuffer } from "../../../services/backGo/clip";

export function CreateClip() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  const [clipTitle, setclipTitle] = useState("un titulo para el clip");

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const totalKey = queryParams.get("totalKey");

        const response = await GetBuffer(totalKey);
        const data = await response.arrayBuffer();
        const blob = new Blob([data], { type: "video/mp4" });
        const videoURL = URL.createObjectURL(blob);

        const video = document.createElement("video");
        video.src = videoURL;
        video.onloadedmetadata = () => {
          setDuration(video.duration);
          setEndTime(video.duration);
        };

        setVideoUrl(videoURL);
        setVideo({ blob, arrayBuffer: data });
        videoRef.current = video;
      } catch (error) {
        console.error(error);
      }
    };

    fetchVideoData();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(videoRef.current.currentTime);
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", () => {});
      }
    };
  }, [videoRef.current]);

  const handleSetDuration = async () => {
    try {
      let token = window.localStorage.getItem("token");
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const videoBytes = video
        ? Array.from(new Uint8Array(video.arrayBuffer))
        : null;
      let totalKey = window.localStorage.getItem("keyTransmission");
      if (!token || !totalKey) {
        alert("logueate");
        return;
      } else {
        const response = await Create_Clip(
          videoBytes,
          startTime,
          endTime,
          totalKey,
          clipTitle,
          config
        );
        let videoUrl = response.data.data;

        window.location.href = `/clips/getId/?videoUrl=${videoUrl}`;
      }
    } catch (error) {
      console.log(error);
      console.error("Error al enviar la solicitud de recorte:", error);
    }
  };

  const handleSetStartTime = async () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 30;
      await new Promise((resolve) => setTimeout(resolve, 100));
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSetEndTime = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 120;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <div id="create_clip_container">
      {videoUrl && (
        <div id="create_clip_videoUrl">
          <div className="create_clip_video">
            <video ref={videoRef} controls>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>

          <div className="edit-clip">
            <button onClick={handleSetStartTime}>
              Adelantar al segundo 30
            </button>
            <button onClick={handleSetEndTime}>
              Establecer final en segundo 120
            </button>
            <button onClick={handleSetDuration}>Recortar Video</button>
          </div>
        </div>
      )}
    </div>
  );
}
