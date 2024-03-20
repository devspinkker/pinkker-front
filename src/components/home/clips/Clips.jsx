import React, { useState, useEffect, useRef } from "react";
import "./Clips.css";
import ClipCard from "../../card/ClipCard";
import Skeleton from "@mui/material/Skeleton";
import {
  GetClipsMostViewed,
  MoreViewOfTheClip,
} from "../../../services/backGo/clip";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import SelectVideoClip from "./SelectVideoClip";

// Nuevo componente para el loader

function CardSkeleto() {
  return (
    <div style={{ marginRight: "13px", marginTop: "10px" }}>
      <Skeleton
        variant="rectangular"
        width={"300px"}
        height={"169px"}
        style={{ backgroundColor: "rgb(32, 32, 31)" }}
      />
    </div>
  );
}

export default function Clips() {
  const [clips, setClips] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetClipsMostViewed(1);
        if (response.data?.message === "ok" && response.data?.data.length > 1) {
          setClips(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching clips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMoreData = (direction) => {
    const increment = direction === "right" ? 1 : -1;
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < clips.length) {
      setCurrentIndex(newIndex);
    }
  };
  const toggleSelect = () => {
    setSelectedVideo(!selectedVideo);
  };
  return (
    <div className="home-clips">
      <div className="manager-recommended">
        <h2>Clips más vistos </h2>
        <div className="manager-recommended-actions">
          <div className="manager-recommended-actions-ver-todos">
            <Link to="/plataform/explore?tipo=clips">
              <span style={{fontFamily:'Signika Negative'}}>Ver todos</span>
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="home-clips-card-container-clips"
          style={{
            transition: "transform 0.5s ease",
            transform: `translateX(${currentIndex * -35}%)`,
          }}
        >
          <div className="home-clips-card-container-clips-children">
            {clips != null &&
              clips.map((video, index) => (
                <div
                  key={index}
                  style={{
                    marginRight: "13px",
                    marginTop: "10px",
                    scrollSnapAlign: "start",
                    width: "350px",
                    height: "196px",
                  }}
                >
                  {isLoading ? (
                    <CardSkeleto />
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedVideo({ video })}
                    >
                      <ClipCard width="300px" video={video} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

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
