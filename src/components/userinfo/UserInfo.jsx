import React, { useState, useEffect } from "react";

import Draggable from "react-draggable";

import "./UserInfo.css";

import { getUserInfo } from "../../services/user";

import { useSelector } from "react-redux";

import Tippy from "@tippyjs/react";

import { follow, unfollow, userFollowUser } from "../../services/follow";

export default function UserInfo({
  streamer,
  close,
  userMod,
  handleSendMessage,
  user,
}) {
  const token = window.localStorage.getItem("token");

  const [userInfo, setUserInfo] = useState(null);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [followParam, setFollowParam] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user.name != streamer) {
        const dataFollowParam = await userFollowUser(token, streamer);
        if (dataFollowParam != null && dataFollowParam != undefined) {
          setFollowParam(dataFollowParam.data);
        }
      }

      const data = await getUserInfo(token, streamer);
      if (data != null && data != undefined) {
        setUserInfo(data);
      }
    };
    fetchData();
  }, [token]);

  async function followUser() {
    const data = await follow(token, streamer);
    if (data != null) {
      alert(data.data.msg);
      setFollowParam(true);
    } else {
      alert(data);
    }
  }

  async function unfollowUser() {
    const data = await unfollow(token, streamer);
    if (data != null) {
      alert(data.data.msg);
      setFollowParam(false);
    } else {
      alert(data);
    }
  }

  function getFollowButton() {
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
            style={{ marginLeft: "10px" }}
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
            onClick={() => unfollowUser()}
            style={{ marginLeft: "10px", width: "125px" }}
            className="channel-bottom-v2-button-follow"
          >
            Dejar de seguir
          </button>
        </Tippy>
      );
    }
  }

  function getModButton() {
    return (
      <div
        style={{ marginLeft: "10px", marginBottom: "10px" }}
        className="userinfo-button-moderator"
      >
        <Tippy
          theme="pinkker"
          content={
            <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
              Vetar a {streamer}
            </h1>
          }
        >
          <button className="channel-bottom-v2-button-icon">
            <i class="fas fa-times-circle" />
          </button>
        </Tippy>

        <Tippy
          theme="pinkker"
          content={
            <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
              Expulsar temporalmente a {streamer}
            </h1>
          }
        >
          <button className="channel-bottom-v2-button-icon">
            <i class="fas fa-clock" />
          </button>
        </Tippy>
      </div>
    );
  }

  function getButtons() {
    if (user.name != streamer) {
      return (
        <div>
          <div>
            {getFollowButton()}
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Enviar mensaje
                </h1>
              }
            >
              <button
                onClick={() => handleSendMessage(streamer)}
                className="channel-bottom-v2-button-icon"
              >
                <i class="fas fa-envelope" />
              </button>
            </Tippy>
          </div>
          <button className="userinfo-sub-button">
            <i class="fas fa-gift" /> Regalar una suscripción
          </button>
          {userMod === true && getModButton()}
        </div>
      );
    }

    if (user.name === streamer) {
      return (
        <div>
          <div>
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Editar tu perfil
                </h1>
              }
            >
              <button
                style={{ marginLeft: "10px" }}
                className="channel-bottom-v2-button-follow"
              >
                Editar perfil
              </button>
            </Tippy>
          </div>
          <button className="userinfo-sub-button">
            Editar identidad en el chat
          </button>
        </div>
      );
    }
  }

  return (
    <Draggable style={{ zIndex: "99999" }}>
      <div className="userinfo-body">
        {userInfo && (
          <div className="userinfo-container">
            <div
              style={{
                backgroundImage: "url(" + userInfo.banner + ")",
                backgroundPosition: "center",
              }}
              className="userinfo-navbar"
            >
              <div className="userinfo-close">
                <i
                  onClick={() => close()}
                  style={{
                    cursor: "pointer",
                    fontSize: "15px",
                    color: "#ededed",
                  }}
                  class="fas fa-times pinkker-button-more"
                ></i>
              </div>
              <div className="userinfo-info">
                <div style={{ marginRight: "10px" }}>
                  <img
                    style={{ width: "55px", borderRadius: "100px" }}
                    src={user.lookImage}
                  />
                </div>
                <div>
                  <h3 style={{ color: "#ededed" }}>{streamer}</h3>
                  <p style={{ fontSize: "13px", color: "#ededed" }}>
                    {userInfo.biography}
                  </p>
                </div>
              </div>
            </div>

            <div className="userinfo-emblem-container">
              <h4
                style={{
                  fontFamily: "Poppins",
                  marginLeft: "10px",
                  color: "#ededed",
                }}
              >
                EMBLEMAS
              </h4>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <div>
                  <i
                    style={{ color: "#ededed" }}
                    onClick={() => setCarouselIndex(carouselIndex - 1)}
                    class="fas fa-arrow-left pinkker-button-more"
                  ></i>
                </div>

                {carouselIndex === 0 && (
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        dengueeLoco
                      </h1>
                    }
                  >
                    <div className="emblem-card">
                      <img
                        style={{ width: "40px" }}
                        src="https://res.cloudinary.com/pinkker/image/upload/c_scale,w_24/v1644511292/avatar/ribiqqyfj5p528veuugr.jpg"
                      />
                    </div>
                  </Tippy>
                )}

                {carouselIndex === 1 && (
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        :)
                      </h1>
                    }
                  >
                    <div className="emblem-card">
                      <img
                        style={{ width: "40px" }}
                        src="https://static-cdn.jtvnw.net/emoticons/v2/1/default/light/1.0"
                      />
                    </div>
                  </Tippy>
                )}

                <div>
                  <i
                    style={{ color: "#ededed" }}
                    onClick={() => setCarouselIndex(carouselIndex + 1)}
                    class="fas fa-arrow-right pinkker-button-more"
                  ></i>
                </div>
              </div>
            </div>

            {getButtons()}
          </div>
        )}
      </div>
    </Draggable>
  );
}
