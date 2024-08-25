import React, { useState, useEffect, useRef } from "react";
import "./Clip.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Create_Clip } from "../../../services/backGo/clip";
import VideoPlayerCreateClips from "../../../player/VideoPlayerCreateClips";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

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
  const [volumeHovered, setVolumeHovered] = useState(false);
  const videoRef = useRef(null);

  const baseUrl = process.env.REACT_APP_BACKRTMP;
  const queryParams = new URLSearchParams(window.location.search);
  const totalKey = queryParams.get("totalKey");

  useEffect(() => {
    if (totalKey) {
      setVideoUrl(`${baseUrl}/stream/${totalKey}/index.m3u8`);
    }
  }, [totalKey, baseUrl]);

  useEffect(() => {
    if (currentTime >= endTime && !isVideoEnded) {
      pauseVideo();
      setIsVideoEnded(true);
    }
  }, [currentTime, endTime, isVideoEnded]);

  const handleSetDuration = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        alert("Por favor inicia sesión");
        return;
      }

      const selectedTSUrls = videoTSUrls
        .filter(({ start, end }) => start >= startTime && end <= endTime)
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
    if (videoRef.current) {
      videoRef.current.play();
    }
    setIsPlaying(true);
    setIsMuted(false);
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
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
        videoRef.current.play();
      }
    }
  };

  const getClosestTSStartTime = (time) => {
    const closestTS = videoTSUrls.reduce((closest, current) =>
      Math.abs(current.start - time) < Math.abs(closest.start - time)
        ? current
        : closest
    );
    return closestTS.start;
  };

  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    setVolume(value);
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const getBottomButtons = () => {
    return (
      <div style={{ opacity: "1" }} className="customPlayer-container">
        <div
          style={{ position: "relative", top: "-86px" }}
          className="CrearClip-Playing"
        >
          <div className="customPlayer-secundary-div">
            <div className="customPlayer-card">
              {isPlaying ? (
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Pausa
                    </h1>
                  }
                >
                  <i
                    onClick={pauseVideo}
                    style={{ cursor: "pointer" }}
                    className="fas fa-pause pinkker-button-more"
                  />
                </Tippy>
              ) : (
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Play
                    </h1>
                  }
                >
                  <i
                    onClick={playVideo}
                    style={{ cursor: "pointer" }}
                    className="fas fa-play pinkker-button-more"
                  />
                </Tippy>
              )}
            </div>
            <div className="customPlayer-card">
              <i
                onClick={handleMuteToggle}
                className={`fas ${
                  isMuted ? "fa-volume-mute" : "fa-volume-up"
                } pinkker-button-more`}
              />
            </div>
            <div
              style={{ marginLeft: "15px", width: "125px" }}
              className="customPlayer-card"
            >
              <Slider
                onMouseEnter={() => setVolumeHovered(true)}
                onMouseLeave={() => setVolumeHovered(false)}
                aria-label="Volume"
                defaultValue={volume}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                style={{ opacity: volumeHovered ? "1" : "0" }}
              />
            </div>
          </div>
          <div
            style={{ marginLeft: "-50px" }}
            className="customPlayer-secundary-div2"
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="player-container">
      <div className="player-container-ch">
        <div>
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
          {getBottomButtons()}
        </div>
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
    </div>
  );
}
