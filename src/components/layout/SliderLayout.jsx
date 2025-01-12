import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { Grid, Skeleton } from "@mui/material";
import CardCategorie from "../home/categories/CardCategorie";
import ClipCard from "../card/ClipCard";
import "./SliderLayout.css";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { GrGamepad } from "react-icons/gr";
import SelectVideoClip from "../home/clips/SelectVideoClip";
import VodCard from "../card/VodCard";
import ClipCardChannel from "../card/ClipCardChannel";
import CardStreamRecomendado from "../home/categories/CardStreamRecomendado";
import Communities from "../muro/communities/Communities";

function SliderLayout(props) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const toggleSelect = () => {
    setSelectedVideo(!selectedVideo);
  };
  const [isFullHD, setIsFullHD] = useState(false);
  useEffect(() => {
    const checkScreenResolution = () => {
      if (window.innerWidth === 1920 && window.innerHeight === 1080) {
        setIsFullHD(true);
      } else {
        setIsFullHD(false);
      }
    };

    // Check the resolution on mount
    checkScreenResolution();

    // Add event listener to check resolution on resize
    window.addEventListener("resize", checkScreenResolution);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", checkScreenResolution);
  }, []);
  const [color, setColor] = useState("");

  const generateColor = () => {
    setColor(Math.random().toString(16).substr(-6));
  };
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };
  useEffect(() => {
    generateColor();
  }, []);

  return (
    <Swiper
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
      }}
      spaceBetween={props.clipT || props.Vod ? 20 :  props.streams ? 30 :  props.isMobile ? 7 : 5}
      navigation={{
        nextEl: `.custom-next-${props.id}`,
        prevEl: `.custom-prev-${props.id}`,
      }}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      slidesPerView={
        props.isMobile
          ? props.Vod || props.clipT || props.streams
            ? 1
            : 3
          : props.Vod || props.clipT 
            ? 4.5
            : isFullHD
              ? 9.5
              : props.streams ? 4 : 8.5
      }
      Pagination
      onSlideChange={handleSlideChange}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {/* Botones de "Next" y "Prev" personalizados */}
      <Grid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >

        {props.streams && props.streamsCard?.length && (
          <>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                width: "100%",
              }}
            >

              <GrGamepad style={{ color: "#ff69c4", fontSize: "20px" }} />
              <h2 style={{ color: "white", fontSize: "20px" }}>Directos Recomendados</h2>
            </Grid>

            <div className="manager-recommended-actions-arrow">
              <div
                className={`custom-prev-${props.id} ${isBeginning ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isBeginning ? 0.5 : 1,
                  pointerEvents: isBeginning ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </div>
              <div
                className={`custom-next-${props.id} ${isEnd ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isEnd ? 0.5 : 1,
                  pointerEvents: isEnd ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>

          </>
        )}

        {props.Categoria && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: !props.isMobile && "80%",
              }}
            >
              <GrGamepad style={{ color: "#ff69c4", fontSize: "20px" }} />
              <h2 style={{ fontFamily: "Inter", color: "white" }}>Categorias</h2>
            </div>
            {/* Flechas solo para Categoria */}
            <div className="manager-recommended-actions-arrow">
              <div
                className={`custom-prev-${props.id} ${isBeginning ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isBeginning ? 0.5 : 1,
                  pointerEvents: isBeginning ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </div>
              <div
                className={`custom-next-${props.id} ${isEnd ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isEnd ? 0.5 : 1,
                  pointerEvents: isEnd ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </>
        )}

        {props.clipT && (
          <>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                width: "30%",
              }}
            >
              <AiOutlinePlayCircle style={{ color: "#ff69c4", fontSize: "20px" }} />
              <h2 style={{ color: "white", fontSize: "20px" }}>
                {props.titulo
                  ? "Vods Recomendados"
                  : props.isMobile
                    ? "Clips"
                    : "Clips más vistos"}{" "}
              </h2>
            </Grid>
            {/* Flechas solo para Clips */}
            <div className="manager-recommended-actions-arrow">
              <div
                className={`custom-prev-${props.id} ${isBeginning ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isBeginning ? 0.5 : 1,
                  pointerEvents: isBeginning ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </div>
              <div
                className={`custom-next-${props.id} ${isEnd ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isEnd ? 0.5 : 1,
                  pointerEvents: isEnd ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </>
        )}

        {/* {props.Vod && (
          <>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                width: "30%",
              }}
            >
              <AiOutlinePlayCircle style={{ color: "#ff69c4", fontSize: "20px" }} />
              <h2 style={{ color: "white", fontSize: "20px" }}>
                {props.isMobile ? "Vods" : "Vods Recomendados"}{" "}
              </h2>
            </Grid>
            <div className="manager-recommended-actions-arrow">
              <div
                className={`custom-prev-${props.id} ${isBeginning ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isBeginning ? 0.5 : 1,
                  pointerEvents: isBeginning ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </div>
              <div
                className={`custom-next-${props.id} ${isEnd ? "disabled" : ""}`}
                style={{
                  fontSize: "14px",
                  opacity: isEnd ? 0.5 : 1,
                  pointerEvents: isEnd ? "none" : "auto",
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </>
        )} */}
      </Grid>

      {props?.streams && (
        <>
          {props?.streamsCard?.length && (
            props?.streamsCard?.filter((stream, index) => index < 10)
              .map((stream) => (
                <SwiperSlide className="hoverSwiper" style={{ color: "white" }}>
                  <CardStreamRecomendado
                    tags={stream.stream_tag}
                    isMobile={props.isMobile}
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
                </SwiperSlide>
              ))
          )}
        </>
      )}

      {props.Categoria && (
        <>
          {props.Categories?.length ? (
            props?.Categories?.filter((categorie, index) => index < 10).map(
              (categorie, index) => (
                <SwiperSlide style={{ color: "white" }}>
                  <CardCategorie
                    width={props.isMobile ? "200px" : "140px"}
                    height={props.isMobile ? "100%" : "180px"}
                    name={categorie.nombre}
                    image={categorie.img ?? "/images/pinkker-stream.png"}
                    spectators={categorie.spectators}
                    tags={categorie.tags}
                    TopColor={categorie.TopColor}
                    isMobile={props.isMobile}
                  />
                </SwiperSlide>
              )
            )
          ) : (
            <SwiperSlide
              className="hoverSwiper"
              style={{
                color: "white",
                display: "flex",
                gap: props.isMobile ? ".8rem" : "2rem",
              }}
            >
              {[...Array(props.isMobile ? 3 : isFullHD ? 9 : 7)].map(
                (_, index) => (
                  <div
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                    key={index}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={props.isMobile ? 182 : 142}
                      height={props.isMobile ? 241 : 182}
                      style={{
                        backgroundColor: "#202329",
                        border: `1px solid #${color}`,
                        borderRadius: "5px",
                      }}
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={15}
                      style={{ backgroundColor: "rgb(32, 32, 31)" }}
                    />
                  </div>
                )
              )}
            </SwiperSlide>
          )}

          {props?.Categories?.filter((categorie, index) => index === 36).map(
            (categorie) => (
              <SwiperSlide
                style={{
                  color: "white",
                  display: "flex",
                  margin: "0 auto",
                  justifyContent: "center",
                }}
              >
                <CardCategorie
                  width={"180px"}
                  height={"100%"}
                  name={categorie.nombre}
                  titulo={"Ver Todos"}
                  image={categorie.img ?? "/images/pinkker-stream.png"}
                  spectators={categorie.spectators}
                  tags={categorie.tags}
                  TopColor={categorie.TopColor}
                  isMobile={props.isMobile}
                />
              </SwiperSlide>
            )
          )}
        </>
      )}
      {/* comentado quitar*/}
      {props.clipT && (
        <>
          {props?.clips?.length ? (
            props?.clips
              ?.filter((clip, index) => index < 10)
              .map((clip) => (
                <SwiperSlide className="hoverSwiper" style={{ color: "white" }}>
                  <ClipCard video={clip} id={clip.id} />
                </SwiperSlide>
              ))
          ) : (
            <SwiperSlide
              className="hoverSwiper"
              style={{
                color: "white",
                display: "flex",
                gap: "2rem",
                width: "100%",
              }}
            >
              {[...Array(props.isMobile ? 1 : 5)].map((_, index) => (
                <div
                  style={{
                    margin: "2px",
                    marginTop: "15px",
                    width: props.isMobile && "100%",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={props.isMobile ? "100%" : "260px"}
                    height={props.isMobile ? "280px" : "150px"}
                    style={{
                      backgroundColor: "rgb(32, 32, 31)",
                      borderRadius: "5px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      style={{ backgroundColor: "rgb(32, 32, 31)" }}
                    />
                    <div>
                      <Skeleton
                        variant="text"
                        width={100}
                        height={15}
                        style={{ backgroundColor: "rgb(32, 32, 31)" }}
                      />
                      <Skeleton
                        variant="text"
                        width={50}
                        height={15}
                        style={{ backgroundColor: "rgb(32, 32, 31)" }}
                      />
                      <Skeleton
                        variant="text"
                        width={100}
                        height={15}
                        style={{ backgroundColor: "rgb(32, 32, 31)" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </SwiperSlide>
          )}
        </>
      )}  


      {props.Vod && (
   <Communities/>

      )}

    </Swiper>
  );
}

export default SliderLayout;
