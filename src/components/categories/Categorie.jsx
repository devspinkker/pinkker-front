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

export default function Categorie() {
  const [categorie, setCategorie] = useState(null);
  const [streams, setStreams] = useState(null);
  const [follow, setFollow] = useState(false);

  const { categorieName } = useParams();

  const theme = useTheme();

  const [type, setType] = useState(0);

  const alert = useNotification();
  const [nameD, setNameD] = useState("Siguiendo");

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

      if (responseStreams != null && responseStreams.message == "ok") {
        setStreams(responseStreams.data);
        return;
      }
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
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Dejar de seguir
              </h1>
            }
          >
            <button
              style={{
                width: "100px",
                marginLeft: "20px",
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
                />
              ))}
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          minHeight: "800px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScaleLoader color="#f36197d7" />
      </div>
    );
  }

  return (
    <div className={"categorie-body-" + theme.theme}>{getCategorieMain()}</div>
  );
}
