import React, { useState, useEffect, Component } from "react";

import "./Channel.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserByIdTheToken,
  getUserByNameUser,
} from "../../services/backGo/user";

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

import {
  addRecientsChannel,
  existsRecientsChannelName,
} from "../../helpers/streamHelper";

import { useNotification } from "../Notifications/NotificationProvider";

import { useLastLocation } from "react-router-last-location";

import About from "./about/About";

import useChatMessage from "../../hooks/chatmessage/useChatMessage";

import SuscriptionDropdown from "./dropdown/suscription/SuscriptionDropdown";

import { ScaleLoader } from "react-spinners";
import Gallery from "./gallery/Gallery";

import Emblem from "../emblem/Emblem";
import GiftSuscriptionDropdown from "./dropdown/giftsuscription/GiftSuscription";

import { getStreamerGallery } from "../../services/gallery";
import Muro from "./muro/Muro";
import NavbarLeft from "../navbarLeft/NavbarLeft";
import { useHistory } from "react-router-dom";
import { follow, unfollow } from "../../services/backGo/user";
import { ChatStreaming } from "../dashboard/stream-manager/chat/ChatStreaming";

export default function Channel({
  isMobile,
  tyExpanded,
  expanded,
  handleMessage,
}) {
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const { streamer } = useParams();
  const usersOnline = useSelector((state) => state.streamers);

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
  const [suscribers, setSuscribers] = useState(null);
  const [gallerys, setGallerys] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const [viewers, setViewers] = useState(0);

  const [viewInfoStream, setViewInfoStream] = useState(false);

  const [typeFollowers, setTypeFollowers] = useState(0);

  const [loadingFollow, setLoadingFollow] = useState(false);

  const alert = useNotification();

  const [time, setTime] = useState(0);
  let currentTime = 0;

  const [showOmitir, setShowOmitir] = useState(false);
  const history = useHistory();
  const location = useLastLocation();

  useEffect(() => {
    async function getUserToken() {
      let token = window.localStorage.getItem("token");

      if (token) {
        try {
          const res = await getUserByIdTheToken(token);
          if (res?.message === "ok" && res?.data?.id) {
            setUser(res.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    let loggedUser = window.localStorage.getItem("_id");
    if (loggedUser) {
      setusuarioID(loggedUser);
      getUserToken();
    } else {
      setusuarioID("no _id");
    }
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
    const calculateElapsedTime = () => {
      const startDateTime = new Date(stream?.start_date);
      const now = new Date();

      const timeDifference = now - startDateTime;
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));

      setElapsedTime({ hours, minutes, seconds });
    };

    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [stream?.start_date]);

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

  useEffect(() => {
    document.body.classList.add("hide-scrollbar");
    document.title = streamer + " - Pinkker";
    window.scrollTo(0, 0);

    const localType = localStorage.getItem("channelType");
    if (localType) {
      setType(parseInt(localType));
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
      //   const dataFollowParam = await userFollowUser(token, streamer);
      //   if (dataFollowParam != null && dataFollowParam != undefined) {
      //     setFollowParam(dataFollowParam.data);
      //   }
      // }

      // const dataViewers = await getViewersStream(streamer);
      // if (dataViewers != null && dataViewers != undefined) {
      //   setViewers(dataViewers);
      // }

      // const dataFollowers = await getStreamerFollowers(streamer);

      // if (dataFollowers != null && dataFollowers != undefined) {
      //   setStreamerFollowers(dataFollowers);
      // }
      const dataStreamer = await getUserByNameUser(streamer);
      if (dataStreamer?.message == "ok") {
        setStreamerData(dataStreamer.data);
      }
      let loggedUser = window.localStorage.getItem("_id");
      if (dataStreamer.data?.Followers.hasOwnProperty(loggedUser)) {
        setFollowParam(true);
      } else {
        setFollowParam(false);
      }
      const dataStream = await getStreamByUserName(streamer);

      if (dataStream != null && dataStream != undefined) {
        setStream(dataStream.data);
        if (dataStream.online == true) {
          expanded();
        }

        // if (dataStream.stream_likes.includes(name)) {
        //   setLikeAnimation(true);
        // }

        const dataCategorie = await getCategorieByName(
          dataStream.stream_category
        );
        if (dataCategorie != null && dataCategorie != undefined) {
          setCategorie(dataCategorie);
        }
      }

      const dataGallery = await getStreamerGallery(token, streamer);
      if (dataGallery != null && dataGallery != undefined) {
        setUnlocked(dataGallery.suscribed);
        setGallerys(dataGallery.gallery);
      }

      // const timer1 = setInterval(async () => {
      //   const dataViewers = await getViewersStream(streamer);
      //   if (dataViewers != null && dataViewers != undefined) {
      //     setViewers(dataViewers);
      //   }

      //   const dataStream = await getStreamerStream(streamer);
      //   if (dataStream != null && dataStream != undefined) {
      //     setStream(dataStream);
      //     const getUser = () => {
      //       return fetchUsersOnline(token).then((res) => {
      //         dispatch(dispatchGetAllStreamers(res));
      //       });
      //     };
      //     getUser();
      //   }
      // }, 30000);

      const timer2 = setInterval(async () => {
        if (dataStream != null && dataStream != undefined) {
          var dateNow = new Date().getTime();
          timeDifference(dateNow, dataStream.start_date);
        }
      }, 1000);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataStream = await getStreamByUserName(streamer);
        if (
          stream?.ModChat !== dataStream?.data?.ModChat ||
          stream?.ModSlowMode !== dataStream?.data.ModSlowMode
        ) {
          setStream((prevStream) => ({
            ...prevStream,
            ModChat: dataStream?.data?.ModChat,
            ModSlowMode: dataStream?.data?.ModSlowMode,
          }));
        }
        if (dataStream.data.online) {
          expanded();
        }
      } catch (error) {
        console.error("Error fetching stream data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 6000);

    return () => clearInterval(interval);
  }, [streamer]);

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
              onClick={() => followUser()}
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
                marginTop: "20px",
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
                marginTop: "20px",
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

  async function reloadGallery() {
    const dataGallery = await getStreamerGallery(token, streamer);
    if (dataGallery != null && dataGallery != undefined) {
      setUnlocked(dataGallery.suscribed);
      setGallerys(dataGallery.gallery);
    }
  }

  function getStream() {
    return (
      <div
        onMouseEnter={() => setViewInfoStream(true)}
        onMouseLeave={() => setViewInfoStream(false)}
        className="channel-v2-info"
      >
        <div className="channel-v2-primary">
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
            <h4
              style={{
                color: "#ededed",
                marginBottom: "4px",
                marginTop: "4px",
              }}
            >
              {stream.stream_title}
            </h4>
          </div>
          {!isMobile && (
            <img
              width={"250px"}
              src="https://res.cloudinary.com/dcj8krp42/image/upload/v1710372554/Emblemas/logo4fixfix_h5afxo.png"
              alt=""
            />
          )}
          <div className="channel-v2-content">
            {/* <div style={{ display: "flex" }}>
              {stream.stream_tag.map((tag) => (
                <p className="channel-title-tag">#{tag}</p>
              ))}
            </div> */}

            <div style={{ display: "flex", alignItems: "center" }}>
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
                  {stream.ViewerCount} espectadores
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
    if (streamer === user?.name) {
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
          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Compartir
              </h1>
            }
          >
            <button
              onClick={() => onMouseEnterShare()}
              className="channel-bottom-v2-button-icon"
            >
              <i class="fas fa-share-alt" />
            </button>
          </Tippy>

          <Tippy
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Opciones
              </h1>
            }
          >
            <button className="channel-bottom-v2-button-icon">
              <i class="fas fa-ellipsis-v" />
            </button>
          </Tippy>
        </div>
      );
    }

    return (
      <div
        style={{ marginLeft: tyExpanded && "-50px" }}
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
          <Tippy
            placement="bottom"
            theme="pinkker"
            content={
              <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                Suscribirse al canal
              </h1>
            }
          >
            <button
              onClick={onMouseEnterSub}
              onMouseEnter={() => setHoverSubscriber(true)}
              onMouseLeave={() => setHoverSubscriber(false)}
              className="channel-bottom-v2-button-sub"
            >
              <i
                style={{ marginRight: "5px" }}
                class={hoverSubscriber ? "fas fa-star" : "far fa-star"}
              />{" "}
              Suscribirse
            </button>
          </Tippy>
        )}
        {!isMobile && (
          <Tippy
            placement="bottom"
            theme="pinkker"
            content={
              <h1
                style={{
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                  whiteSpace: "nowrap",
                }}
              >
                Regalar suscripciones a tu canal
              </h1>
            }
          >
            <button
              onClick={() => onMouseEnterGiftSub()}
              onMouseEnter={() => setHoverSubscriber(true)}
              onMouseLeave={() => setHoverSubscriber(false)}
              style={{ width: "155px", marginLeft: "5px" }}
              className="channel-bottom-v2-button-sub"
            >
              <i
                style={{ marginRight: "5px", whiteSpace: "nowrap" }}
                class={hoverSubscriber ? "fas fa-star" : "far fa-star"}
              />{" "}
              <span style={{ whiteSpace: "nowrap" }}>
                Regalar suscripciones
              </span>
            </button>
          </Tippy>
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
            onClick={() => handleMessage(streamer)}
            className="channel-bottom-v2-button-icon"
          >
            <i class="fas fa-envelope" />
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

        <Tippy
          theme="pinkker"
          content={
            <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
              Compartir
            </h1>
          }
        >
          <button
            onClick={() => onMouseEnterShare()}
            className="channel-bottom-v2-button-icon"
          >
            <i class="fas fa-share-alt" />
          </button>
        </Tippy>

        <Tippy
          theme="pinkker"
          content={
            <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
              Opciones
            </h1>
          }
        >
          <button className="channel-bottom-v2-button-icon">
            <i class="fas fa-ellipsis-v" />
          </button>
        </Tippy>
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
                {streamerData && streamerData.verified && (
                  <Emblem
                    name={"Verificado"}
                    img={
                      "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404309/Emblemas/VERIFICADO_rlbuwi.jpg"
                    }
                  />
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
                    {streamerData && Object.keys(streamerData.Followers).length}{" "}
                    seguidores
                  </a>{" "}
                  <a style={{ marginLeft: "10px", marginRight: "10px" }}>•</a>{" "}
                  <a onClick={() => togglePopupFollowers(1)}>
                    {streamerData && Object.keys(streamerData.Followers).length}{" "}
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
      return <Vod streamer={streamer} limit={4} sort={1} />;
    }

    if (type === 1) {
      return <Muro streamer={streamerData} limit={4} sort={1} />;
    }

    if (type === 2) {
      return <About streamer={streamerData} limit={4} sort={1} />;
    }

    if (type === 3) {
      return (
        <Gallery
          reloadGallery={() => reloadGallery()}
          unlocked={unlocked}
          gallerys={gallerys}
          streamer={streamer}
        />
      );
    }

    if (type === 4) {
      return <Clips streamer={streamer} />;
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

    return tyExpanded ? "760px" : "849px";
  }

  function renderPlayer() {
    return (
      <CustomPlayer
        dashboard={false}
        isMobile={isMobile}
        expanded={tyExpanded}
        height={getHeightPlayer()}
        marginLeft={tyExpanded ? "-17px" : "6px"}
        setViewInfoStream={setViewInfoStream}
        started={started}
        vod={false}
        streamer={streamer}
        time={stream && stream.start_date}
        streamerData={streamerData}
        stream={stream}
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
    return chatExpanded ? "100%" : "72.5%";
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
              }}
              className="channel-video"
            >
              <div className="conteiner-streamer-online-infoStream">
                {getBottomStream()}
                {stream.online ? (
                  <div
                    onMouseEnter={() => setViewInfoStream(true)}
                    onMouseLeave={() => setViewInfoStream(false)}
                    className="channel-custom-player-main-div"
                  >
                    {streamerData && announce === false && renderPlayer()}
                  </div>
                ) : (
                  <></>
                )}

                {renderAnnoucement()}
                {stream.online && getStream()}
              </div>

              <div
                style={{
                  width: "82%",
                  margin: "0px  0px 0px 0px",
                  zIndex: "1000",
                  marginTop: stream?.Online ? "" : "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: !tyExpanded ? "96.5%" : "95.5%",
                    marginLeft: !isMobile ? "1.4rem" : "1rem",
                    // margin: "0 auto",
                    borderTop: "1px solid #2a2e38",
                  }}
                  className="type-set"
                >
                  <div
                    onClick={() => changeType(1)}
                    className={type === 1 ? "type-card active" : "type-card"}
                  >
                    <h3>Muro</h3>
                  </div>
                  <div
                    onClick={() => changeType(3)}
                    className={type === 3 ? "type-card active" : "type-card"}
                  >
                    <h3>Galeria</h3>
                  </div>
                  <div
                    onClick={() => changeType(0)}
                    className={type === 0 ? "type-card active" : "type-card"}
                  >
                    <h3>Vods</h3>
                  </div>
                  <div
                    onClick={() => changeType(4)}
                    className={type === 4 ? "type-card active" : "type-card"}
                  >
                    <h3>Clips</h3>
                  </div>
                  <div
                    onClick={() => changeType(2)}
                    className={type === 2 ? "type-card active" : "type-card"}
                  >
                    <h3>Acerca de</h3>
                  </div>
                  {isMobile && (
                    <div
                      onClick={() => changeType(9)}
                      className={type === 9 ? "type-card active" : "type-card"}
                    >
                      <h3>chat</h3>
                    </div>
                  )}
                </div>

                <div style={{ width: "100%", margin: "0 auto" }}>
                  {streamerData && getType()}
                </div>

                <div
                  style={{
                    width: chatExpanded ? "100%" : "100%",
                    display: chatExpandedMobile ? "" : "none",
                  }}
                  className="channel-chat"
                >
                  {isMobile && (
                    <ChatStreaming
                      streamerChat={stream}
                      chatExpandeds={chatExpanded}
                      ToggleChat={handleToggleChatMobile}
                      streamerData={streamerData}
                      user={user}
                      isMobile={isMobile}
                      followParam={followParam}
                    />
                  )}
                </div>
              </div>
            </div>

            {!isMobile && (
              <div
                style={{ width: chatExpanded ? "0" : "26.4%" }}
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
                      ></CustomPlayer>
                    )}
                  </div>
                )}

                <ChatStreaming
                  streamerChat={stream}
                  chatExpandeds={chatExpanded}
                  ToggleChat={handleToggleChat}
                  streamerData={streamerData}
                  user={user}
                  isMobile={isMobile}
                  followParam={followParam}
                />
              </div>
            )}
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
      className={
        (!tyExpanded && !isMobile && "container-channel") ||
        (tyExpanded && !isMobile && "container-channel-expand") ||
        (isMobile && "container-channel-isMobile") ||
        ""
      }
    >
      {getChannel()}

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
