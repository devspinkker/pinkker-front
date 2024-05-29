import React, { useState, useEffect } from "react";

import "./Recommended.css";

import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";

import { GetAllsStreamsOnline } from "../../../services/backGo/streams";
import CardStreamRecomendado from "../categories/CardStreamRecomendado";
import { Grid } from "@mui/material";
import { GrGamepad } from "react-icons/gr";

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
  expanded,
}) {
  const [streams, setStreams] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllsStreamsOnline();
      if (response != null && response != undefined) {
        setStreams(response.data);
      }
    };
    fetchData();
  }, [expanded]);

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
      {streams?.length && <div className="manager-recommended">

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '80%' }}>
          <GrGamepad style={{ color: '#ff69c4', fontSize: '20px' }} />

          <h2 style={{ fontFamily: 'Inter', color: 'white', fontSize: '20px' }}>Directos Recomendados</h2>

        </div>
        <div className="manager-recommended-actions">
          <div className="manager-recommended-actions-ver-todos">
            <Link to="/plataform/explore?tipo=streams" style={{ padding: 0 }}>
              <span style={{ fontFamily: 'Signika Negative', fontSize: '14px' }} >Ver todos</span>
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
      </div>}


      {/* {isMobile && (
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
      )} */}
      <div style={{ display: "flex", overflow: "hidden" }}>
        <div
          className="home-recommended-card-container"
          style={{
            transition: "transform 0.5s ease",
            transform: `translateX(${currentIndex * -20}%)`,
          }}
        >
          {streams == null && isLoading == true ? (
            [...Array(3)]?.map((_, index) => (
              <div
                style={{ marginRight: "9px" }}
                key={index}
              >
                
                <Skeleton
                  variant="rectangular"
                  width={500}
                  height={250}
                  style={{ backgroundColor: "rgb(32, 32, 31)", marginBottom: '10px' }}
                />
                <Grid style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }} >
                  <Skeleton
                    variant="circular"
                    width={50}
                    height={50}

                    style={{ backgroundColor: "rgb(32, 32, 31)" }}
                  />
                  <Grid style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>

                    <Skeleton
                      variant="text"
                      width={120}
                      style={{ backgroundColor: "rgb(32, 32, 31)" }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      style={{ backgroundColor: "rgb(32, 32, 31)" }}
                    />

                  </Grid>
                </Grid>

              </div>
            ))

          ) : (
            streams?.map((stream, index) => (
              <div
                style={{ marginRight: "9px" }}
                key={index}
              >
                <CardStreamRecomendado
                  tags={stream.stream_tag}
                  isMobile={isMobile}
                  streamer={stream.streamer}
                  categorie={stream.stream_category}
                  title={stream.stream_title}
                  viewers={stream.ViewerCount}
                  name={stream.streamer}
                  isLoading={false}
                  avatarStreamer={stream.streamer_avatar}
                  image={
                    stream.stream_thumbnail ?? "/images/pinkker-stream.png"
                  }
                  ViewerCount={stream.ViewerCount}
                />

                {/* <VideoCard
                  tags={stream.stream_tag}
                  isMobile={isMobile}
                  streamerImage={stream.streamer_avatar}
                  streamer={stream.streamer}
                  categorie={stream.stream_category}
                  title={stream.stream_title}
                  viewers={stream.ViewerCount}
                  image={stream.stream_thumbnail}
                /> */}
              </div>
            ))
          )}
        </div>
      </div>
    </div >
  );
}
