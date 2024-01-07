import React, { useState, useEffect } from "react";

import "./Clips.css";

import { getStreamerClips } from "../../../services/vods";
import ClipCard from "../../card/ClipCard";
import Skeleton from "@mui/material/Skeleton";

import { Link } from "react-router-dom";
import { GetClipId, GetClipsNameUser } from "../../../services/backGo/clip";

export default function Clips(props) {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  const [videos, setVideos] = useState();

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

  return (
    <div className="channel-clips-body">
      <div className="channel-clips-container">
        {videos != null &&
          videos != undefined &&
          videos.length > 0 &&
          videos.map((video) =>
            isLoading ? (
              <CardSkeleto />
            ) : (
              <Link
                style={{
                  textDecoration: "none",
                  height: "350px",
                }}
                to={`/clips/getId/?videoUrl=${video.id}`}
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
              </Link>
            )
          )}
      </div>
    </div>
  );
}
