import React, { useState, useEffect } from "react";

import "./Vod.css";

import { getStreamerVod } from "../../../services/vods";
import VodCard from "../../card/VodCard";
import Skeleton from "@mui/material/Skeleton";

import { Link } from "react-router-dom";

export default function Vod(props) {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 300);

  const [videos, setVideos] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStreamerVod(
        props.streamer,
        props.limit,
        props.sort
      );
      if (data != null && data != undefined) {
        setVideos(data);
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
    <div className="channel-vod-body">
      {videos != null &&
        videos != undefined &&
        videos.length > 0 &&
        videos.map((video) =>
          isLoading ? (
            <CardSkeleto />
          ) : (
            <Link style={{ textDecoration: "none" }} to={"/vod/" + video._id}>
              <VodCard
                width="260px"
                image={video.stream_thumbnail}
                title={video.stream_title}
                categorie={video.stream_category}
                tags={video.stream_tag}
              />
            </Link>
          )
        )}
    </div>
  );
}
