import React, { useState, useEffect } from "react";

import "./Tendency.css";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import ClipTendencyCard from "./card/ClipTendencyCard";

import { Link } from "react-router-dom";
import {
  GetClipsMostViewedLast48Hours,
  MoreViewOfTheClip,
} from "../../services/backGo/clip";
import { GetStreamsMostViewed } from "../../services/backGo/streams";
import CardStream from "../home/categories/CardStream";
import { Skeleton } from "@mui/material";

export default function Tendency({ isMobile }) {
  const token = useSelector((state) => state.token);

  const [type, setType] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hasCalledFunction, setHasCalledFunction] = useState(false);
  const [vodTendency, setVodTendency] = useState(null);
  const [clipTendency, setClipTendency] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoHover, setVideoHover] = useState(false);
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
    document.title = "Tendency - Pinkker";

    const fetchData = async () => {
      const data = await GetStreamsMostViewed(1);
      if (data && data.message === "ok") {
        setVodTendency(data.data);
      } else {
        setVodTendency(null);
      }

      const dataClip = await GetClipsMostViewedLast48Hours(1);
      if (dataClip.data && dataClip.message === "ok") {
        setClipTendency(dataClip.data);
      } else {
        setClipTendency(null);
      }
    };
    fetchData();
  }, [token]);

  function getType() {
    if (type === 0) {
      return (
        <div className="tendency-card-container-streams">
          {!vodTendency && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {[...Array(15)].map((_, index) => (
                <div
                  style={{ marginRight: "9px", marginTop: "30px" }}
                  key={index}
                >
                  <Skeleton
                    variant="rectangular"
                    width={150}
                    height={226}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                  <Skeleton
                    variant="text"
                    width={75}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                  <Skeleton
                    variant="text"
                    width={100}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                </div>
              ))}
            </div>
          )}
          {vodTendency?.map((vod, index) => (
            <CardStream
              width={
                vod?.streamer && isMobile
                  ? "100%"
                  : vod?.streamer && !isMobile
                  ? "30%"
                  : "160px"
              }
              isLoading={false}
              name={vod.streamer}
              avatarStreamer={vod.streamer_avatar}
              image={vod.stream_thumbnail ?? "/images/pinkker-stream.png"}
              ViewerCount={vod.ViewerCount}
              tags={vod.stream_tag}
              title={vod.stream_title}
            />
          ))}
        </div>
      );
    }

    if (type === 1) {
      return (
        <div className="tendency-card-container-clips">
          {!clipTendency && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {[...Array(15)].map((_, index) => (
                <div
                  style={{ marginRight: "9px", marginTop: "30px" }}
                  key={index}
                >
                  <Skeleton
                    variant="rectangular"
                    width={150}
                    height={226}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                  <Skeleton
                    variant="text"
                    width={75}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                  <Skeleton
                    variant="text"
                    width={100}
                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                </div>
              ))}
            </div>
          )}
          {clipTendency?.map((vod, index) => (
            <div
              onClick={() => {
                setSelectedVideo({ clips: vod });
                setHasCalledFunction(false);
              }}
            >
              <ClipTendencyCard
                tendencyRequired={true}
                tendency={index + 1}
                title={vod.clipTitle}
                streamer={vod.nameUserCreator}
                views={vod.views}
                createdAt={vod.timestamps.createdAt}
                stream_category={vod.stream_category}
                tags={vod.stream_tag}
                image={vod.streamThumbnail}
                Avatar={vod.Avatar}
              />
            </div>
          ))}
        </div>
      );
    }
  }

  function getLeftForType() {
    if (type === 0) {
      return "115px";
    }

    if (type === 1) {
      return "201px";
    }

    if (type === 2) {
      return "199px";
    }
  }

  return (
    <div className="tendency-body">
      <div style={{ height: "50px" }} />

      <div className="tendency-container">
        <div className="tendency-title">
          <h2>Tendencias</h2>
        </div>

        <div>
          <div
            style={{ margin: "0", justifyContent: "left", marginTop: "15px" }}
            className="type-set"
          >
            <div
              onClick={() => setType(0)}
              className={type === 0 ? "type-card active" : "type-card"}
            >
              <h3>Streams</h3>
            </div>
            <div
              onClick={() => setType(1)}
              className={type === 1 ? "type-card active" : "type-card"}
            >
              <h3 onClick={() => setType(1)}>Clips</h3>
            </div>
          </div>

          <div class="pinkker-tab-line"></div>
        </div>

        {getType()}
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
              zIndex: 999000000,
            }}
          >
            <div className="container_clip_data">
              <div
                style={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <div className="container_data_user">
                  <Link to={"/" + selectedVideo.clips.streamerId}>
                    <img src={selectedVideo.clips.Avatar} alt="" />
                  </Link>
                  <div>
                    <Link to={"/" + selectedVideo.clips.streamerId}>
                      <h1>{selectedVideo.clips.streamerId}</h1>
                    </Link>
                    <Link to={"/" + selectedVideo.clips.nameUserCreator}>
                      <p>Clip by: {selectedVideo.clips.nameUserCreator}</p>
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
                  url={selectedVideo.clips.url}
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
                <div style={{ width: "100%", height: "100%" }}>
                  <div className="container_data_clip">
                    <span>
                      <i class="fas fa-eye" style={{ marginRight: "10px" }} />
                      {selectedVideo.clips.views} views
                    </span>
                    <span>{selectedVideo.clips.clipTitle}</span>
                    <span>
                      {formatTimestamp(
                        selectedVideo.clips.timestamps.createdAt
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
