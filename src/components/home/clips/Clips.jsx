import React, { useState, useEffect, useRef } from "react";
import "./Clips.css";
import ClipCard from "../../card/ClipCard";
import Skeleton from "@mui/material/Skeleton";
import {
  GetClipsMostViewed,
  MoreViewOfTheClip,
} from "../../../services/backGo/clip";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";

// Nuevo componente para el loader
const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

function CardSkeleto() {
  return (
    <div style={{ marginRight: "13px", marginTop: "10px" }}>
      <Skeleton
        variant="rectangular"
        width={"300px"}
        height={"169px"}
        style={{ backgroundColor: "rgb(32, 32, 31)" }}
      />
    </div>
  );
}

export default function Clips() {
  const [clips, setClips] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoHover, setVideoHover] = useState(false);
  const hasCalledFunctionRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef(null);
  const progressRef = useRef(0);
  const [hasCalledFunction, setHasCalledFunction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleOnReady = () => {
    setLoading(false);
    setShowLoader(false); // Oculta el loader cuando el video está listo
  };

  const handleOnError = () => {
    setLoading(false);
    setError(true);
    setShowLoader(false); // Oculta el loader en caso de error
  };

  useEffect(() => {
    setHasCalledFunction(false);
  }, [selectedVideo]);

  const handleProgress = async (e) => {
    const { duration, currentTime } = e.target;
    const newProgress = (currentTime / duration) * 100;
    setProgress(newProgress);

    if (newProgress > 50.0 && newProgress < 50.5) {
      setHasCalledFunction(true);
      await MoreViewOfTheClip(selectedVideo.video.id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetClipsMostViewed(1);
        if (response.data?.message === "ok" && response.data?.data.length > 1) {
          setClips(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching clips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScroll = (amount) => {
    const container = scrollContainerRef.current;

    if (container) {
      container.scrollLeft += amount;
    }
  };

  const formatTimestamp = (timestamp) => {
    const currentDate = new Date();
    const clipDate = new Date(timestamp);
    const diffInSeconds = Math.floor((currentDate - clipDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMoreData = (direction) => {
    const increment = direction === "right" ? 1 : -1;
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < clips.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="home-clips">
      <div className="manager-recommended">
        <h2>Clips más vistos </h2>
        <div className="manager-recommended-actions">
          <div className="manager-recommended-actions-ver-todos">
            <Link to="/plataform/explore?tipo=clips">
              <span>Ver todos</span>
            </Link>
          </div>
          <div className="manager-recommended-actions-arrow">
            <i
              style={{ margin: "0px 10px", cursor: "pointer" }}
              className="fas fa-chevron-left"
              onClick={() => fetchMoreData("left")}
            ></i>
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-chevron-right"
              onClick={() => fetchMoreData("right")}
            ></i>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="home-clips-card-container-clips"
          style={{
            transition: "transform 0.5s ease",
            transform: `translateX(${currentIndex * -35}%)`,
          }}
        >
          <div className="home-clips-card-container-clips-children">
            {clips != null &&
              clips.map((video, index) => (
                <div
                  key={index}
                  style={{
                    marginRight: "13px",
                    marginTop: "10px",
                    scrollSnapAlign: "start",
                    width: "350px",
                    height: "196px",
                  }}
                >
                  {isLoading ? (
                    <CardSkeleto />
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedVideo({ video })}
                    >
                      <ClipCard width="300px" video={video} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
        {selectedVideo && (
          <div
            id="container_clip"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.8)",
              zIndex: 999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="container_clip_data">
              <div
                style={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <div className="container_data_user">
                  <Link to={"/" + selectedVideo.video.streamerId}>
                    <img src={selectedVideo.video.Avatar} alt="" />
                  </Link>
                  <div>
                    <Link to={"/" + selectedVideo.video.streamerId}>
                      <h1>{selectedVideo.video.streamerId}</h1>
                    </Link>
                    <Link to={"/" + selectedVideo.video.nameUserCreator}>
                      <p>Clip by: {selectedVideo.video.nameUserCreator}</p>
                    </Link>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "42px",
                    position: "relative",
                    left: "50%",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                  onClick={() => setSelectedVideo(null)}
                >
                  x
                </div>
              </div>

              <div>
                <ReactPlayer
                  url={selectedVideo.video.url}
                  className="reactPlayer"
                  controls={true}
                  playing={true}
                  width="100%"
                  height="100%"
                  onTimeUpdate={handleProgress}
                  onReady={handleOnReady}
                  onError={handleOnError}
                />
                <div
                  style={{
                    width: "100%",
                    borderRadius: "0",
                    height: videoHover ? "5px" : "2px",
                  }}
                  className="time_progressbarContainer"
                >
                  <div
                    style={{ width: `${progress}%` }}
                    className="time_progressBar"
                  ></div>
                </div>
              </div>
              <div className="container_data">
                <div style={{ width: "100%", height: "100%" }}>
                  <div className="container_data_clip">
                    <span>
                      <i class="fas fa-eye" style={{ marginRight: "10px" }} />
                      {selectedVideo.video.views} views
                    </span>
                    <span>{selectedVideo.video.clipTitle}</span>
                    <span>
                      {formatTimestamp(
                        selectedVideo.video.timestamps.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
