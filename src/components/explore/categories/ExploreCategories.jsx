import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

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
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState(null);
  const [streams, setStreams] = useState(null);

  const [barPosition, setBarPosition] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tipo = params.get("tipo");

    if (tipo === "clips") {
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
    };

    fetchData();
  }, []);

  const [filtros, setFiltros] = useState({
    clips: false,
    streams: true,
    categories: false,
  });

  const filter = (e, position) => {
    history.push(`/plataform/explore?tipo=${e}`);
    setBarPosition(position);
  };
  return (
    <div className="explorecategories-body">
      <div>{isMobile && <Search isMobile={isMobile} />}</div>
      <div style={{ width: "95%" }} className="type-set">
        <div onClick={() => filter("streams", 0)} className={"type-card"}>
          <h3 style={{ display: "flex", alignItems: "center" }}>STREAMS</h3>
        </div>
        <div onClick={() => filter("categories", 2)} className={"type-card"}>
          <h3>Categorias</h3>
        </div>
        {/* <div onClick={() => filter("streams")} className={"type-card"}>
          <h3>VODS</h3>
        </div> */}

        <div
          className="type-line"
          style={{ left: `calc(${barPosition} * 48px)` }}
        ></div>
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
          </div>
        )}

        {filtros?.categories &&
          categories?.map((categorie) => (
            <CardCategorie
              width={isMobile ? "160px" : "160px"}
              isLoading={isLoading}
              name={categorie.nombre}
              image={categorie.img ?? "/images/pinkker-stream.png"}
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
