import React, { useEffect, useState } from "react";

import "./VideoCard.css";

import "tippy.js/dist/tippy.css";

import { Link } from "react-router-dom";

import DropdownSettings from "../home/dropdown/DropdownSettings";

export default function VideoCard(props) {
  const formatViewers = (viewers) => {
    if (viewers >= 1000) {
      return (viewers / 1000).toFixed(1) + "k";
    } else {
      return viewers;
    }
  };

  const [dropdownSettings, setDropdownSettings] = useState(false);

  function toggleDropdownSettings() {
    setDropdownSettings(!dropdownSettings);
  }

  function ellipsis(text, length) {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  }

  function getCard() {
    if (props.big === true) {
      return (
        <>
          <div className="content-streamer-img-follow-content">
            <Link
              style={{ textDecoration: "none", cursor: "pointer" }}
              to={"/" + props.streamer}
            >
              <div className="videocard-streamer-image">
                <img
                  src={
                    props.streamerImage
                      ? props.streamerImage
                      : "/images/pinkker-stream.png"
                  }
                  alt=""
                />
                {dropdownSettings && (
                  <DropdownSettings
                    closeNavbar={() => toggleDropdownSettings()}
                  />
                )}
              </div>
            </Link>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Link
                style={{ textDecoration: "none", cursor: "pointer" }}
                to={"/" + props.streamer}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "800",
                    fontSize: "24px",
                  }}
                >
                  {props.streamer}
                </span>
              </Link>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    width: "-webkit-fill-available",
                  }}
                >
                  {ellipsis(props.title, 25)}
                </h3>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "80%",
                      marginLeft: "12%",
                      gap: "15px",
                    }}
                  >
                    {props.tags?.map((tags) => (
                      <p
                        style={{
                          fontSize: "14px",
                          // backgroundColor: "#f36196",
                          borderRadius: "15%",
                          paddingLeft: 15,
                          paddingRight: 15,
                          color: "#f36196",
                        }}
                      >
                        {tags}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="fa-ellipsis-h-cont">
              <span class="fafa-ellipsis-h" aria-hidden="true">
                seguir
              </span>
            </div>
          </div>
          <div style={props.style} className="videocard-body">
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexDirection: " column",
                marginBottom: "10px",
              }}
            ></div>

            <div className="videocard-container">
              <h4 className="videocard-online">EN DIRECTO</h4>
              <h3 className="videocard-entrar">ENTRAR</h3>

              <Link
                style={{ textDecoration: "none", cursor: "default" }}
                to={"/" + props.streamer}
              >
                <div className="home-categories-container-card-contain">
                  <img
                    // style={{
                    //   width: props.isMobile ? "102%" : "290px",
                    //   borderRadius: "5px",
                    // }}
                    src={
                      props.image ? props.image : "/images/pinkker-stream.png"
                    }
                    alt=""
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className="conteiner-info-viewers">
            <p style={{ color: "#ededed" }} className="videocard-spectator">
              espectadores {formatViewers(props.viewers)}
            </p>
            <i style={{ color: "white" }} className="fas fa-retweet" />
            <i style={{ color: "white" }} className="fas fa-retweet" />
          </div>
        </>
      );
    } else {
      return (
        <div style={props.style} className="videocard-body">
          <div className="videocard-container">
            <div className="videocard-container-info">
              <p style={{ color: "#ededed" }} className="videocard-spectator">
                {formatViewers(props.viewers)} espectadores
              </p>
              <p className="videocard-VIVO">EN VIVO</p>
            </div>

            <Link
              style={{ textDecoration: "none", cursor: "default" }}
              to={"/" + props.streamer}
            >
              <div className="home-categories-container-card-contain">
                <img
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                  }}
                  src={props.image ? props.image : "/images/pinkker-stream.png"}
                  alt=""
                />
              </div>
            </Link>
          </div>
        </div>
      );
    }
  }

  return <>{getCard()}</>;
}
