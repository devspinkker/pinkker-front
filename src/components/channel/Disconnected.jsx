import React, { useEffect, useState } from "react";

import "./Disconnected.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  follow,
  unfollow,
  userFollowUser,
  getStreamerFollowers,
  getUser,
} from "../../services/follow";

import { getStreamerStream } from "../../services/stream";

import Featured from "./featured/Featured";

import Vod from "./vod/Vod";

import Clips from "./clips/Clips";
import Gallery from "./gallery/Gallery";
import Muro from "./muro/Muro";
import About from "./about/About";

import Tippy from "@tippyjs/react";

import { Link } from "react-router-dom";
import Community from "./community/Community";

import OptionsDropdown from "./disconnected/dropdown/OptionsDropdown";

import { FastAverageColor } from "fast-average-color";

import Emblem from "../emblem/Emblem";

import { useNotification } from "../Notifications/NotificationProvider";

import PopupFollowers from "../popup/PopupFollowers/PopupFollowers";
import useImageColor from "use-image-color";
import { Button } from "@mui/material";

export default function Disconnected({ isMobile }) {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [type, setType] = useState(0);
  const { streamer } = useParams();

  const [streamerData, setStreamerData] = useState(null);
  const [streamerFollowers, setStreamerFollowers] = useState(0);
  const [followParam, setFollowParam] = useState(false);

  const [stream, setStream] = useState(null);

  const [gallerys, setGallerys] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const [dropdownOptions, setDropdownOptions] = useState(false);
  const [showPopupFollowers, setShowPopupFollowers] = useState(false);
  const [typeFollowers, setTypeFollowers] = useState(0);

  const fac = new FastAverageColor();
  const [hoverSubscriber, setHoverSubscriber] = useState(false);

  const alert = useNotification();
  const [nameD, setNameD] = useState("Siguiendo");

  function togglePopupFollowers(typeDefault) {
    setTypeFollowers(typeDefault);
    setShowPopupFollowers(!showPopupFollowers);
  }

  const onMouseEnterOptions = () => {
    if (dropdownOptions === true) {
      setDropdownOptions(false);
    } else {
      setDropdownOptions(true);
    }
  };

  useEffect(async () => {
    window.scrollTo(0, 0);

    const dataStreamer = await getUser(streamer);
    if (dataStreamer != null && dataStreamer != undefined) {
      setStreamerData(dataStreamer);
    }

    const dataFollowers = await getStreamerFollowers(streamer);
    if (dataFollowers != null && dataFollowers != undefined) {
      setStreamerFollowers(dataFollowers);
    }

    if (token != null && token != undefined && token != "") {
      const fetchData = async () => {
        const dataFollowParam = await userFollowUser(token, streamer);
        if (dataFollowParam != null && dataFollowParam != undefined) {
          setFollowParam(dataFollowParam.data);
        }

        const dataStream = await getStreamerStream(token, streamer);
        if (dataStream != null && dataStream != undefined) {
          setStream(dataStream);
        }
      };

      fetchData();
    }
  }, [token]);

  const container = document.querySelector(".disconnected-top");

  const [colorAverage, setColorAverage] = useState(null);
  let { colors } = useImageColor(
    "https://res.cloudinary.com/pinkker/image/upload/v1678831125/banners/Sin-t%C3%ADtulo-1_buahi3.png",
    { cors: true, colors: 2 }
  );

  useEffect(async () => {
    if (
      streamerData != null &&
      streamerData != undefined &&
      streamerData != ""
    ) {
      if (container != null && container != undefined) {
        //const color = await fac.getColorAsync(streamerData.banner);
        //container.style.backgroundColor = color.rgba;

        if (colors != null && colors != undefined && colors.length > 0) {
          setColorAverage(colors[0]);
        }
      }
    }
  }, [streamerData, container]);

  async function followUser() {
    const data = await follow(token, streamer);
    if (data != null) {
      alert({ type: "SUCCESS", message: data.data.msg });
      setFollowParam(true);
    } else {
      alert({ type: "ERROR", message: data });
    }
  }

  async function unfollowUser() {
    const data = await unfollow(token, streamer);
    if (data != null) {
      alert({ type: "SUCCESS", message: data.data.msg });
      setFollowParam(false);
    } else {
      alert({ type: "ERROR", message: data });
    }
  }

  function getFollowButton() {
    if (followParam != null && followParam != undefined) {
      if (followParam) {
        return (
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Dejar de seguir
              </h1>
            }
          >
            <button
              style={{
                marginTop: "0px",
                width: "100px",
                marginLeft: "5px",
                marginRight: "5px",
                backgroundColor: nameD === "Siguiendo" && "#762543",
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
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Empezar a seguir
              </h1>
            }
          >
            <button
              onClick={() => followUser()}
              style={{ marginLeft: "5px", marginTop: "0px" }}
              className="channel-bottom-v2-button-follow"
            >
              Seguir
            </button>
          </Tippy>
        );
      }
    }
  }

  function getLeftForType() {
    if (type === 0) {
      return "42px";
    }

    if (type === 1) {
      return "137px";
    }

    if (type === 2) {
      return "229px";
    }

    if (type === 3) {
      return "322px";
    }
  }

  function getType() {
    if (type === 0) {
      return <Muro streamer={streamer} limit={4} sort={1} />;
    }

    if (type === 1) {
      return (
        <Gallery unlocked={unlocked} gallerys={gallerys} streamer={streamer} />
      );
    }

    if (type === 2) {
      return (
        <Clips unlocked={unlocked} gallerys={gallerys} streamer={streamer} />
      );
    }

    if (type === 3) {
      return <About streamer={streamerData} limit={4} sort={1} />;
    }
  }

  function getColor() {}

  function getDateFormat(date) {
    const dateObject = new Date(date);
    const month = dateObject.toLocaleString("default", { month: "long" });
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();

    return `${day} de ${month} de ${year}`;
  }

  function renderProfile() {
    if (streamerData != null) {
      return (
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/*BANNER*/}
            <div
              style={{
                background: `right cover no-repeat url(../../images/headerarriba.png)`,
                height: "150px",
              }}
            ></div>
            {/* perfil */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                alignItems: "top",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <img
                  className="disconnected-user-avatar"
                  style={{
                    width: isMobile ? "100px" : "200px",
                    borderRadius: "50%",
                  }}
                  src={streamerData.avatar}
                />
                <h1
                  style={{
                    fontFamily: "Poppins",
                    fontSize: isMobile ? "24px" : "30px",
                    lineHeight: "73px",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  {streamerData.name}{" "}
                  {streamerData && streamerData.verified && (
                    <Emblem
                      style={{
                        marginLeft: "10px",
                        marginTop: "-15px",
                        borderRadius: "2px",
                        height: "17px"
                      }}
                      
                      name="Verificado"
                      img="/images/emblem/verificado.jpg"
                    />
                  )}
                </h1>
              </div>
              <Button>Editar perfil</Button>
            </div>
          </div>
          {/* <div style={{background: `url(../../images/headerarriba.png)`}} className="disconnected-top">
                    <div className="disconnected-top-image">
                        <img className="disconnected-user-avatar" style={{ width: isMobile ? "150px" : "200px"}} src={streamerData.avatar} />
                    </div>

                    <div className="disconnected-top-profile">
                        <div style={{position: "relative", top: isMobile ? "-20px" : "-30px"}}>
                            <h1 style={{fontFamily: "Poppins", fontSize: isMobile ? "55px" : "75px", lineHeight: "73px", display: "flex", alignItems: "center"}}>{streamerData.name} {streamerData && streamerData.verified && <Emblem style={{marginLeft: "10px", marginTop: "-15px", borderRadius: "2px"}} imageWidth={"25px"} name="Verificado" img="/images/emblem/verificado.jpg" />}</h1>
                            <p style={{marginTop: "10px", color: "white", marginLeft: "1px", filter: "brightness(100%)"}}>{streamerData.biography}</p>
                            
                            <div style={{display: "flex", alignItems: "center"}}>
                                <p onClick={() => togglePopupFollowers(0)} style={{position: "relative", top: "30px", color: "#ededed", cursor: "pointer"}}><a style={{color: "darkgray", fontWeight: "400"}}>{streamerData.followers.length}</a> seguidores</p>
                                <p onClick={() => togglePopupFollowers(1)} style={{position: "relative", top: "30px", color: "#ededed", marginLeft: "20px", cursor: "pointer"}}><a style={{color: "darkgray", fontWeight: "400"}}>{streamerData.following.length}</a> seguidos</p>
                                <p onClick={() => togglePopupFollowers(0)} style={{position: "relative", top: "30px", color: "#ededed", marginLeft: "20px", cursor: "pointer"}}><a style={{color: "darkgray", fontWeight: "400"}}>{streamerData.suscribers.length}</a> suscriptores</p>

                            </div>
                        </div>
                    </div>
                </div>
                {colorAverage != null && <div style={{boxShadow: "1px 1px 50px 3px " + colorAverage}} className="disconnected-shadow"/>}
                
                <div className="disconnected-secondary">
                    <div className="disconnected-buttons-container">

                        {token && <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Suscribirse al canal</h1>}>
                            <button style={{marginTop: "0px"}} onMouseEnter={() => setHoverSubscriber(true)} onMouseLeave={() => setHoverSubscriber(false)} className="channel-bottom-v2-button-sub"><i style={{marginRight: "5px"}} class={hoverSubscriber ? "fas fa-star" : "far fa-star"}/> Suscribirse</button>    
                        </Tippy>}

                        {token && <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Regalar suscripciones a tu canal</h1>}>
                            <button onMouseEnter={() => setHoverSubscriber(true)} onMouseLeave={() => setHoverSubscriber(false)}  style={{width: "155px", marginLeft: "5px", marginTop: "0px"}} className="channel-bottom-v2-button-sub"><i style={{marginRight: "5px"}} class={hoverSubscriber ? "fas fa-star" : "far fa-star"}/> Regalar suscripciones</button>    
                        </Tippy>}

                        {token && getFollowButton()}
                            
                        {token && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Enviar mensaje</h1>}>
                            <button style={{marginTop: "0px"}} className="channel-bottom-v2-button-icon"><i class="fas fa-envelope"/></button>
                        </Tippy>}

                        {token && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Compartir</h1>}>
                            <button style={{marginTop: "0px"}} className="channel-bottom-v2-button-icon"><i class="fas fa-share-alt"/></button>
                        </Tippy>}
        
                        {token && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Opciones</h1>}>
                            <button style={{marginTop: "0px"}} className="channel-bottom-v2-button-icon"><i class="fas fa-ellipsis-v"/></button>
                        </Tippy>}

                        



                    </div>

                    <div style={{display: "flex", alignItems: "center", marginTop: "20px", color: "darkgray"}}>
                        <p style={{fontSize: "14px", fontWeight: "600"}}><i class="fas fa-birthday-cake"/> {getDateFormat(streamerData.birthDate)}</p>
                        <p style={{fontSize: "14px", fontWeight: "600", marginLeft: "15px"}}><i class="fas fa-calendar-alt"/> Se unio el {getDateFormat(streamerData.createdAt)}</p>
                        <p style={{fontSize: "14px", fontWeight: "600", marginLeft: "15px"}}><i class="fas fa-map-marker-alt"/> {streamerData.countryInfo?.country}, {streamerData.countryInfo?.city}</p>

                    </div>
                    <a href={streamerData.website ? streamerData.website : "https://pinkker.tv/" + streamer} className="disconnected-url-link" style={{fontSize: "14px", color: "#ff60b2", cursor: "pointer",position: "relative", top: "5px", textDecoration: "none"}}>{streamerData.website ? streamerData.website : "https://pinkker.tv/" + streamer}</a>
                            

                    <div style={{width: "100%", margin: "0 auto", borderTop: "0.01em solid #2b2b2b3f", marginTop: "20px", zIndex: "1000"}} className="type-set">
                        <div style={{zIndex: "1000"}} onClick={() => setType(0)} className={ type === 0 ? "type-card active" : "type-card"}>
                            <h3>Muro</h3>
                        </div>
                        <div style={{zIndex: "1000"}} onClick={() => setType(1)} className={ type === 1 ? "type-card active" : "type-card"}>
                            <h3>Galeria</h3>
                        </div>
                        <div style={{zIndex: "1000"}} onClick={() => setType(2)} className={ type === 2 ? "type-card active" : "type-card"}>
                            <h3>Clips</h3>
                        </div>
                        <div style={{zIndex: "1000"}} onClick={() => setType(3)} className={ type === 3 ? "type-card active" : "type-card"}>
                            <h3>Acerca de</h3>
                        </div>
                                            
                        <div style={{left: getLeftForType(), zIndex: "1000"}} className="type-line"></div>
                    </div>

                    {getType()}
                    
                </div> */}
        </div>
      );
    }
  }

  return (
    <div className="disconnected-body">
      {renderProfile()}

      {showPopupFollowers === true && (
        <PopupFollowers
          typeDefault={typeFollowers}
          closePopup={() => togglePopupFollowers()}
          streamer={streamer}
        />
      )}
    </div>
  );
}
