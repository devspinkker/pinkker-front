import React, { useEffect, useState } from "react";

import Tippy from "@tippyjs/react";

import { useSelector } from "react-redux";

import { useNotification } from "../Notifications/NotificationProvider";

import { useHistory } from "react-router";
import { follow, unfollow } from "../../services/backGo/user";

export default function FollowCard({ followData }) {
  let token = window.localStorage.getItem("token");
  const [followParam, setFollowParam] = useState(false);

  const alert = useNotification();
  const [nameD, setNameD] = useState("Siguiendo");
  const routerHistory = useHistory();

  // useEffect(() => {
  //   if (token != null && token != undefined && token != "") {
  //     const fetchData = async () => {
  //       const dataFollowParam = await userFollowUser(
  //         token,
  //         followData?.NameUser
  //       );
  //       if (dataFollowParam != null && dataFollowParam != undefined) {
  //         setFollowParam(dataFollowParam.data);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, [token]);

  async function followUser() {
    setFollowParam(true);

    const data = await follow(token, followData?.id);
    if (data != null) {
    } else {
      alert({ message: data, type: "ERROR" });
      setFollowParam(false);
    }
  }

  async function unfollowUser() {
    setFollowParam(false);

    const data = await unfollow(token, followData?.id);
    if (data != null) {
    } else {
      alert({ message: data, type: "ERROR" });
      setFollowParam(true);
    }
  }

  function onClickChangeRoute(text) {
    routerHistory.push(text);
  }

  function getFollowButton() {
    if (followParam != null && followParam != undefined) {
      if (followParam === false) {
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
              style={{ marginTop: "0px", fontSize: "12px" }}
              className="channel-bottom-v2-button-follow"
            >
              Seguir
            </button>
          </Tippy>
        );
      } else {
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
      }
    }
  }

  return (
    <div className="muro-tweet-secondary-follow-card">
      <div style={{ display: "flex" }}>
        {console.log(followData)}
        <img
          onClick={() => onClickChangeRoute("/" + followData?.NameUser)}
          style={{
            width: "35px",
            borderRadius: "50px",
            marginRight: "10px",
            cursor: "pointer",
          }}
          src={followData?.Avatar}
        />
        <div>
          <h3 onClick={() => onClickChangeRoute("/" + followData?.NameUser)}>
            {followData?.NameUser}
          </h3>
          <p style={{ color: "darkgray", fontSize: "13px" }}>
            {followData?.FollowersCount} seguidores
          </p>
        </div>
      </div>
      {getFollowButton()}
    </div>
  );
}
