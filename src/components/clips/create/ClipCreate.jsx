import React, { useState, useEffect, useRef } from "react";
import "./Clip.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playerKey, setPlayerKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoHover, setVideoHover] = useState(false);

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
  const handleProgress = (e) => {
    const percentage = (e / 30) * 100;
    console.log(e);
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
              controls={false}
              playing={isPlaying}
              progressInterval={1000}
              // onProgress={(progress) => setCurrentTime(progress.playedSeconds)}
              onProgress={(progress) => handleProgress(progress.playedSeconds)}
            />
            {isPlaying === false && (
              <div
                className="clipcard-muted"
                style={{ left: "50%", top: "227px" }}
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
            <div
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
            </div>
            <div className="controls-container">
              <div className="edit-clip">
                <button style={{ width: "100%" }} onClick={handleSetDuration}>
                  Recortar Video
                </button>
              </div>

              {/* <button onClick={handleMuteToggle}>
                {isMuted ? "Unmute" : "Mute"}
              </button> */}

              {/* <Slider
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
              /> */}
            </div>
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
