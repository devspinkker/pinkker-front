import React, { useState, useEffect, useRef } from "react";
import "./Clip.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Create_Clip, GetBuffer } from "../../../services/backGo/clip";
import ReactPlayer from "react-player";

export function CreateClip() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(60);
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  const [clipTitle, setclipTitle] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const TOTAL_VIDEO_SIZE_KB = 6000;
  const UPDATE_CHUNK_SIZE_KB = 10;

  const queryParams = new URLSearchParams(window.location.search);
  const totalKey = queryParams.get("totalKey");
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        let accumulatedLoadedKB = 0;
        let previousLoadedBytes = 0;

        const response = await GetBuffer(totalKey, {
          onDownloadProgress: (progressEvent) => {
            const loadedBytes = progressEvent.loaded;
            const loadedKB = (loadedBytes - previousLoadedBytes) / 1024;
            previousLoadedBytes = loadedBytes;

            accumulatedLoadedKB += loadedKB;

            console.log(Math.floor(accumulatedLoadedKB));

            if (accumulatedLoadedKB >= UPDATE_CHUNK_SIZE_KB) {
              const totalLoadedKB = loadedBytes / 1024;
              let progressPercent = Math.floor(
                (totalLoadedKB / TOTAL_VIDEO_SIZE_KB) * 100
              );

              progressPercent = Math.min(progressPercent, 100);

              setLoadingProgress(progressPercent);
              accumulatedLoadedKB = 0;
            }
          },
        });
        const data = response.data;
        const blob = new Blob([data], { type: "video/mp4" });
        const videoURL = URL.createObjectURL(blob);

        const videoElement = document.createElement("video");
        videoElement.src = videoURL;
        videoElement.onloadedmetadata = () => {
          setDuration(videoElement.duration);
          setEndTime(videoElement.duration);
        };

        setVideoUrl(videoURL);
        setVideo({ blob, arrayBuffer: data });
        videoRef.current = videoElement;

        setIsLoadingVideo(false);
        setLoadingProgress(100);
      } catch (error) {
        console.error("Error al cargar el video:", error);
      }
    };

    fetchVideoData();
  }, []);
  useEffect(() => {
    if (videoRef.current && videoRef.current.currentTime !== undefined) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
      setIsPlaying(false);
      setIsVideoEnded(false);
    }
  }, [startTime]);

  useEffect(() => {
    if (videoRef.current && videoRef.current.currentTime !== undefined) {
      videoRef.current.currentTime = endTime;
      setCurrentTime(endTime);
      setIsPlaying(false);
      setIsVideoEnded(false);
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
      if (!token) {
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
      setIsVideoEnded(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgress = (e) => {
    const percentage = (e / 30) * 100;
    setProgress(percentage);
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

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    const checkEndTime = () => {
      if (
        videoRef.current &&
        videoRef.current.currentTime >= endTime &&
        !isVideoEnded
      ) {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsVideoEnded(true);
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
  }, [endTime, isVideoEnded]);

  const handleTitleChange = (e) => {
    setclipTitle(e.target.value);
  };

  return (
    <div id="create_clip_container">
      {videoUrl ? (
        <div id="create_clip_videoUrl">
          <div className="create_clip_video">
            <ReactPlayer
              url={videoUrl}
              ref={videoRef}
              controls={false}
              playing={isPlaying}
              progressInterval={1000}
              onProgress={(progress) => handleProgress(progress.playedSeconds)}
            />
            {isPlaying === false && (
              <div
                className="clipcard-muted"
                style={{ left: "55%", top: "311px" }}
              >
                <i
                  onClick={playVideo}
                  style={{
                    cursor: "pointer",
                    fontSize: "44px",
                    color: "lightgray",
                  }}
                  className="fas fa-play button-more-player"
                />
              </div>
            )}
            {isPlaying === true && (
              <div
                onClick={pauseVideo}
                className="clipcard-muted"
                style={{
                  left: "41%",
                  top: "152px",
                  width: "200px",
                  height: "200px",
                }}
              ></div>
            )}
            {/* <div
              style={{
                width: "100%",
                borderRadius: "0",
                height: videoHover ? "5px" : "2px",
                margin: "9px  0px",
              }}
              className="time_progressbarContainer"
            >
              <div
                style={{ width: `${progress}%` }}
                className="time_progressBar"
              ></div>
            </div> */}
            <div>
              <input
                className="input_title_clip"
                placeholder="El titulo es obligatorio"
                type="text"
                value={clipTitle}
                onChange={handleTitleChange}
              />
              <div className="controls-container">
                <div className="edit-clip">
                  <span className="remaining_characters_clip">{`${
                    100 - clipTitle.length
                  } caracteres restantes`}</span>
                </div>
                <button onClick={handleSetDuration}>Publicar</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="create_clip_videoUrl_loading">
          {/* <div className="loading-spinner"></div> */}
          {isLoadingVideo && (
            <div id="loading-progress-bar">
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span>{loadingProgress + "%"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
