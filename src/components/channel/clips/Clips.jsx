import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Clips.css";
import {
  GetClipsNameUser,
  MoreViewOfTheClip,
} from "../../../services/backGo/clip";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import ClipCardChannel from "../../card/ClipCardChannel";
import SelectVideoClip from "../../home/clips/SelectVideoClip";

export default function Clips(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [videoHover, setVideoHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videos, setVideos] = useState();
  const [hasCalledFunction, setHasCalledFunction] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const toggleSelect = () => {
    setSelectedVideo(!selectedVideo);
  };
  setTimeout(() => {
    setIsLoading(false);
  }, 300);
  const closedClip = () => {
    setShowLoader(true);
    setSelectedVideo(null);
  };
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
      } else {
        setVideos(props?.video);
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
                style={{ cursor: "pointer", margin: "10px", width: "400px" }}
                onClick={() => {
                  setSelectedVideo({ video });
                  setHasCalledFunction(false);
                }}
              >
                <ClipCardChannel
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
      <div
        style={{
          position: "absolute",
          zIndex: "999999999999999999999999999999999",
        }}
      >
        {selectedVideo && (
          <SelectVideoClip
            clip={selectedVideo.video}
            toggleSelect={toggleSelect}
          />
        )}
      </div>
    </div>
  );
}
