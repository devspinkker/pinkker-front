import React, { useState, useEffect, Component } from "react";

import "./Channel.css";
import "../../components/dashboard/stream-manager/chat/ChatStreaming.css";
import { useDispatch, useSelector } from "react-redux";
import {
  GetStreamAndUserDataToken,
  getUserByIdTheToken,
  getUserByNameUser,
} from "../../services/backGo/user";
import bg from "./Banner2.jpg";

import { useParams } from "react-router-dom";

import Disconnected from "./Disconnected";

import Loader from "react-loader-spinner";

import CustomPlayer from "../customPlayer/customPlayer";

import PopupFollowers from "../popup/PopupFollowers/PopupFollowers";

import { getCategorieByName } from "../../services/categories";
import { getStreamByUserName } from "../../services/backGo/streams";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import Vod from "./vod/Vod";
import Clips from "./clips/Clips";
import ShareDropdown from "./dropdown/ShareDropdown";

import { Link } from "react-router-dom";
import verificado from "./VERIFICADO.jpg";
import {
  addRecientsChannel,
  existsRecientsChannelName,
} from "../../helpers/streamHelper";

import About from "./about/About";

import SuscriptionDropdown from "./dropdown/suscription/SuscriptionDropdown";

import { ScaleLoader } from "react-spinners";
import Gallery from "./gallery/Gallery";

import Emblem from "../emblem/Emblem";
import GiftSuscriptionDropdown from "./dropdown/giftsuscription/GiftSuscription";

import { getStreamerGallery } from "../../services/gallery";
import Muro from "./muro/Muro";
import { follow, unfollow } from "../../services/backGo/user";
import { ChatStreaming } from "../dashboard/stream-manager/chat/ChatStreaming";
import "../../components/dashboard/stream-manager/chat/ChatStreaming.css";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import NotificationProvider from "../../components/Notifications/NotificationProvider";
import { LuShare } from "react-icons/lu";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Button, Grid, Typography } from "@mui/material";
import Auth from "../auth/Auth";

