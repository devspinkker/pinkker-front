import React, { useState, useEffect, useRef } from "react";
import "./Clip.css";
import axios from "axios";

export function CreateClip() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const totalKey = queryParams.get("totalKey");

        const response = await fetch(
          `http://localhost:8002/getBuffer/${totalKey}`
        );
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
      let config = {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NThiNzMwNjQ2YjdkOWViYTQ2NTdhMzIiLCJleHAiOjE3MTI0MTM2ODgsIm5hbWV1c2VyIjoiYnJ1bm8yIiwicGlua2tlclByaW1lIjpmYWxzZX0.o59kG9fbhF0-y2cANkliP0B76Up4grCNV1XMH8_HBxs`,
        },
      };
      const videoBytes = video
        ? Array.from(new Uint8Array(video.arrayBuffer))
        : null;
      const response = await axios.post(
        "http://localhost:8080/create-clips",
        {
          video: videoBytes,
          start: 1,
          end: 60,
          clipName: "este es un nombre",
          streamer: "bruno2",
        },
        config
      );
      let videoUrl = response.data.data;

      window.location.href = `/clips/getId/?videoUrl=${videoUrl}`;
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar la solicitud de recorte:", error);
    }
  };

  const handleSetStartTime = async () => {
    if (videoRef.current) {
      console.log(videoRef.current.currentTime);

      videoRef.current.currentTime = 30;

      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log(videoRef.current.currentTime);
    }
  };

  const handleSetEndTime = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 120;
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
