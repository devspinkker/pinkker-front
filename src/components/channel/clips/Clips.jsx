import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Clips.css";
import {
  GetClipsNameUser,
  MoreViewOfTheClip,
  GetClipsByFilter, // Asegúrate de tener una función para filtrar los clips
} from "../../../services/backGo/clip";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import ClipCardChannel from "../../card/ClipCardChannel";
import SelectVideoClip from "../../home/clips/SelectVideoClip";
import CustomSelect from "../../explore/categories/CustomSelect";

export default function Clips(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sortOption, setSortOption] = useState("Recientes"); // Nueva opción de ordenación

  useEffect(() => {
    // const fetchData = async () => {
    //   const data = await GetClipsByFilter(props.streamer, sortOption);
    //   if (data != null && data != undefined) {
    //     setVideos(data.data.data);
    //   } else {
    //     setVideos(props?.video);
    //   }
    //   setIsLoading(false);
    // };
    // fetchData();
  }, [props.streamer, sortOption]); // Ahora también se ejecuta cuando cambia el sortOption

  const toggleSelect = () => {
    setSelectedVideo(!selectedVideo);
  };

  const handleSortChange = (option) => {
    setSortOption(option); // Actualiza la opción seleccionada
  };

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
      <CustomSelect
        options={[
          "Más visto",
          "Recientes",
          "Random",
          "Última semana",
          "Último día",
          "Último mes",
        ]}
        defaultValue="Recientes"
        onChange={handleSortChange}
      />

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
                style={{ cursor: "pointer", margin: "10px" }}
                onClick={() => {
                  setSelectedVideo({ video });
                }}
                className="vodcard-body"
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

      {selectedVideo && (
        <div
          style={{
            position: "absolute",
            zIndex: "999999999999999999999999999999999",
          }}
        >
          <SelectVideoClip
            clip={selectedVideo.video}
            toggleSelect={toggleSelect}
          />
        </div>
      )}
    </div>
  );
}