export default function Channel({
  isMobile,
  tyExpanded,
  expanded,
  handleMessage,
}) {
  const [user, setUser] = useState(null);

  let token = window.localStorage.getItem("token");

  const { streamer } = useParams();
  const usersOnline = useSelector((state) => state.streamers);
  const [GetInfoUserInRoom, setGetInfoUserInRoom] = useState(null);

  const [followParam, setFollowParam] = useState(false);
  const [streamerFollowers, setStreamerFollowers] = useState(0);
  const [streamerData, setStreamerData] = useState(null);

  const [stream, setStream] = useState(null);
  const [usuarioID, setusuarioID] = useState(null);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeCount, setTimeCount] = useState(null);

  const [timeError, setTimeError] = useState(false);

  const [type, setType] = useState(2);

  const [showPopupFollowers, setShowPopupFollowers] = useState(false);

  const [categorie, setCategorie] = useState(null);

  const [readMore, setReadMore] = useState(false);

  const [dropdownShare, setDropdownShare] = useState(false);

  const [announce, setAnnounce] = useState(false);

  const [likeAnimation, setLikeAnimation] = useState(false);

  const [userInfoDiv, setUserInfoDiv] = useState(false);

  const [imageHovered, setImageHovered] = useState(false);

  const [pointGoal, setPointGoal] = useState(0);
  const [goal, setGoal] = useState(false);
  const [topGoal, setTopGoal] = useState(10000);

  const [hoverFollow, setHoverFollow] = useState(false);
  const [hoverSubscriber, setHoverSubscriber] = useState(false);

  const [dropdownSub, setDropdownSub] = useState(false);
  const [dropdownGiftSub, setDropdownGiftSub] = useState(false);

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const [users, setUsers] = useState(null);

  const ENDPOINT = process.env.REACT_APP_DEV_CHAT_URL;

  const [userSuscripted, setUserSuscripted] = useState(false);

  const [typeFollowers, setTypeFollowers] = useState(0);

  const [loadingFollow, setLoadingFollow] = useState(false);

  const updateStreamTitleCategoria = (newTitle, category) => {
    setStream((prevStream) => ({
      ...prevStream,
      stream_title: newTitle,
      stream_category: category,
    }));
  };
  const updateStreamOnline = (State) => {
    setStream((prevStream) => ({
      ...prevStream,
      online: State,
    }));
  };
  const updateStreamviews = (views) => {
    setStream((prevStream) => ({
      ...prevStream,
      ViewerCount: views,
    }));
  };
  const [time, setTime] = useState(0);
  let currentTime = 0;
  const [showPopupAuth, setShowPopupAuth] = useState(false);
  function togglePopupAuth() {
    setShowPopupAuth(!showPopupAuth);
  }

  // chat emergente
  const [chatWindow, setChatWindow] = useState(null);
  const openChatWindow = () => {
    if (!chatWindow || chatWindow.closed) {
      const newChatWindow = window.open(
        "about:blank",
        "ChatWindow",
        "width=400,height=600"
      );

      const head = document.head.cloneNode(true);
      newChatWindow.document.head.appendChild(head);

      setChatWindow(newChatWindow);
    } else {
      chatWindow.focus();
    }
  };
  useEffect(() => {
    if (chatWindow) {
      const chatContainer = chatWindow.document.createElement("div");
      chatWindow.document.body.appendChild(chatContainer);
      ReactDOM.render(
        <NotificationProvider>
          <MemoryRouter>
            <ChatStreaming
              updateStreamTitleCategoria={updateStreamTitleCategoria}
              updateStreamOnline={updateStreamOnline}
              updateStreamviews={updateStreamviews}
              openChatWindow={openChatWindow}
              streamerChat={stream}
              chatExpandeds={chatExpanded}
              ToggleChat={handleToggleChat}
              streamerData={streamerData}
              user={user}
              isMobile={isMobile}
              followParam={followParam}
              GetInfoUserInRoom={GetInfoUserInRoom}
            />
          </MemoryRouter>
        </NotificationProvider>,

        chatContainer
      );

      const handleUnload = () => {
        chatWindow.close();
        setChatWindow(null);
      };

      window.addEventListener("beforeunload", handleUnload);
      return () => {
        window.removeEventListener("beforeunload", handleUnload);
        if (chatWindow) {
          chatWindow.close();
        }
      };
    }
  }, [chatWindow]);

  useEffect(() => {
    loadDataOnlyOnce();
  }, [streamer]);
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = "unset");
    }
  }, []);
  const [elapsedTime, setElapsedTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const formatNumber = (number) => (number < 10 ? `0${number}` : number);

  useEffect(() => {
    if (stream?.online && stream?.start_date) {
      const calculateElapsedTime = () => {
        const startDateTime = new Date(stream.start_date);
        const now = new Date();

        const timeDifference = now - startDateTime;

        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));

        setElapsedTime({ hours, minutes, seconds });
      };

      // Calcular el tiempo inicialmente
      calculateElapsedTime();

      // Actualizar cada segundo
      const interval = setInterval(calculateElapsedTime, 1000);

      // Limpiar intervalo cuando el componente se desmonte
      return () => clearInterval(interval);
    }
  }, [stream?.start_date, stream?.online]);

  useEffect(() => {
    if (announce) {
      setInterval(() => {
        let duration = 45;
        currentTime = currentTime + 1;
        setTime(parseInt(duration - currentTime));

        if (duration === currentTime) {
          setAnnounce(false);
        }
      }, 1000);
    }
  }, []);

  const loadDataOnlyOnce = () => {};

  function togglePopupFollowers(typeDefault) {
    setTypeFollowers(typeDefault);
    setShowPopupFollowers(!showPopupFollowers);
  }

  const onMouseEnterShare = () => {
    if (dropdownShare === true) {
      setDropdownShare(false);
    } else {
      setDropdownShare(true);
    }
  };

  const onMouseEnterSub = () => {
    if (dropdownSub === true) {
      setDropdownSub(false);
    } else {
      setDropdownSub(true);
    }
  };

  const onMouseEnterGiftSub = () => {
    if (dropdownGiftSub === true) {
      setDropdownGiftSub(false);
    } else {
      setDropdownGiftSub(true);
    }
  };

  async function getUserToken() {
    if (token) {
      try {
        const res = await getUserByIdTheToken(token);
        if (res?.message === "ok" && res?.data?.id) {
          setUser(res.data);
          return res.data;
        }
      } catch (error) {}
    }
  }
  const [streamData, setStreamData] = useState();
  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.title = streamer + " - Pinkker";
    window.scrollTo(0, 0);

    const localType = localStorage.getItem("channelType");
    if (localType) {
      // setType(parseInt(localType));
      setType(2);
    } else {
      setType(2);
    }

    setFollowParam(false);
    setStreamerFollowers(0);
    setStreamerData(null);
    setStream(null);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTimeError(false);
    setCategorie(null);
    setReadMore(false);
    setTimeCount(null);

    const interval_id = window.setInterval(function () {},
    Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }

    const fetchData = async () => {
      let loggedUser = window.localStorage.getItem("_id");

      if (token) {
        const res = await GetStreamAndUserDataToken(streamer, token);

        if (res?.message == "ok" && res.data.user && res.data.stream) {
          const InfoStreamData = res.data;

          setStreamerData(InfoStreamData.user);
          setStream(InfoStreamData.stream);

          if (InfoStreamData.stream?.online == true) {
            // expanded();
          }

          if (InfoStreamData.user.isFollowedByUser) {
            setFollowParam(true);
          } else {
            setFollowParam(false);
          }

          setGetInfoUserInRoom(InfoStreamData?.UserInfo);
        }
      } else {
        const dataStreamer = await getUserByNameUser(streamer);
        if (dataStreamer?.message == "ok") {
          setStreamerData(dataStreamer.data);
        }

        const dataStream = await getStreamByUserName(streamer);

        if (dataStream != null && dataStream != undefined) {
          setStream(dataStream.data);
          if (dataStream.online == true) {
            expanded();
          }
        }
      }
      let dataUser;
      if (loggedUser) {
        setusuarioID(loggedUser);
        dataUser = await getUserToken();
      } else {
        setusuarioID("no _id");
      }
    };

    fetchData();
  }, [streamer]);

  useEffect(() => {
    if (stream != null && stream != undefined) {
      if (existsRecientsChannelName(stream.streamer)) {
        return;
      } else {
        addRecientsChannel(stream);
      }
    }
  }, [stream]);

  const [nameD, setNameD] = useState("Siguiendo");

  const callbackDonation = (e) => {
    setPointGoal(pointGoal + e);
    if (pointGoal < 9999) {
      setGoal(true);
      setPointGoal(0);
      setTimeout(() => {
        setGoal(false);
      }, 4000);
    }
  };
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
          {followParam ? (
            <button
              style={{ marginLeft: "5px" }}
              className="channel-bottom-v2-button-follow"
              onClick={() => unfollowUser()}
            >
              dejar de seguir
            </button>
          ) : (
            <button
              onClick={() =>
                user?.NameUser?.length ? followUser() : togglePopupAuth()
              }
              style={{ marginLeft: "5px" }}
              className="channel-bottom-v2-button-follow"
            >
              Seguir
            </button>
          )}
        </Tippy>
      );
    } else {
      return (
        <Tippy
          theme="pinkker"
          content={
            <h1
              style={{
                fontSize: "12px",
                fontFamily: "Montserrat",
              }}
            >
              Dejar de seguir
            </h1>
          }
        >
          {loadingFollow ? (
            <button
              style={{
                width: "100px",
                marginLeft: "5px",
                marginRight: "5px",
              }}
              className="followerscard-button-unfollow"
            >
              <ScaleLoader width={2} height={6} color="#f36197d7" />
            </button>
          ) : (
            <button
              style={{
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
          )}
        </Tippy>
      );
    }
  }

  const followUser = async () => {
    let loggedUser = window.localStorage.getItem("token");
    setFollowParam(true);
    let res = await follow(loggedUser, streamerData.id);
    setStreamerData((prevData) => {
      const updatedFollowers = {
        ...prevData.Followers,
        [usuarioID]: { Since: new Date(), Notifications: true },
      };
      return { ...prevData, Followers: updatedFollowers };
    });
  };

  const unfollowUser = async () => {
    let loggedUser = window.localStorage.getItem("token");

    let res = await unfollow(loggedUser, streamerData.id);
    setFollowParam(false);

    setStreamerData((prevData) => {
      const updatedFollowers = { ...prevData.Followers };
      delete updatedFollowers[usuarioID];
      return { ...prevData, Followers: updatedFollowers };
    });
  };

  function formatTime(time) {
    var hours =
      time.hours.toString().length === 1 ? "0" + time.hours : time.hours;

    var minutes =
      time.minutes.toString().length === 1 ? "0" + time.minutes : time.minutes;
    var seconds =
      time.seconds.toString().length === 1 ? "0" + time.seconds : time.seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  function timeDifference(date1, date2) {
    var difference = date1 - date2;

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    var secondsDifference = Math.floor(difference / 1000);

    setTimeCount(
      formatTime({
        hours: hoursDifference,
        minutes: minutesDifference - 3,
        seconds: secondsDifference,
      })
    );
    setHours(hoursDifference);
    setMinutes(minutesDifference);
    setSeconds(secondsDifference);
  }

  // async function reloadGallery() {
  //   const dataGallery = await getStreamerGallery(token, streamer);
  //   if (dataGallery != null && dataGallery != undefined) {
  //     setUnlocked(dataGallery.suscribed);
  //     setGallerys(dataGallery.gallery);
  //   }
  // }

  function getStream() {
    return (
      <div className="channel-v2-info">
        <div className="channel-v2-primary">
          <div className="channel-v2-categorie">
            <Link to={"/categorie/" + stream.stream_category}>
              <div>
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      {stream && stream.stream_category}
                    </h1>
                  }
                >
                  <img
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "100px",
                      objectFit: "cover",
                    }}
                    src={streamerData && streamerData.Avatar}
                  />
                </Tippy>
                {stream.online ? (
                  <h5 className="channel-avatar-text">LIVE</h5>
                ) : (
                  <div></div>
                )}
              </div>
            </Link>
            <div className="channel-info-streamer-stream-data">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="channel-bottom-avatar-text">
                  <h2
                    onClick={() => setUserInfoDiv(true)}
                    style={{
                      display: "flex",
                      cursor: "pointer",
                      alignItems: "center",
                      fontSize: "18px",
                      color: "#ededed",
                    }}
                  >
                    {streamer} <a style={{ marginRight: "5px" }}></a>{" "}
                    {streamerData && streamerData.Partner.active && (
                      <img
                        name={"Verificado"}
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                        src={verificado}
                      />
                    )}{" "}
                  </h2>
                </div>
              </div>
              <h4
                style={{
                  color: "#ededed",
                  marginTop: "4px",
                }}
              >
                {stream.stream_title}
              </h4>
              <h6
                style={{
                  color: "#d76995",
                }}
              >
                {stream.stream_category}
              </h6>
            </div>
          </div>

          <div className="channel-v2-content" style={{ marginRight: "5%" }}>
            {/* <div style={{ display: "flex" }}>
              {stream.stream_tag.map((tag) => (
                <p className="channel-title-tag">#{tag}</p>
              ))}
            </div> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "5px",
                marginRight: "3%",
              }}
            >
              {getButtonsFromChannel()}
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "25px",
                    marginRight: "0px",
                  }}
                  z
                >
                  <i
                    style={{
                      marginRight: "7px",
                      color: "darkgray",
                      fontSize: "12px",
                    }}
                    class="fas fa-user"
                  />
                  <p
                    style={{
                      color: "darkgray",
                      fontSize: "15px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stream.ViewerCount}
                  </p>
                </div>
                <a
                  style={{
                    marginLeft: "10px",
                    marginRight: "3px",
                    color: "#ededed",
                  }}
                >
                  •
                </a>
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "25px",
                      color: "darkgray",
                      marginLeft: "10px",
                    }}
                  >
                    <i
                      style={{ marginRight: "8px", fontSize: "12px" }}
                      class="fas fa-clock"
                    />
                    <p className="elapsedTime">
                      {`${formatNumber(elapsedTime.hours)}`}
                      {`: ${formatNumber(elapsedTime.minutes)}`}
                      {`: ${formatNumber(elapsedTime.seconds)}`}
                    </p>
                  </div>
                )}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Compartir
                      </h1>
                    }
                  >
                    <LuShare
                      style={{
                        color: "white",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                      onClick={() => onMouseEnterShare()}
                    />
                  </Tippy>
                  <Tippy
                    theme="pinkker"
                    content={
                      <h1
                        style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                      >
                        Opciones
                      </h1>
                    }
                  >
                    <FaEllipsisVertical
                      style={{
                        color: "white",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                    />
                  </Tippy>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {viewInfoStream && (
          <div className="channel-v2-secondary">
            <h3
              style={{
                color: "darkgray",
                fontFamily: "Poppins",
                fontSize: "12px",
              }}
            >
              PATROCINADO POR{" "}
              <img
                style={{
                  width: "90px",
                  position: "relative",
                  top: "6px",
                  left: "10px",
                }}
                src="/images/logo.png"
              />
            </h3>
          </div>
        )} */}
      </div>
    );
  }

  function getNotExpandedStream() {
    return (
      <div
        style={{ opacity: "1", marginLeft: "0px" }}
        className="channel-v2-info"
      >
        <div
          style={{
            width: "95%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-start",
          }}
        >
          <div style={{ marginLeft: "0px" }} className="channel-v2-primary">
            <div className="channel-v2-categorie">
              <Link to={"/categorie/" + stream.stream_category}>
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      {stream && stream.stream_category}
                    </h1>
                  }
                >
                  <img
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "100px",
                    }}
                    src={stream?.ImageCategorie}
                  />
                </Tippy>
              </Link>
            </div>

            <div className="channel-v2-content">
              <div style={{ display: "flex" }}>
                {stream.stream_tag.map((tag) => (
                  <p className="channel-title-tag">#{tag}</p>
                ))}
              </div>
              <h4
                style={{
                  color: "#ededed",
                  marginBottom: "4px",
                  marginTop: "4px",
                }}
              >
                {stream.stream_title}
              </h4>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "25px",
                    marginRight: "0px",
                  }}
                >
                  <i
                    style={{
                      marginRight: "7px",
                      color: "darkgray",
                      fontSize: "12px",
                    }}
                    class="fas fa-user"
                  />
                  <p style={{ color: "darkgray", fontSize: "15px" }}>
                    {stream?.ViewerCount}{" "}
                    {/* <a style={{ color: "darkgray" }}> personas mirando ahora</a> */}
                  </p>
                </div>
                <a
                  style={{
                    marginLeft: "10px",
                    marginRight: "3px",
                    color: "#ededed",
                  }}
                >
                  •
                </a>
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "25px",
                      color: "darkgray",
                      marginLeft: "10px",
                    }}
                  >
                    <i
                      style={{ marginRight: "8px", fontSize: "12px" }}
                      class="fas fa-clock"
                    />
                    <p style={{ fontSize: "15px", display: "flex" }}>
                      <p>{`${formatNumber(elapsedTime.hours)}`}</p>
                      <p>{`: ${formatNumber(elapsedTime.minutes)}`}</p>
                      <p>{`: ${formatNumber(elapsedTime.seconds)}`}</p>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="channel-v2-secondary">
            <h3
              style={{
                color: "darkgray",
                fontFamily: "Poppins",
                fontSize: "12px",
                marginRight: "20px",
              }}
            >
              PATROCINADO POR{" "}
              <img
                style={{
                  width: "90px",
                  position: "relative",
                  top: "6px",
                  left: "5px",
                }}
                src="/images/logo.png"
              />
            </h3>
          </div>
        </div>
      </div>
    );
  }

  function getButtonsFromChannel() {
    if (streamer === user?.NameUser) {
      return (
        <div
          style={{ marginLeft: tyExpanded && "-50px" }}
          className="channel-bottom-v2-secondary"
        >
          {/* <Tippy
            placement="bottom"
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Regalar suscripciones a tu canal
              </h1>
            }
          >
            <button
              onClick={() => onMouseEnterGiftSub()}
              onMouseEnter={() => setHoverSubscriber(true)}
              onMouseLeave={() => setHoverSubscriber(false)}
              style={{ width: "155px", marginRight: "5px" }}
              className="channel-bottom-v2-button-sub"
            >
              <i
                style={{ marginRight: "5px" }}
                class={hoverSubscriber ? "fas fa-star" : "far fa-star"}
              />{" "}
              Regalar suscripciones
            </button>
          </Tippy> */}

          {dropdownShare && (
            <ShareDropdown title={stream.stream_title} streamer={streamer} />
          )}
          {dropdownSub && (
            <SuscriptionDropdown
              closeNavbar={() => setDropdownSub(false)}
              title={stream.stream_title}
              streamerData={streamerData}
              streamer={streamer}
            />
          )}
          {dropdownGiftSub && (
            <GiftSuscriptionDropdown
              users={users}
              closeNavbar={() => setDropdownGiftSub(false)}
              title={stream.stream_title}
              streamerData={streamerData}
              streamer={streamer}
            />
          )}
        </div>
      );
    }

    return (
      <div
        style={{ marginRight: tyExpanded && "3%" }}
        className="channel-bottom-v2-secondary"
      >
        {userSuscripted ? (
          <Tippy
            placement="bottom"
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Gestionar tu suscripción
              </h1>
            }
          >
            <button className="channel-bottom-v2-button-gestion">
              <i style={{ marginRight: "5px" }} class={"fas fa-star"} />{" "}
              Gestionar suscripción
            </button>
          </Tippy>
        ) : (
          // <Tippy
          //   placement="bottom"
          //   theme="pinkker"
          //   content={
          //     <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
          //       Suscribirse al canal
          //     </h1>
          //   }
          // >
          //   <button
          //     onClick={onMouseEnterSub}
          //     onMouseEnter={() => setHoverSubscriber(true)}
          //     onMouseLeave={() => setHoverSubscriber(false)}
          //     className="channel-bottom-v2-button-sub"
          //   >
          //     <i
          //       style={{ marginRight: "5px" }}
          //       class={hoverSubscriber ? "fas fa-star" : "far fa-star"}
          //     />{" "}
          //     Suscribirse
          //   </button>
          // </Tippy>
          <></>
        )}
        {!isMobile && (
          // <Tippy
          //   placement="bottom"
          //   theme="pinkker"
          //   content={
          //     <h1
          //       style={{
          //         fontSize: "12px",
          //         fontFamily: "Montserrat",
          //         whiteSpace: "nowrap",
          //       }}
          //     >
          //       Regalar suscripciones a tu canal
          //     </h1>
          //   }
          // >
          //   <button
          //     onClick={() => onMouseEnterGiftSub()}
          //     onMouseEnter={() => setHoverSubscriber(true)}
          //     onMouseLeave={() => setHoverSubscriber(false)}
          //     style={{ width: "155px", marginLeft: "5px" }}
          //     className="channel-bottom-v2-button-sub"
          //   >
          //     <i
          //       style={{ marginRight: "5px", whiteSpace: "nowrap" }}
          //       class={hoverSubscriber ? "fas fa-star" : "far fa-star"}
          //     />{" "}
          //     <span style={{ whiteSpace: "nowrap" }}>
          //       Regalar suscripciones
          //     </span>
          //   </button>
          // </Tippy>
          <></>
        )}

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
            onClick={() => handleMessage(stream.streamerId)}
            className="channel-bottom-v2-button-follow"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              margin: 0,
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <i class="fas fa-envelope" />
            <span>Enviar Mensaje </span>
          </button>
        </Tippy>

        {dropdownShare && (
          <ShareDropdown title={stream.stream_title} streamer={streamer} />
        )}
        {dropdownSub && (
          <SuscriptionDropdown
            closeNavbar={() => setDropdownSub(false)}
            title={stream.stream_title}
            streamerData={streamerData}
            streamer={streamer}
          />
        )}
        {dropdownGiftSub && (
          <GiftSuscriptionDropdown
            users={users}
            closeNavbar={() => setDropdownGiftSub(false)}
            title={stream.stream_title}
            streamerData={streamerData}
            streamer={streamer}
          />
        )}
      </div>
    );
  }

  function getBottomStream() {
    return (
      <div className="channel-bottom-v2-info">
        <div className="channel-bottom-v2-primary">
          <div style={{ left: "-5px" }} className="channel-avatar-top">
            <div
              onMouseEnter={() => setImageHovered(true)}
              onMouseLeave={() => setImageHovered(false)}
              className="channel-avatar-top-img-container"
            >
              <img
                className="channel-avatar-user"
                style={{ marginLeft: "5px" }}
                src={streamerData && streamerData.Avatar}
                alt=""
              />
            </div>

            {/* {stream.online ? (
              <h5
                className="channel-avatar-text"
                style={{
                  color: "#ededed",
                  padding: "2px",
                  borderRadius: "5px",
                  position: "relative",
                  left: "-10px",
                  top: imageHovered ? "-20px" : "-27px",
                  width: "85px",
                }}
              >
                EN DIRECTO
              </h5>
            ) : (
              <div></div>
            )} */}
          </div>

          <div
            style={{ height: "30px", display: "flex", alignItems: "center" }}
          >
            <div className="channel-bottom-avatar-text">
              <h2
                onClick={() => setUserInfoDiv(true)}
                style={{
                  marginRight: "15px",
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                  fontSize: "18px",
                  color: "#ededed",
                  marginTop: "45px",
                }}
              >
                {streamer} <a style={{ marginRight: "5px" }}></a>{" "}
                {streamerData && streamerData.Partner.active && (
                  <Emblem name={"Verificado"} img={verificado} />
                )}{" "}
              </h2>
              {!isMobile && (
                <h2
                  style={{
                    marginRight: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    width: "320px",
                  }}
                >
                  {" "}
                  <a onClick={() => togglePopupFollowers(0)}>
                    {streamerData && streamerData.FollowersCount} seguidores
                  </a>{" "}
                  <a style={{ marginLeft: "10px", marginRight: "10px" }}>•</a>{" "}
                  <a onClick={() => togglePopupFollowers(1)}>
                    {streamerData && Object.keys(streamerData.Following).length}{" "}
                    seguidos
                  </a>{" "}
                  {/* <a style={{ marginLeft: "10px", marginRight: "10px" }}>•</a>{" "} */}
                  {/* <a onClick={() => togglePopupFollowers(2)}>
                    {suscribers && suscribers.length} suscriptores
                  </a> */}
                </h2>
              )}
              {/* <h2
                style={{ color: "gold", fontSize: "12px", marginTop: "10px" }}
              >
                DNG TEAM
              </h2> */}
            </div>
          </div>
        </div>
        {getButtonsFromChannel()}
      </div>
    );
  }

  function getType() {
    if (type === 0) {
      return <Vod streamer={streamerData} limit={4} sort={1} />;
    }

    if (type === 1) {
      return <Muro streamer={streamerData} limit={4} sort={1} />;
    }

    if (type === 2) {
      return <About streamer={streamerData} limit={4} sort={1} />;
    }

    if (type === 3) {
      return <Gallery streamer={streamerData} tyExpanded={tyExpanded} />;
    }

    if (type === 4) {
      return <Clips idStreamer={streamerData.id} streamer={streamer} />;
    }
  }

  function handleAnnounce() {
    setAnnounce(true);
  }

  function renderAnnoucement() {
    if (announce) {
      return (
        <div className="announcement">
          <div className="announcement-navbar">
            <div>
              <h3>
                {streamer} se está tomando un descanso publicitario; quedate
                aquí para apoyar su stream
              </h3>
            </div>
            <div>
              <h3>
                Anuncio (0:{time.toString().length === 1 ? "0" + time : time})
              </h3>
            </div>
          </div>
          {/*<video onTimeUpdate={(e) => handleProgress(e)} className="video-publicity" autoPlay={true} muted={true} width="100%" height="755px" src="/images/video.mp4"/>*/}

          <iframe
            className="video-publicity"
            width="100%"
            height="875px"
            src="https://www.youtube-nocookie.com/embed/kbRInqghnHI?controls=0&autoplay=1"
            title="Pinkker Publicidad"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>

          <div className="announcement-front">
            <div className="announcement-front-button">
              {time > 35 && (
                <button className="announcement-button">
                  Omitir anuncio en {time - 35}
                </button>
              )}
              {time <= 35 && (
                <button
                  onClick={() => setAnnounce(false)}
                  className="announcement-button"
                >
                  Omitir anuncio{" "}
                  <i
                    style={{ color: "white", marginLeft: "5px" }}
                    class="fas fa-chevron-right"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  const [started, setStarted] = useState(false);

  function getHeightPlayer() {
    if (isMobile) {
      return tyExpanded ? "400px" : "400px";
    }

    return tyExpanded ? "100%" : "849px";
  }

  function renderPlayer() {
    return (
      <CustomPlayer
        dashboard={false}
        isMobile={isMobile}
        expanded={tyExpanded}
        ToggleChat={handleToggleChat}
        chatExpanded={chatExpanded}
        setChatExpanded={setChatExpanded}
        height={getHeightPlayer()}
        marginLeft={tyExpanded ? "-17px" : "6px"}
        started={started}
        vod={false}
        streamer={streamer}
        time={stream && stream.start_date}
        streamerData={streamerData}
        stream={stream}
        user={user}
      ></CustomPlayer>
    );
  }

  function getLeftForType() {
    if (type === 0) {
      return "230px";
    }

    if (type === 1) {
      return "35px";
    }

    if (type === 4) {
      return "322px";
    }

    if (type === 3) {
      return "130px";
    }

    if (type === 2) {
      return "415px";
    }
  }
  const [chatExpandedMobile, setchatExpandedMobile] = useState(false);

  function changeType(typeD) {
    if (typeD == 9) {
      setchatExpandedMobile(true);
    } else {
      setchatExpandedMobile(false);
    }
    localStorage.setItem("channelType", typeD);
    setType(typeD);
  }
  const [chatExpanded, setChatExpanded] = useState(false);

  const handleToggleChat = () => {
    setChatExpanded(!chatExpanded);
  };
  const handleToggleChatMobile = () => {
    setchatExpandedMobile(false);
  };

  function getWithChannelVideo() {
    if (isMobile) {
      return "100%";
    }
    return tyExpanded
      ? chatExpanded
        ? "100%"
        : "100%"
      : chatExpanded
      ? "90%"
      : "90%";
  }

  function getChannel() {
    if (stream?.streamer) {
      return (
        <div
          className="channel-body"
          style={
            {
              // padding: expanded ? "0rem 0rem " : "0rem 10rem",
            }
          }
        >
          <div className="channel-content-video">
            <div
              style={{
                width: getWithChannelVideo(),
                marginTop: "2%",
              }}
              className="channel-video"
            >
              <div className="conteiner-streamer-online-infoStream">
                {stream.online ? (
                  <div className="channel-custom-player-main-div">
                    {streamerData && announce === false && renderPlayer()}
                  </div>
                ) : (
                  <Grid
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: "15px",
                      backgroundImage: `url(${bg})`, // Imagen de fondo
                      backgroundSize: "cover", // Escala la imagen para cubrir completamente el contenedor
                      backgroundPosition: "center", // Centra la imagen de fondo
                      backgroundRepeat: "no-repeat", // Evita que la imagen se repita

                      padding: "4%", // Espaciado interno opcional

                      boxShadow: "0 0 8px 2px #000",
                    }}
                  >
                    <Grid
                      style={{
                        backgroundColor: "rgba(0,0,0,0.74)",
                        display: "flex",
                        gap: "15px",
                        padding: 15,
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{
                          background: "#fff",
                          fontWeight: "bold",
                          padding: 5,
                          borderRadius: 5,
                        }}
                      >
                        Desconectado
                      </Typography>
                      <Typography style={{ color: "#fff", fontSize: 18 }}>
                        {streamerData?.NameUser} está fuera de línea
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {renderAnnoucement()}
              </div>

              {!stream.online && (
                <Grid
                  style={{
                    width: "90%",
                    display: "flex",
                    margin: "25px",
                    gap: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Imagen de perfil circular */}

                  <Grid style={{ display: "flex", gap: "10px" }}>
                    <img
                      src={streamerData?.Avatar}
                      style={{
                        width: "75px", // Ajusta este tamaño según tu preferencia
                        height: "75px",
                        borderRadius: "50%",
                        border: "1px solid #696969",
                      }}
                    />

                    {/* Contenedor de Nombre y Botones */}
                    <Grid
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                      }}
                    >
                      {/* Nombre del usuario */}
                      <Typography
                        style={{
                          color: "#ededed",
                          fontWeight: 800,
                          fontSize: "24px", // Tamaño grande como en la imagen
                          textShadow: " rgb(0, 0, 0) 0px 1px 0px",
                        }}
                      >
                        {streamerData?.NameUser}
                      </Typography>

                      <Typography
                        style={{
                          color: "white",
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        {streamerData?.FollowersCount} seguidores
                      </Typography>
                    </Grid>
                  </Grid>
                  {getButtonsFromChannel()}
                </Grid>
              )}

              <div
                style={{
                  marginTop: stream?.Online ? "" : "22px",
                }}
                className="Channel-info-streamMain"
              >
                {stream.online && getStream()}

                {!isMobile && (
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      width: !tyExpanded ? "96.5%" : "90%",
                      gap: "10px",
                      marginLeft: "3%",
                      borderBottom: "1px solid #2a2e38",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                        borderBottom: type === 0 && "1px solid #f56096",
                        zIndex: 9999,
                      }}
                      onClick={() => changeType(0)}
                    >
                      Vods
                    </Typography>
                    <Typography
                      style={{
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                        borderBottom: type === 2 && "1px solid #f56096",
                        zIndex: 9999,
                      }}
                      onClick={() => changeType(2)}
                    >
                      Acerca De
                    </Typography>
                    <Typography
                      style={{
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                        borderBottom: type === 4 && "1px solid #f56096",
                        zIndex: 9999,
                      }}
                      onClick={() => changeType(4)}
                    >
                      Clips
                    </Typography>
                  </Grid>
                )}
                <div style={{ width: "100%", margin: "0 auto" }}>
                  {streamerData && !isMobile && getType()}
                </div>
                {isMobile && (
                  <div style={{ width: "100%", margin: "0 auto" }}>
                    {streamerData && !isMobile && getType(9)}
                  </div>
                )}
                {isMobile && (
                  <ChatStreaming
                    updateStreamTitleCategoria={updateStreamTitleCategoria}
                    updateStreamOnline={updateStreamOnline}
                    updateStreamviews={updateStreamviews}
                    openChatWindow={openChatWindow}
                    streamerChat={stream}
                    chatExpandeds={chatExpanded}
                    ToggleChat={handleToggleChatMobile}
                    streamerData={streamerData}
                    user={user}
                    isMobile={isMobile}
                    followParam={followParam}
                    GetInfoUserInRoom={GetInfoUserInRoom}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      setTimeout(() => {
        setTimeError(true);
      }, 5000);

      return (
        <div
          style={{
            minHeight: "1200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {timeError === false && <ScaleLoader color="#f36197d7" />}
          {timeError === true && (
            <h1 style={{ color: "#ededed" }}>No hay transmisiones en vivo</h1>
          )}
        </div>
      );
    }
  }

  return (
    <div
      id="ChannelConteiner"
      className={
        (!tyExpanded && !isMobile && "container-channel") ||
        (tyExpanded && !isMobile && "container-channel-expand") ||
        (isMobile && "container-channel-isMobile") ||
        ""
      }
      style={{ width: isMobile && "100%" }}
    >
      {getChannel()}

      {showPopupFollowers === true && (
        <PopupFollowers
          typeDefault={typeFollowers}
          closePopup={() => togglePopupFollowers()}
          streamer={streamer}
        />
      )}

      {showPopupAuth === true && (
        <Auth typeDefault={1} closePopup={() => togglePopupAuth()} />
      )}

      {stream?.streamer && !isMobile && (
        <div
          style={{
            width: chatExpanded ? "0" : "25%",
            borderLeft: "1px solid rgb(42, 46, 56)",
          }}
          className="channel-chat"
        >
          {announce === true && (
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "black",
              }}
            >
              {streamerData && (
                <CustomPlayer
                  isMobile={isMobile}
                  height={"200px"}
                  vod={false}
                  streamerName={streamer}
                  time={stream && stream.start_date}
                  user={user}
                ></CustomPlayer>
              )}
            </div>
          )}

          <ChatStreaming
            updateStreamTitleCategoria={updateStreamTitleCategoria}
            updateStreamOnline={updateStreamOnline}
            updateStreamviews={updateStreamviews}
            openChatWindow={openChatWindow}
            streamerChat={stream}
            chatExpandeds={chatExpanded}
            ToggleChat={handleToggleChat}
            streamerData={streamerData}
            user={user}
            isMobile={isMobile}
            followParam={followParam}
            GetInfoUserInRoom={GetInfoUserInRoom}
          />
        </div>
      )}
    </div>
  );
}
