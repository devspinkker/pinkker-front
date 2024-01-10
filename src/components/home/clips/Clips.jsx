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

  const scrollContainerRef = useRef(null);
  const progressRef = useRef(0);

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

  const handleProgress = async (e) => {
    const { duration, currentTime } = e.target;
    const newProgress = (currentTime / duration) * 100;
    progressRef.current = newProgress;
    if (newProgress > 50.0 && newProgress < 50.5) {
      await MoreViewOfTheClip(selectedVideo.video.id);
    }
  };

  return (
    <div className="home-clips">
      <h3 style={{ color: "#ededed" }}>
        {" "}
        <a className="text-remarcado" style={{ color: "#f36196" }}>
          Clips
        </a>{" "}
        más vistos hoy
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="fa-arrow-div">
          <i
            onClick={() => handleScroll(-300)}
            className="fas fa-arrow-left arrow-buttons aa"
            style={{
              width: "40px",
              height: "100%",
              borderRadius: "50px",
              color: "darkgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              cursor: "pointer",
            }}
          />
        </div>

        <div
          id="clips-container"
          ref={scrollContainerRef}
          className="home-clips-card-container"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            scrollSnapPointsX: "repeat(300px)",
          }}
        >
          {clips != null &&
            clips.map((video, index) => (
              <div
                key={index}
                style={{
                  marginRight: "13px",
                  marginTop: "10px",
                  scrollSnapAlign: "start",
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

        <div className="fa-arrow-div">
          <i
            onClick={() => handleScroll(300)}
            className={`fas fa-arrow-right arrow-buttons`}
            style={{
              width: "40px",
              height: "100%",
              borderRadius: "50px",
              color: "darkgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              cursor: "pointer",
            }}
          />
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
          }}
        >
          <div className="container_clip_data">
            <div>
              <ReactPlayer
                url={selectedVideo.video.url}
                className="reactPlayer"
                controls={true}
                playing={true}
                width="100%"
                height="100%"
                onTimeUpdate={handleProgress}
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
                  style={{ width: `${progressRef.current}%` }}
                  className="time_progressBar"
                ></div>
              </div>
            </div>
            <div className="container_data">
              <div style={{ width: "100%", borderBottom: "1px solid #ccc" }}>
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
                  <div
                    style={{
                      fontSize: "42px",
                      position: "relative",
                      left: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedVideo(null)}
                  >
                    <img
                      style={{
                        width: "26px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                      className="chat-button-more"
                      src="/images/iconos/contraer.png"
                    />
                  </div>
                </div>
              </div>
              <div style={{ width: "100%", height: "100%" }}>
                <div className="container_data_clip">
                  <span>
                    <i class="fas fa-eye" style={{ marginRight: "10px" }} />
                    {selectedVideo.video.views} views
                  </span>
                  <span>{selectedVideo.video.clipTitle}</span>
                  <span>
                    {formatTimestamp(selectedVideo.video.timestamps.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
