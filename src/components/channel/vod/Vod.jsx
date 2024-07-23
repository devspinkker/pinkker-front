import React, { useState, useEffect } from "react";

import "./Vod.css";

import { getStreamerVod } from "../../../services/vods";
import VodCard from "../../card/VodCard";
import Skeleton from "@mui/material/Skeleton";

import { Link } from "react-router-dom";
import { getStreamSummariesByStreamerIDLast30Days } from "../../../services/backGo/streams";

export default function Vod({ streamer }) {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 300);

  const [videos, setVideos] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStreamSummariesByStreamerIDLast30Days(streamer?.id);
      if (data.message == "ok" && data.data) {
        console.log(data.data);
        setVideos(data.data);
      }
    };
    fetchData();
  }, [streamer]);

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
    <div className="channel-vod-body">
      {videos &&
        videos.length > 0 &&
        videos.map((video) =>
          isLoading ? (
            <CardSkeleto />
          ) : (
            <VodCard
              width="260px"
              image={video.StreamThumbnail}
              title={video.Title}
              categorie={video.stream_category}
              tags={video.stream_tag}
              User={video.UserInfo}
              id={video.id}
            />
          )
        )}
    </div>
  );
}
