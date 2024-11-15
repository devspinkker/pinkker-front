import React, { useState, useEffect } from "react";

import "./Categorie.css";

import { useParams } from "react-router-dom";

import { getCategorieByName } from "../../services/categories";

import useTheme from "../../theme/useTheme";

import { useNotification } from "../Notifications/NotificationProvider";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ScaleLoader } from "react-spinners";
import { getStreamsByCategory } from "../../services/backGo/streams";
import Card from "../home/categories/CardStream";
import { Grid, Typography, Skeleton } from "@mui/material";
import CustomSelect from "../explore/categories/CustomSelect";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import CardStreamRecomendado from "../home/categories/CardStreamRecomendado";
import chancho from './Chancho--dengue.png'
export default function Categorie() {
  const [categorie, setCategorie] = useState(null);
  const [streams, setStreams] = useState(null);
  const [follow, setFollow] = useState(false);

  const { categorieName } = useParams();

  const [type, setType] = useState(0);

  const [nameD, setNameD] = useState("Siguiendo");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("Mas visto");

  const handleSortByChange = (e) => {
    setSortBy(e);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // const data = await userFollowCategorie(token, categorieName);
  //     const data = await getCategoriesWithLimit();

  //     if (data != null && data != undefined && data.status == 200) {
  //       setFollow(data.data);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const responseStreams = await getStreamsByCategory(categorieName, 1);
      if (responseStreams?.message === "ok") {
        setStreams(responseStreams.data);
        return;
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const dataCategorie = await getCategorieByName(categorieName);
      setCategorie(dataCategorie);
    };
    fetchData();
  }, []);

  async function followUser() {
    // const data = await followCategorie(token, categorieName);
    // if (data != null && data != undefined && data.status == 200) {
    //   alert({ type: "SUCCESS", message: data.data.msg });
    //   setFollow(true);
    // }
  }

  async function unfollowUser() {
    // const data = await unfollowCategorie(token, categorieName);
    // if (data != null && data != undefined && data.status == 200) {
    //   alert({ type: "SUCCESS", message: data.data.msg });
    //   setFollow(false);
    // }
  }

  function getButtonFollow() {
    if (follow != null && follow != undefined) {
      if (follow) {
        return (
          <Tippy
            theme="pinkker"
            content={
              <h1
                style={{
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                  whiteSpace: "nowrap",
                }}
              >
                Dejar de seguir
              </h1>
            }
          >
            <button
              style={{
                width: "100px",
                marginLeft: "20px",
                backgroundColor: nameD === "Siguiendo" && "#762543",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={() => setNameD("Dejar de seguir")}
              onMouseLeave={() => setNameD("Siguiendo")}
              onClick={() => unfollowUser()}
              className="followerscard-button-unfollow"
            >
              {nameD}
            </button>
          </Tippy>
        );
      } else {
        return (
          <button
            style={{ marginTop: "0px", marginLeft: "20px" }}
            onClick={() => followUser()}
            className="channel-bottom-v2-button-follow"
          >
            Seguir
          </button>
        );
      }
    }
  }

  function getCategorie() {
    if (categorie != null) {
      return (
        <div>
          <div
            style={{ backgroundImage: "url(" + categorie.banner + ")" }}
            className="categorie-title"
          >
            <div style={{ width: "95%", display: "flex", margin: "0 auto" }}>
              <div style={{ width: "13.5%", marginTop: "20px" }}>
                <img
                  style={{
                    width: "175px",
                    boxShadow: "1px 1px 15px rgba(0,0,0,0.75)",
                  }}
                  src={categorie.image}
                  alt=""
                />
              </div>
              <div
                style={{
                  marginTop: "20px",
                  backgroundColor: "#101010de",
                  height: "125px",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <h1
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: "#ededed",
                    textShadow: "3px 1px 0px rgba(0,0,0,0.6)",
                  }}
                >
                  {categorie.name}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <h4
                    style={{
                      color: "darkgray",
                      textShadow: "3px 1px 0px rgba(0,0,0,0.6)",
                    }}
                  >
                    {" "}
                    <a style={{ fontSize: "18px", color: "#ededed" }}>
                      {categorie.followers.length}
                    </a>{" "}
                    seguidores •
                  </h4>
                  <h4
                    style={{
                      marginLeft: "10px",
                      marginRight: "5px",
                      color: "darkgray",
                      textShadow: "3px 1px 0px rgba(0,0,0,0.6)",
                    }}
                  >
                    <a style={{ fontSize: "18px", color: "#ededed" }}>
                      {categorie.spectators}
                    </a>{" "}
                    espectadores
                  </h4>
                  {getButtonFollow()}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  {categorie &&
                    categorie.tags.map((tag) => (
                      <p className="categorie-title-tag">{tag}</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  function getLeftForType() {
    if (type === 0) {
      return "40px";
    }

    if (type === 1) {
      return "135px";
    }

    if (type === 2) {
      return "232px";
    }
  }

  function getCategorieMain() {
    if (categorie == null && streams != null) {
      return (
        <div className="categorie-container">
          {getCategorie()}

          <div className="card-stream-map">
            {streams != null &&
              streams.map((stream) => (
                <Card
                  style={{
                    margin: "0",
                    marginTop: "25px",
                    marginRight: "25px",
                  }}
                  tags={stream.stream_tag}
                  avatarStreamer={stream.streamer_avatar}
                  name={stream.streamer}
                  categorie={stream.stream_category}
                  title={stream.stream_title}
                  viewers={stream.ViewerCount}
                  image={stream.stream_thumbnail}
                  ViewerCount={stream.ViewerCount}
                />
              ))}
          </div>
        </div>
      );
    }
  }

  return (
    <Grid style={{maxWidth: 'calc(1200px + 6vw)', margin: '0 auto'}}>
      <Grid
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderBottom: "1px solid rgb(42, 46, 56)",
          padding: "10px 0px",
          width: "100%",
        }}
      >
        {categorie?.data?.img ? (
          <Grid style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <Link
              to="/plataform/explore?tipo=categories"
              style={{
                padding: "10px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#121418",
                transition: "all 1s",
              }}

              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a2e38"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#121418"}

            >
              <IoIosArrowBack className="" style={{ color: "white", fontSize: "24px" }} />
            </Link>


            <Grid>
              <h3 style={{ color: "white" }}>{categorie?.data?.nombre}</h3>
              <div className="user_data_contain">
                <div className="custom-categories-p-2">
                  {<span id="pulsatingDot" />}
                  <p className="custom-categories-p-2-spectators">
                    <span>{categorie?.data?.spectators ?? "0"}</span>
                    espectadores
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
        ) : (
          <Grid
            style={{ display: "flex", gap: "5px", alignItems: "flex-start" }}
          >
            <Skeleton
              variant="rectangular"
              width={60}
              height={60}
              style={{
                backgroundColor: "rgb(32, 32, 31)",
                borderRadius: "5px",
              }}
            />

            <Grid
              style={{
                display: "flex",
                gap: "2px",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Skeleton
                variant="text"
                width={50}
                style={{ backgroundColor: "rgb(32, 32, 31)" }}
              />
              <Skeleton
                variant="text"
                width={30}
                style={{ backgroundColor: "rgb(32, 32, 31)" }}
              />
            </Grid>
          </Grid>
        )}
        <img
          style={{
            width: "4.19%",

            boxShadow: "1px 1px 15px rgba(0,0,0,0.75)",
            borderRadius: "5px",
            paddingTop: "10px",
          }}
          src={categorie?.data?.img}
          alt=""
        />
      </Grid>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: " 1px solid rgb(42, 46, 56)",
          padding: "10px 0rem",
        }}
      >
        <div className="explorecategories-card-container-filter-input">
          <img
            src="/images/search.svg"
            style={{
              fontSize: "16px",
              color: "rgb(89 89 89)",
              margin: "8px",
            }}
          />
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Búsqueda"
          />
          {filterValue && (
            <AiOutlineCloseCircle
              style={{ color: "white", cursor: "pointer" }}
              onClick={(e) => setFilterValue("")}
            />
          )}
        </div>
        <div>
          <CustomSelect
            options={["Random", "Mas visto", "Menos visto"]}
            defaultValue="Mas visto"
            onChange={(value) => handleSortByChange(value)}
          />
        </div>
      </div>

      <Grid
        style={{
          display: "flex",
          padding: "10px 0rem",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          className="home-recommended-card-container-streams"
          style={{
            width: "100%",
            marginBottom: "11%",
          }}
        >
          {streams?.map((stream) => (
            <div style={{ marginRight: "9px" }} key={stream.id}>
              <CardStreamRecomendado
                tags={stream.stream_tag}
                isMobile={false}
                streamer={stream.streamer}
                categorie={stream.stream_category}
                title={stream.stream_title}
                name={stream.streamer}
                isLoading={false}
                avatarStreamer={stream.streamer_avatar}
                image={stream.stream_thumbnail}
                ViewerCount={stream.ViewerCount}
              />
              {/* <Skeleton
                variant="rectangular"
                width={365}
                height={250}
                style={{
                  backgroundColor: "rgb(32, 32, 31)",
                  marginBottom: "10px",
                }}
              /> */}
            </div>
          ))}
          {!streams && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>

              <img src={chancho} style={{ width: '30%' }} />
              <Typography style={{ color: 'white', textAlign: 'center', fontSize: '18px' }}>No hay directos en este momento!</Typography>

            </div>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
