import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";

import { useSelector } from "react-redux";

import { getStreamerStream } from "../../services/stream";
import ReactTooltip from "react-tooltip";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

function UserOnline(props) {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  //String Ellipsis
  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  const formatViewers = (viewers) => {
    if (viewers >= 1000) {
      return (viewers / 1000).toFixed(1) + "k";
    } else {
      return viewers;
    }
  };
  return (
    <div
      style={{
        marginLeft: "5px",
        marginTop: "15px",
        width: "100%",
        // borderLeft: "5px solid #f960b3",
      }}
    >
      <Tippy
        placement="right"
        theme="player"
        content={
          <div style={{ color: "#ededed", fontSize: "12px" }}>
            <img
              style={{ width: "150px", objectFit: "cover" }}
              src={props.thumb ? props.thumb : "/images/pinkker-stream.png"}
              alt=""
            />{" "}
            <h3>{props.title && truncateString(props.title, 18)}</h3>
          </div>
        }
      >
        <li
          data-tip
          data-for="tip-useronline"
          style={{
            padding: "5px",
            width: props.tyExpanded === true ? "90%" : "50px",
            borderLeft: "3px solid transparent",
          }}
          class="navbaraccount-li"
        >
          <NavLink exact key={props.streamer} to={`/${props.streamer}`}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "45px",
                  position: "relative",
                  marginRight: "5px",
                }}
                className="navbar-image-avatar-container"
              >
                <div
                  style={{
                    backgroundColor: "transparent",
                    width: "33px",
                    height: "33px",
                  }}
                  className="navbar-image-avatar"
                >
                  <img
                    style={{ width: "33px", height: "33px" }}
                    src={props.image}
                    alt=""
                  />
                </div>
              </div>

              <div className="navbaraccount-li-title">
                <div>
                  <p
                    style={{
                      color: "#ededed",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {props.streamer}{" "}
                    {props.streamer === user.name && (
                      <a
                        style={{
                          backgroundColor: "rgb(249, 24, 128)",
                          padding: "2px",
                          borderRadius: "3px",
                          fontSize: "9px",
                        }}
                      >
                        YOU
                      </a>
                    )}
                  </p>
                  <p
                    style={{
                      color: "#efb810",
                      fontSize: "12px",
                      letterSpacing: "0.3px",
                      fontWeight: "600",
                    }}
                  >
                    {props.category}
                  </p>
                </div>

                {props.streamer === user.name ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "right",
                      justifyContent: "right",
                      marginTop: "3px",
                      position: "relative",
                      left: "-18px",
                    }}
                  >
                    <div className="navbarleft-point"></div>
                    <p style={{ color: "#ededed", marginLeft: "5px" }}>
                      {formatViewers(props?.viewers)}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "right",
                      justifyContent: "right",
                      marginTop: "3px",
                      position: "relative",
                      left: "-18px",
                    }}
                  >
                    <div className="navbarleft-point"></div>
                    <p style={{ color: "#ededed", marginLeft: "5px" }}>
                      {formatViewers(props?.viewers)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </NavLink>
        </li>
      </Tippy>
    </div>
  );
}

export default React.memo(UserOnline);
