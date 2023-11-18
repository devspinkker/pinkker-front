import React, { useState, useEffect } from "react";

import "./ExploreCategories.css";

import CardStream from "../../home/categories/CardStream";
import CardCategorie from "../../home/categories/CardCategorie";
import Skeleton from "@mui/material/Skeleton";

import { getAllCategories } from "../../../services/categories";
import {
  GetAllsStreamsOnline,
  getCategoriesWithLimit,
} from "../../../services/backGo/streams";

import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import Search from "../../navbar/search/Search";
import Card from "../../home/categories/CardStream";

export default function ExploreCategories({ isMobile }) {
  const token = useSelector((state) => state.token);

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  const [categories, setCategories] = useState(null);
  const [streams, setStreams] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetAllsStreamsOnline(30);

      if (data.data != null || data != undefined) {
        setStreams(data.data);
      }
      const getCategoriesWithLimitData = await getCategoriesWithLimit();
      if (getCategoriesWithLimitData?.message == "ok") {
        console.log(getCategoriesWithLimitData.data);
        setCategories(getCategoriesWithLimitData.data);
      }
    };

    fetchData();
  }, []);

  const [filtros, setFiltros] = useState({
    clips: false,
    streams: true,
    categories: false,
  });

  const filter = (e) => {
    if (e === "clips") {
      setFiltros({
        clips: true,
        streams: false,
        categories: false,
      });
    } else if (e === "streams") {
      setFiltros({
        clips: false,
        streams: true,
        categories: false,
      });
    } else if (e === "categories") {
      setFiltros({
        clips: false,
        streams: false,
        categories: true,
      });
    }
  };
  return (
    <div className="explorecategories-body">
      <div>{isMobile && <Search isMobile={isMobile} />}</div>
      <div className="explorecategories-body-filtros">
        <div
          className="filtros"
          style={{
            borderRadius: "5px",
            backgroundColor: "#f36196",
            paddingRight: "15px",
            paddingLeft: "15px",
          }}
          onClick={() => filter("streams")}
        >
          <Typography
            style={{ color: "white", fontSize: isMobile ? "24px" : "" }}
          >
            Streams
          </Typography>
        </div>
        <div
          className="filtros"
          style={{
            borderRadius: "5px",
            backgroundColor: "#f36196",
            paddingRight: "15px",
            paddingLeft: "15px",
          }}
          onClick={() => filter("categories")}
        >
          <Typography
            style={{ color: "white", fontSize: isMobile ? "24px" : "" }}
          >
            Categorias
          </Typography>
        </div>

        <div
          className="filtros"
          style={{
            borderRadius: "5px",
            backgroundColor: "#f36196",
            paddingRight: "15px",
            paddingLeft: "15px",
          }}
          onClick={() => filter("clips")}
          value={"clips"}
        >
          <Typography
            style={{ color: "white", fontSize: isMobile ? "24px" : "" }}
          >
            Clips
          </Typography>
        </div>
      </div>

      <div className="explorecategories-card-container">
        {isLoading && (
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
            <div style={{ marginRight: "9px", marginTop: "30px" }}>
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
          </div>
        )}

        {filtros?.categories &&
          categories?.map((categorie) => (
            <CardCategorie
              width={isMobile ? "160px" : "160px"}
              isLoading={isLoading}
              name={categorie.nombre}
              image={categorie.img}
              spectators={categorie.spectators}
              tags={categorie.tags}
            />
          ))}

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

        {/* {!filtros?.categories &&
          !filtros?.streams &&
          categories?.map((cat) =>
            cat?.map((categorie) => (
              <CardStream
                width={
                  categorie?.streamer && isMobile
                    ? "100%"
                    : categorie?.streamer && !isMobile
                    ? "30%"
                    : "160px"
                }
                height={"30%"}
                isLoading={isLoading}
                name={categorie?.name || categorie?.streamer}
                image={categorie?.image ?? "/images/pinkker-stream.png"}
                spectators={categorie?.spectators}
                tags={categorie?.tags}
              />
            ))
          )} */}
      </div>
    </div>
  );
}
