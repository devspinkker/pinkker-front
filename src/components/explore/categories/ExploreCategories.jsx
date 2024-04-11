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
import { Grid, Typography } from "@mui/material";
import Search from "../../navbar/search/Search";
import Card from "../../home/categories/CardStream";
import ClipTendencyCard from "../../tendency/card/ClipTendencyCard";
import {
  GetClipsMostViewedLast48Hours,
  MoreViewOfTheClip,
} from "../../../services/backGo/clip";
import CustomSelect from "./CustomSelect";
import SelectVideoClip from "../../home/clips/SelectVideoClip";
import { ScaleLoader, BarLoader } from "react-spinners";
import { ImCross } from "react-icons/im";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function ExploreCategories({ isMobile, tyExpanded }) {
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

  const toggleSelect = () => {
    setSelectedVideo(!selectedVideo);
  };
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
  const [sortBy, setSortBy] = useState("Mas visto");

  const handleSortByChange = (e) => {
    setSortBy(e);
  };

  const sortedCategories = () => {
    let sorted = categories?.slice();
    if (filterValue.trim() !== "") {
      sorted = sorted?.filter((category) =>
        category.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    sorted?.forEach((item) => {
      if (!item.hasOwnProperty("spectators")) {
        item.spectators = 0;
      }
    });

    // Luego, puedes realizar tu clasificación normalmente
    if (sortBy === "Mas visto") {
      return sorted?.slice().sort((a, b) => b.spectators - a.spectators);
    } else if (sortBy === "Menos visto") {
      return sorted?.slice().sort((a, b) => a.spectators - b.spectators);
    } else {
      return sorted?.slice().sort(() => Math.random() - 0.5);
    }
  };

  const [color, setColor] = useState("")

  const generateColor = () => {
    setColor(Math.random().toString(16).substr(-6));
  };

  useEffect(() => {
    generateColor()
  }, [])



  return (
    <div className="explorecategories-body">
      {isLoading && (
        <div
          style={{
            height: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarLoader color="#36d7b7" />

        </div>
      )}
      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgb(42, 46, 56)', padding: '0px  5.8rem', margin:'3.4rem 0px' }}>
        <h3 style={{ color: 'white', fontSize: '30px' }}>Categorias</h3>
        <img src={'/images/ESTRELLA_PINKKER_ROSA.png'} style={{ width: '10%' }} />
      </Grid>
      <div>{isMobile && <Search isMobile={isMobile} />}</div>

      {/* <div
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
        </div> */}

      {/* <div
          className="type-line"
          style={{ left: `calc(${barPosition} * 48px)` }}
        ></div> */}


      <div className="explorecategories-card-container">


        {filtros?.categories && (
          <>
            <div
              style={{
                width: "100%",
              }}
            >
              <div className="explorecategories-card-container-filters">
                <div className="explorecategories-card-container-filter-input" >
                  <img
                    src="/images/search.svg"
                    style={{
                      fontSize:  "16px",
                      color: "rgb(89 89 89)",
                      margin:  "8px",
                    }}
                  />
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Búsqueda"
                  />
                  {
                    filterValue &&
                    < AiOutlineCloseCircle style={{ color: 'white', cursor: 'pointer' }} onClick={(e) => setFilterValue("")} />
                  }
                </div>
                <div>
                  <CustomSelect
                    options={["Random", "Mas visto", "Menos visto"]}
                    defaultValue="Mas visto"
                    onChange={(value) => handleSortByChange(value)}
                  />
                </div>
              </div>
              <div className={!sortedCategories()?.length ? "explore-card-not-results" : "explorecategories-card-container-sorted-content"}>
                {categories &&
                  !sortedCategories()?.length ?
                  <Grid style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center', alignItems: 'center', width: '100%', height: '300px', backgroundColor: '#121418', border: '1px dashed #2a2e38', marginBottom: '20%', marginTop: '1%', borderRadius: '5px' }}>

                    <ImCross style={{ color: 'red', fontSize: '3.5rem' }} />
                    <Typography style={{ fontFamily: 'Inter', fontWeight: 600, color: 'white' }}>No hay categorias para mostrar</Typography>
                  </Grid>

                  :
                  sortedCategories()?.map((categorie) => (
                    <CardCategorie
                      key={categorie.nombre}
                      width={isMobile ? "160px" : "160px"}
                      isLoading={isLoading}
                      name={categorie.nombre}
                      image={categorie.img ?? "/images/pinkker-stream.png"}
                      spectators={categorie.spectators}
                      tags={categorie.tags}
                      TopColor={categorie.TopColor}
                    />
                  ))

                }
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
              categorie={stream.stream_category}
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
          <SelectVideoClip
            clip={selectedVideo.clips}
            toggleSelect={toggleSelect}
          />
        )}
      </div>
    </div>
  );
}
