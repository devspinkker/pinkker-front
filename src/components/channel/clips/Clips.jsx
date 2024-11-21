import React, { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import ClipCardChannel from "../../card/ClipCardChannel";
import SelectVideoClip from "../../home/clips/SelectVideoClip";
import CustomSelect from "../../explore/categories/CustomSelect";
import { GetClipsByUserIDAndFilter } from "../../../services/backGo/clip";
import "./Clips.css";

export default function Clips(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sortOption, setSortOption] = useState("Recientes");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await GetClipsByUserIDAndFilter(
          props.idStreamer,
          sortOption,
          dateFilter // Ahora se incluye el filtro de fecha en la solicitud
        );
        if (data.message === "Clips fetched successfully" && data.data) {
          
          setVideos(data.data);
        } else {
          setVideos(props?.video);
        }
      } catch (error) {
        console.error("Error fetching clips:", error);
        setVideos(props?.video);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [props.idStreamer, sortOption, dateFilter]); // Escucha cambios en sortOption y dateFilter

  const toggleSelect = () => {
    setSelectedVideo(null);
  };
  const handleSortChange = (option) => {
    if (option === "Más visto") {
      setSortOption("most_viewed");
    } else if (option === "Random") {
      setSortOption("random");
    } else {
      setSortOption("recent");
    }
  };

  const handleDateFilterChange = (option) => {
    if (option === "Último día") {
      setDateFilter("day");
    } else if (option === "Última semana") {
      setDateFilter("week");
    } else if (option === "Último mes") {
      setDateFilter("month");
    } else {
      setDateFilter("");
    }
  };

  function CardSkeleton() {
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
      <div
        style={{
          width: "23%",
          marginLeft: "31px",
        }}
      >
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
          onChange={(option) => {
            handleSortChange(option); // Cambia la opción de orden
            handleDateFilterChange(option); // Cambia el filtro de fecha
          }}
        />
      </div>

      <div className="channel-clips-container">
        {isLoading
          ? [1, 2, 3, 4].map((_, index) => <CardSkeleton key={index} />)
          : videos?.map((video) => (
              <div
                key={video.id}
                style={{ cursor: "pointer", margin: "10px" }}
                onClick={() => setSelectedVideo(video)}
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
                  categorie={video.stream?.stream_category}
                  tags={video.stream?.stream_tag}
                  video={video}
                />
              </div>
            ))}
      </div>

      {selectedVideo && (
        <div
          style={{
            position: "absolute",
            zIndex: "999999999999999999999999999999999",
          }}
        >
          <SelectVideoClip clip={selectedVideo} toggleSelect={toggleSelect} />
        </div>
      )}
    </div>
  );
}
