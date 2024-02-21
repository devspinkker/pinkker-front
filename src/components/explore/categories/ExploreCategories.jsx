import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./ExploreCategories.css";
import ReactPlayer from "react-player";
import CardStream from "../../home/categories/CardStream";
import CardCategorie from "../../home/categories/CardCategorie";
import Skeleton from "@mui/material/Skeleton";

import {
  GetAllsStreamsOnline,
  getCategoriesWithLimit,
} from "../../../services/backGo/streams";

import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Search from "../../navbar/search/Search";
import Card from "../../home/categories/CardStream";
import ClipTendencyCard from "../../tendency/card/ClipTendencyCard";
import {
  GetClipsMostViewedLast48Hours,
  MoreViewOfTheClip,
} from "../../../services/backGo/clip";
import CustomSelect from "./CustomSelect";

export default function ExploreCategories({ isMobile }) {
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hasCalledFunction, setHasCalledFunction] = useState(false);
  const [categories, setCategories] = useState(null);
  const [streams, setStreams] = useState(null);
  const [clips, setclipss] = useState(null);
  const [barPosition, setBarPosition] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoHover, setVideoHover] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipo = params.get("tipo");

    if (tipo === "clips") {
      setBarPosition(4);
      setFiltros({ clips: true, streams: false, categories: false });
    } else if (tipo === "streams") {
      setBarPosition(0);
      setFiltros({ clips: false, streams: true, categories: false });
    } else if (tipo === "categories") {
      setBarPosition(2);
      setFiltros({ clips: false, streams: false, categories: true });
    } else {
      setFiltros({ clips: false, streams: true, categories: false });
    }
  }, [location.search]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await GetAllsStreamsOnline(1);

      if (data.data != null || data != undefined) {
        setStreams(data.data);
        setIsLoading(false);
      }
      const getCategoriesWithLimitData = await getCategoriesWithLimit();
      if (getCategoriesWithLimitData?.message == "ok") {
        setCategories(getCategoriesWithLimitData.data);
        setIsLoading(false);
      }
      const dataClip = await GetClipsMostViewedLast48Hours(1);
      if (dataClip.data && dataClip.message === "ok") {
        setclipss(dataClip.data);
      } else {
        setclipss(null);
      }
    };

    fetchData();
  }, []);
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
  const [filtros, setFiltros] = useState({
    clips: false,
    streams: true,
    categories: false,
  });

  const filter = (e, position) => {
    history.push(`/plataform/explore?tipo=${e}`);
    setBarPosition(position);
  };
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("Most Viewed");

  const handleSortByChange = (e) => {
    setSortBy(e);
  };

  const sortedCategories = () => {
    let sorted = categories.slice();
    if (filterValue.trim() !== "") {
      sorted = sorted.filter((category) =>
        category.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (sortBy === "Most Viewed") {
      return sorted.slice().sort((a, b) => b.spectators - a.spectators);
    } else if (sortBy === "Least Viewed") {
      return sorted.slice().sort((a, b) => a.spectators - b.spectators);
    } else {
      return sorted.slice().sort(() => Math.random() - 0.5);
    }
  };

  return (
    <div className="explorecategories-body">
      <div>{isMobile && <Search isMobile={isMobile} />}</div>
      <div className="type-set">
        <div
          style={{
            background: barPosition == 0 ? "#343843" : "",
          }}
          onClick={() => filter("streams", 0)}
          className={"type-card"}
        >
          <h3 style={{ display: "flex", alignItems: "center" }}>STREAMS</h3>
        </div>

        <div
          style={{
            background: barPosition == 2 ? "#343843" : "",
          }}
          onClick={() => filter("categories", 2)}
          className={"type-card"}
        >
          <h3>Categorias</h3>
        </div>
        <div
          style={{
            background: barPosition == 4 ? "#343843" : "",
          }}
          onClick={() => filter("clips", 4)}
          className={"type-card"}
        >
          <h3>Clips</h3>
        </div>

        {/* <div
          className="type-line"
          style={{ left: `calc(${barPosition} * 48px)` }}
        ></div> */}
      </div>

      <div className="explorecategories-card-container">
        {isLoading && (
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

        {filtros?.categories && (
          <>
            <div
              style={{
                width: "100%",
              }}
            >
              <div className="explorecategories-card-container-filters">
                <div className="explorecategories-card-container-filter-input">
                  <i
                    style={{ fontSize: "16px", color: "rgb(89 89 89)" }}
                    class="fas fa-search navbar-search-i"
                  />
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Search"
                  />
                </div>
                <div>
                  <CustomSelect
                    options={["Random", "Most Viewed", "Least Viewed"]}
                    defaultValue="Most Viewed"
                    onChange={(value) => handleSortByChange(value)}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {categories &&
                  sortedCategories()?.map((categorie) => (
                    <CardCategorie
                      key={categorie.nombre}
                      width={isMobile ? "160px" : "160px"}
                      isLoading={isLoading}
                      name={categorie.nombre}
                      image={categorie.img ?? "/images/pinkker-stream.png"}
                      spectators={categorie.spectators}
                      tags={categorie.tags}
                    />
                  ))}
              </div>
            </div>
          </>
        )}

        {filtros?.streams &&
          streams &&
          streams.map((stream) => (
            <CardStream
              width={
                stream?.streamer && isMobile
                  ? "100%"
                  : stream?.streamer && !isMobile
                  ? "30%"
                  : "160px"
              }
              isLoading={isLoading}
              name={stream.streamer}
              avatarStreamer={stream.streamer_avatar}
              image={stream.stream_thumbnail ?? "/images/pinkker-stream.png"}
              ViewerCount={stream.ViewerCount}
              tags={stream.stream_tag}
              title={stream.stream_title}
            />
          ))}

        {filtros?.clips &&
          clips &&
          clips.map((clips, index) => (
            <div
              onClick={() => {
                setSelectedVideo({ clips });
                setHasCalledFunction(false);
              }}
            >
              <ClipTendencyCard
                tendencyRequired={false}
                tendency={index + 1}
                title={clips.clipTitle}
                streamer={clips.nameUserCreator}
                views={clips.views}
                createdAt={clips.timestamps.createdAt}
                stream_category={clips.stream_category}
                tags={clips.stream_tag}
                image={clips.streamThumbnail}
                Avatar={clips.Avatar}
              />
            </div>
          ))}
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
