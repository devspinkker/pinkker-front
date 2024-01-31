import React, { useState, useEffect } from "react";

import "./Recommended.css";

import VideoCard from "../../card/VideoCard";
import Skeleton from "@mui/material/Skeleton";

import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
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

export default function Recommended({ isMobile, socketMain, handleMessage }) {
  //   const [chatExpanded, setChatExpanded] = useState(false);

  const [streams, setStreams] = useState(null);
  const [userMod, setUserMod] = useState(false);
  const [userVip, setUserVip] = useState(false);
  const [userBan, setUserBan] = useState(false);
  const token = useSelector((state) => state.token);

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllsStreamsOnline();
      if (response != null && response != undefined) {
        setStreams(response.data);
      }
    };
    fetchData();
  }, []);
  // const [pointGoal, setPointGoal] = useState(0);
  // const [goal, setGoal] = useState(false);

  // const callbackDonation = (e) => {
  //     setPointGoal(pointGoal + e);
  //     if (pointGoal < 9999) {

  //         setGoal(true);
  //         setPointGoal(0);
  //         setTimeout(() => {
  //             setGoal(false);
  //         }, 4000);

  //     }
  // }
  // const [chatStream, setChatStream] = useState()
  // const [userSuscripted, setUserSuscripted] = useState(false);
  // const [suscribers, setSuscribers] = useState(null);

  // useEffect(() => {

  //     const fetchData = async () => {
  //         if (streams?.length) {
  //             console.log('dataSret', streams[0]?.streamer)
  //             const data = await getChatRoom(streams[0]?.streamer)
  //             setChatStream(data)
  //             console.log('dataSt', data)
  //         } else {
  //             console.log('NO HAY STREAMS EN VIVO')
  //         }
  //     }
  //     fetchData()
  // }, [streams]);

  const streamsData = [
    {
      streamer: "eldenguee",
      title: "Jugando league of legends",
      viewers: "50000",
      tags: ["lol", "league of legends"],
    },
    {
      streamer: "Lucas luna",
      title: "Programando Pinkker",
      viewers: "50000",
      tags: ["charlando"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
    {
      streamer: "Alexis Ibarra",
      title: "Programando..",
      viewers: "50000",
      tags: ["charlando", "programming"],
    },
  ];
  const [dataSource, setDataSource] = useState(Array.from({ length: 4 }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMoreData = (direction) => {
    const increment = direction === "right" ? 1 : -1;
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < streams.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="home-recommended">
      <div className="manager-recommended">
        <h2>Directos Recomendados</h2>
        <div className="manager-recommended-actions">
          <div className="manager-recommended-actions-ver-todos">
            <span>Ver todos</span>
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
          <div className="home-recommended-card-container">
            {streams &&
              streams.map(
                (stream, index) =>
                  index > 0 && (
                    <>
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
                    </>
                  )
              )}
          </div>
        </div>
      )}
      {!isMobile && (
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div
            className="home-recommended-card-container"
            style={{
              transition: "transform 0.5s ease",
              transform: `translateX(${currentIndex * -10}%)`,
            }}
          >
            {streams == null || !streams.length ? (
              <div
                className="home-recommended-card-container-streams"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {streamsData?.map((streams, index) => {
                  return (
                    <VideoCard
                      tags={streams?.tags}
                      isMobile={isMobile}
                      streamer={streams?.streamer}
                      categorie={"test"}
                      title={streams?.title}
                      viewers={streams?.ViewerCount}
                    />
                  );
                })}
              </div>
            ) : (
              streams &&
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
