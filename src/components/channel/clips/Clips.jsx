import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Clips.css";
import {
  GetClipsNameUser,
  MoreViewOfTheClip,
} from "../../../services/backGo/clip";
import ClipCard from "../../card/ClipCard";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";

export default function Clips(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoHover, setVideoHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videos, setVideos] = useState();
  const [hasCalledFunction, setHasCalledFunction] = useState(false);

  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  const handleProgress = async (e) => {
    const { duration, currentTime } = e.target;
    const newProgress = (currentTime / duration) * 100;
    setProgress(newProgress);

    if (newProgress > 50.0 && newProgress < 50.5) {
      setHasCalledFunction(true);
      await MoreViewOfTheClip(selectedVideo.video.id);
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetClipsNameUser(props.streamer, "1");
      if (data != null && data != undefined) {
        setVideos(data.data.data);
      }
    };
    fetchData();
  }, [props.streamer]);

  function CardSkeleto() {
    return (
      <div style={{ margin: "2px", marginTop: "15px" }}>
        <Skeleton
          variant="rectangular"
          width={"250px"}
          height={"140px"}
          style={{ backgroundColor: "rgb(32, 32, 31)" }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <Skeleton
              variant="text"
              width={100}
              style={{ backgroundColor: "rgb(32, 32, 31)" }}
            />
            <Skeleton
              variant="text"
              width={50}
              style={{ backgroundColor: "rgb(32, 32, 31)" }}
            />
            <Skeleton
              variant="text"
              width={100}
              style={{ backgroundColor: "rgb(32, 32, 31)" }}
            />
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setHasCalledFunction(false);
  }, [selectedVideo]);

  return (
    <div className="channel-clips-body">
      <div className="channel-clips-container">
        {videos != null &&
          videos != undefined &&
          videos.length > 0 &&
          videos.map((video) =>
            isLoading ? (
              <CardSkeleto key={video.id} />
            ) : (
              <div
                key={video.id}
                style={{ cursor: "pointer", margin: "0px" }}
                onClick={() => {
                  setSelectedVideo({ video });
                  setHasCalledFunction(false);
                }}
              >
                <ClipCard
                  key={video.id}
                  width="312px"
                  height="230px"
                  views={video.views}
                  createdAt={video.createdAt}
                  duration={video.duration}
                  title={video.clipTitle}
                  categorie={"video.stream.stream_category"}
                  tags={"video.stream.stream_tag"}
                  video={video}
                />
              </div>
            )
          )}
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
                  style={{ width: `${progress}%` }}
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
