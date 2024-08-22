import React, { useState, useEffect, useRef } from "react";
import "./Clip.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Create_Clip } from "../../../services/backGo/clip";
import VideoPlayerCreateClips from "../../../player/VideoPlayerCreateClips";

export function CreateClip() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(60);
  const [clipTitle, setClipTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [videoBytes, setVideoBytes] = useState(null);
  const videoRef = useRef(null);

  const baseUrl = process.env.REACT_APP_BACKRTMP;
  const queryParams = new URLSearchParams(window.location.search);
  const totalKey = queryParams.get("totalKey");

  useEffect(() => {
    if (totalKey) {
      setVideoUrl(`${baseUrl}/stream/${totalKey}/index.m3u8`);
    }
  }, [totalKey, baseUrl]);

  const handleSetDuration = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        alert("Por favor inicia sesión");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await Create_Clip(
        videoBytes,
        startTime,
        endTime,
        "live" + totalKey,
        clipTitle,
        config
      );
      const videoUrl = response.data.data;
      window.location.href = `/clips/getId/?videoUrl=${videoUrl}`;
    } catch (error) {
      console.error("Error al enviar la solicitud de clip:", error);
    }
  };

  const handleVideoBytesReady = (bytes) => {
    setVideoBytes(bytes);
  };

  const playVideo = () => {
    setIsPlaying(true);
    setIsMuted(false); // Desactivar el muteo al empezar a reproducir
  };

  const pauseVideo = () => {
    setIsPlaying(false);
  };

  const handleProgress = (e) => {
    const percentage = (e.playedSeconds / duration) * 100;
    setProgress(percentage);
    setCurrentTime(e.playedSeconds);
  };

  const handleTitleChange = (e) => {
    setClipTitle(e.target.value);
  };

  const handleSliderChange = (values) => {
    const [newStart, newEnd] = values;

    if (
      newStart >= 0 &&
      newEnd <= duration &&
      newEnd > newStart &&
      newEnd - newStart >= 20 &&
      newEnd - newStart <= 60
    ) {
      setStartTime(newStart);
      setEndTime(newEnd);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (currentTime >= endTime && !isVideoEnded) {
      pauseVideo();
      setIsVideoEnded(true);
    }
  }, [currentTime, endTime, isVideoEnded]);

  return (
    <div className="player-container">
      <VideoPlayerCreateClips
        src={videoUrl}
        videoRef={videoRef}
        height="90%"
        width="100%"
        onVideoBytesReady={handleVideoBytesReady}
        isMuted={isMuted} // Asegúrate de pasar el estado de muteo al componente de video
        volume={volume} // Asegúrate de pasar el volumen al componente de video
        onPlay={playVideo} // Asegúrate de que el video se desmute cuando empiece a reproducirse
        onPause={pauseVideo}
        onProgress={handleProgress}
      />
      <div className="controls-container">
        <div>
          <input
            className="input_title_clip"
            placeholder="El título es obligatorio"
            type="text"
            value={clipTitle}
            onChange={handleTitleChange}
          />
          <div className="edit-clip">
            <span className="remaining_characters_clip">
              {100 - clipTitle.length} caracteres restantes
            </span>
            <button onClick={handleSetDuration}>Publicar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
