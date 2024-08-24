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
  const [videoTSUrls, setVideoTSUrls] = useState([]);
  const [marks, setMarks] = useState({});
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

      const selectedTSUrls = videoTSUrls
        .filter(({ start, end }) => {
          return start >= startTime && end <= endTime;
        })
        .slice(0, 8)
        .map(({ url }) => url);

      if (endTime - startTime > 60) {
        alert("El clip no puede durar más de 60 segundos.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const clipData = {
        tsUrls: selectedTSUrls,
        streamKey: "live" + totalKey,
        title: clipTitle,
      };

      const response = await Create_Clip(clipData, config);
      const videoUrl = response.data.data;

      window.location.href = `/clips/getId/?videoUrl=${videoUrl}`;
    } catch (error) {
      console.error("Error al enviar la solicitud de clip:", error);
    }
  };

  const handleVideoURLsReady = (urls) => {
    setVideoTSUrls(urls);
    const lastEndTime = urls[urls.length - 1].end;
    setDuration(lastEndTime);
    setEndTime(Math.min(lastEndTime, 60));

    const newMarks = {};
    urls.forEach(({ start }) => {
      newMarks[start] = <span className="slider-mark"></span>;
    });
    setMarks(newMarks);
  };

  const playVideo = () => {
    setIsPlaying(true);
    setIsMuted(false);
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

    const closestStartTime = getClosestTSStartTime(newStart);
    const closestEndTime = getClosestTSStartTime(newEnd);

    if (
      closestStartTime >= 0 &&
      closestEndTime <= duration &&
      closestEndTime > closestStartTime &&
      closestEndTime - closestStartTime >= 20 &&
      closestEndTime - closestStartTime <= 60
    ) {
      setStartTime(closestStartTime);
      setEndTime(closestEndTime);

      if (videoRef.current) {
        videoRef.current.currentTime = closestStartTime;
        if (isPlaying) {
          videoRef.current.play();
        }
      }
    }
  };

  const getClosestTSStartTime = (time) => {
    return videoTSUrls.reduce((prev, curr) =>
      Math.abs(curr.start - time) < Math.abs(prev.start - time) ? curr : prev
    ).start;
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
        onVideoURLsReady={handleVideoURLsReady}
        isMuted={isMuted}
        volume={volume}
        onPlay={playVideo}
        onPause={pauseVideo}
        onProgress={handleProgress}
      />
      <div className="controls-container">
        <div className="slider-container">
          <Slider
            range
            min={0}
            max={duration}
            value={[startTime, endTime]}
            onChange={handleSliderChange}
            allowCross={false}
            marks={marks}
            dots={false}
            step={null}
          />
        </div>
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
