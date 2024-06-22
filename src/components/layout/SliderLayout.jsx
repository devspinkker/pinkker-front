import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import CardCategorie from "../home/categories/CardCategorie";
import ClipCard from "../card/ClipCard";
import "./SliderLayout.css";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { GrGamepad } from "react-icons/gr";
import SelectVideoClip from "../home/clips/SelectVideoClip";
import VodCard from "../card/VodCard";
import ClipCardChannel from "../card/ClipCardChannel";

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
    window.addEventListener('resize', checkScreenResolution);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', checkScreenResolution);
  }, []);
  return (
    <Swiper
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
      }}
      spaceBetween={props.clipT ? 20 : 0}
      navigation={{
        nextEl: ".custom-next",
        prevEl: ".custom-prev",
      }}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      slidesPerView={
        props.isMobile ? (props.clipT ? 1 : 3) : props.clipT ? 4.5 : isFullHD ? 8.5 : 7}
      Pagination
      onSlideChange={() => console.log("slide change")}
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
        {props.Categoria && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: !props.isMobile && "80%",
            }}
          >
            {/* <img src="/images/original.svg" style={{ width: '2%', color:'#856ffc' }} /> */}

            <GrGamepad style={{ color: "#ff69c4", fontSize: "20px" }} />
            <h2 style={{ fontFamily: "Inter", color: "white" }}>Categorias</h2>
          </div>
        )}

        {props.clipT && (
          <Grid
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              width: "30%",
            }}
          >
            <AiOutlinePlayCircle
              style={{ color: "#ff69c4", fontSize: "20px" }}
            />
            <h2 style={{ color: "white", fontSize: "20px" }}>
              {props.titulo
                ? "Vods más vistos"
                : props.isMobile
                  ? "Clips"
                  : "Clips más vistos"}{" "}
            </h2>
          </Grid>
        )}
        {props.Vods && (
          <Grid
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              width: "30%",
            }}
          >
            <AiOutlinePlayCircle
              style={{ color: "#ff69c4", fontSize: "20px" }}
            />
            <h2 style={{ color: "white", fontSize: "20px" }}>
              {props.isMobile
                ? "Clips"
                : "Vods más vistos"}{" "}
            </h2>
          </Grid>
        )}

        <div
          className="manager-recommended-actions"
          style={{ width: "30% !important", justifyContent: "flex-end" }}
        >
          <div className="manager-recommended-actions-ver-todos">
            <Link
              to="/plataform/explore?tipo=categories"
              style={{ padding: 0 }}
            >
              <span
                style={{ fontFamily: "Signika Negative", fontSize: "14px" }}
              >
                Ver todos
              </span>
            </Link>
          </div>

          <div className="manager-recommended-actions-arrow">
            <div className="custom-prev" style={{ fontSize: "14px" }}>
              {" "}
              <i
                style={{ margin: "0px 10px", cursor: "pointer" }}
                className="fas fa-chevron-left"
              ></i>
            </div>
            <div className="custom-next" style={{ fontSize: "14px" }}>
              {" "}
              <i
                style={{ cursor: "pointer" }}
                className="fas fa-chevron-right"
              ></i>
            </div>
          </div>
        </div>
      </Grid>

      {props.Categoria && (
        <>
          {props?.Categories?.filter((categorie, index) => index < 10).map(
            (categorie, index) => (
              <SwiperSlide style={{ color: "white" }}>
                <CardCategorie
                  width={props.isMobile ? "180px" : '160px'}
                  height={props.isMobile ? "100%" : '180px'}

                  name={categorie.nombre}
                  image={categorie.img ?? "/images/pinkker-stream.png"}
                  spectators={categorie.spectators}
                  tags={categorie.tags}
                  TopColor={categorie.TopColor}
                />
              </SwiperSlide>
            )
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
                />
              </SwiperSlide>
            )
          )}
        </>
      )}

      {props.clipT && (
        <>
          {props?.clips
            ?.filter((clip, index) => index < 10)
            .map((clip) => (
              <SwiperSlide className="hoverSwiper" style={{ color: "white" }}>
                {/* <ClipCard video={clip} /> */}

                <ClipCard video={clip} />
              </SwiperSlide>
            ))}
        </>
      )}
      {props.Vods && (
        <>
          {props?.clips
            ?.filter((clip, index) => index < 10)
            .map((clip) => (
              <SwiperSlide className="hoverSwiper" style={{ color: "white" }}>
                <VodCard
                  width={"300px"}
                  views={clip.views}
                  createdAt={clip.createdAt}
                  duration={clip.duration}
                  image={"https://res.cloudinary.com/pinkker/image/upload/v1669407676/min/jpikyrdltculevcxkstj.png"}
                  title={clip.clipName}
                  categorie={clip.stream.stream_category}
                  tags={clip.stream.stream_tag}
                />
              </SwiperSlide>
            ))}
        </>
      )}



    </Swiper>
  );
}

export default SliderLayout;
