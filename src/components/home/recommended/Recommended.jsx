import React, { useState, useEffect } from "react";

import "./Recommended.css";

import VideoCard from "../../card/VideoCard";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";

import { GetAllsStreamsOnline } from "../../../services/backGo/streams";

function CardSkeleto() {
  return (
    <div style={{ margin: "20px auto" }}>
      <Skeleton
        variant="rectangular"
        width={"300px"}
        height={"150px"}
        style={{ backgroundColor: "rgb(32, 32, 31)" }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Skeleton
          variant="circular"
          style={{ backgroundColor: "rgb(32, 32, 31)" }}
          width={40}
          height={40}
        />
        <div style={{ marginLeft: "10px" }}>
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
            width={50}
            style={{ backgroundColor: "rgb(32, 32, 31)" }}
          />
        </div>
      </div>
    </div>
  );
}

function CardSkeletoBig() {
  return (
    <div style={{ margin: "20px" }}>
      <Skeleton
        variant="rectangular"
        width={"700px"}
        height={"350px"}
        style={{ backgroundColor: "rgb(32, 32, 31)" }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Skeleton
          variant="circular"
          style={{ backgroundColor: "rgb(32, 32, 31)" }}
          width={40}
          height={40}
        />
        <div style={{ marginLeft: "10px" }}>
          <Skeleton
            variant="text"
            width={200}
            style={{ backgroundColor: "rgb(32, 32, 31)" }}
          />
          <Skeleton
            variant="text"
            width={150}
            style={{ backgroundColor: "rgb(32, 32, 31)" }}
          />
          <Skeleton
            variant="text"
            width={150}
            style={{ backgroundColor: "rgb(32, 32, 31)" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function DirectosRecommended({
  isMobile,
  socketMain,
  handleMessage,
}) {
  const [streams, setStreams] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllsStreamsOnline();
      if (response != null && response != undefined) {
        setStreams(response.data);
      }
    };
    fetchData();
  }, []);

  const streamsData = [
    {
      streamer: "eldenguee",
      title: "Jugando league of legends",
      viewers: "50000",
      tags: ["lol", "league of legends"],
    },
    {
      streamer: "eldenguee",
      title: "Jugando league of legends",
      viewers: "50000",
      tags: ["lol", "league of legends"],
    },
    {
      streamer: "eldenguee",
      title: "Jugando league of legends",
      viewers: "50000",
      tags: ["lol", "league of legends"],
    },
    {
      streamer: "eldenguee",
      title: "Jugando league of legends",
      viewers: "50000",
      tags: ["lol", "league of legends"],
    },
    {
      streamer: "eldenguee",
      title: "Jugando league of legends",
      viewers: "50000",
      tags: ["lol", "league of legends"],
    },
    {
      streamer: "eldenguee",
      title: "Jugando league of legends",
      viewers: "50000",
      tags: ["lol", "league of legends"],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMoreData = (direction) => {
    const increment = direction === "right" ? 1 : -1;
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < streams?.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="home-recommended">
      <div className="manager-recommended">
        <h2>Directos Recomendados</h2>
        <div className="manager-recommended-actions">
          <div className="manager-recommended-actions-ver-todos">
            <Link to="/plataform/explore?tipo=streams">
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
      {isMobile && (
        <div style={{ display: "flex", marginTop: "20px" }}>
          {streams &&
            streams.map(
              (stream, index) =>
                index > 0 && (
                  <div className="home-recommended-card-container">
                    <VideoCard
                      tags={stream.stream_tag}
                      isMobile={isMobile}
                      streamerImage={stream.streamer_avatar}
                      streamer={stream.streamer}
                      categorie={stream.stream_category}
                      title={stream.stream_title}
                      viewers={stream.viewers}
                      image={stream.stream_thumbnail}
                    />
                  </div>
                )
            )}
        </div>
      )}
      {!isMobile && (
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div
            className="home-recommended-card-container"
            style={{
              transition: "transform 0.5s ease",
              transform: `translateX(${currentIndex * -20}%)`,
            }}
          >
            {streams == null || !streams.length
              ? streamsData?.map((streams, index) => {
                  return (
                    <div className="home-recommended-card-container-streams">
                      <VideoCard
                        tags={streams?.tags}
                        isMobile={isMobile}
                        streamer={streams?.streamer}
                        categorie={"test"}
                        title={streams?.title}
                        viewers={streams?.ViewerCount}
                      />
                    </div>
                  );
                })
              : streams &&
                streams.map((stream, index) => (
                  <div className="home-recommended-card-container-streams">
                    <VideoCard
                      tags={stream.stream_tag}
                      isMobile={isMobile}
                      streamerImage={stream.streamer_avatar}
                      streamer={stream.streamer}
                      categorie={stream.stream_category}
                      title={stream.stream_title}
                      viewers={stream.ViewerCount}
                      image={stream.stream_thumbnail}
                    />
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
