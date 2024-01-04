import React, { useState, useEffect, useRef } from "react";
import "./Clip.css";
import Slider from "rc-slider"; // Importa el control deslizante
import "rc-slider/assets/index.css"; // Importa los estilos básicos del control deslizante

import { Create_Clip, GetBuffer } from "../../../services/backGo/clip";
import ReactPlayer from "react-player";

export function CreateClip() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(30);
  const [endTime, setEndTime] = useState(40);
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  const [clipTitle, setclipTitle] = useState("un titulo para el clip");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
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
    if (videoRef.current && videoRef.current.currentTime !== undefined) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [startTime]);

  useEffect(() => {
    if (videoRef.current && videoRef.current.currentTime !== undefined) {
      videoRef.current.currentTime = endTime;
      setCurrentTime(endTime);
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [endTime]);

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
      console.error("Error al enviar la solicitud de recorte:", error);
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSliderChange = (values) => {
    const newStart = values[0];
    const newEnd = values[1];

    if (
      newStart >= 0 &&
      newEnd <= duration &&
      newEnd > newStart &&
      newEnd - newStart >= 20 &&
      newEnd - newStart <= 60
    ) {
      if (newStart === 0) {
        newStart = newStart + 1;
      }
      setStartTime(newStart);
      setEndTime(newEnd);
    }
  };
  useEffect(() => {
    const checkEndTime = () => {
      if (videoRef.current && videoRef.current.currentTime >= endTime) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", checkEndTime);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", checkEndTime);
      }
    };
  }, [videoRef.current, endTime]);
  const handleTitleChange = (e) => {
    setclipTitle(e.target.value);
  };

  return (
    <div id="create_clip_container">
      {videoUrl && (
        <div id="create_clip_videoUrl">
          <div className="create_clip_video">
            <ReactPlayer
              url={videoUrl}
              ref={videoRef}
              controls={true}
              onClick={isPlaying ? pauseVideo : playVideo}
              playing={isPlaying}
              progressInterval={1000}
              onProgress={(progress) => setCurrentTime(progress.playedSeconds)}
            />
            <div className="slider-container">
              <Slider
                min={0}
                max={duration}
                range
                value={[startTime, endTime]}
                onChange={handleSliderChange}
              />
            </div>
          </div>

          <div className="edit-clip">
            <button onClick={handleSetDuration}>Recortar Video</button>
          </div>
          <input
            id="clipTitle"
            placeholder="Añade un titulo"
            type="text"
            value={clipTitle}
            onChange={handleTitleChange}
          />
        </div>
      )}
    </div>
  );
}
