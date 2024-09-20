import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ChatStreaming.css";
import DonationCard from "../../../channel/chat/donation/card/DonationCard";
import { GetPixelesDonationsChat } from "../../../../services/backGo/donation";
import Donation from "../../../channel/chat/donation/card/Donation";
import { BsFillTrashFill, BsPin } from "react-icons/bs";
import { FaReply } from "react-icons/fa";
import {
  GetSubsAct,
  GetSubssChat,
  suscribirse,
} from "../../../../services/backGo/subs";
import Tippy from "@tippyjs/react";
import DropdownPoints from "../../../channel/chat/dropdown/points/DropdownPoints";
import {
  follow,
  getUserByNameUser,
  unfollow,
} from "../../../../services/backGo/user";
import {
  GetInfoUserInRoomFunc,
  HostChatMessage,
  actionsChatStream,
  actionsModeratorChatStream,
  anclarChatMessage,
  deleteChatMessage,
  desanclarChatMessage,
  RedisFindMatchingUsersInRoomByPrefix,
  getMessagesForSecond,
} from "../../../../services/backGo/chat";
import { useNotification } from "../../../Notifications/NotificationProvider";
export function ChatStreamingVods({
  openChatWindow,
  streamerChat,
  chatExpandeds,
  ToggleChat,
  streamerData,
  user,
  isMobile,
  DashboardStream = false,
  followParam,
  idVod,
  calculateCurrentTime,
}) {
  const [messages, setMessages] = useState([]);

  const displayMessagesWithDelay = (newMessages) => {
    let totalDelay = 0;

    newMessages.forEach((msg, index) => {
      if (index === 0) {
        // Mostrar el primer mensaje de la nueva lista inmediatamente
        setMessages((prevMessages) => [...prevMessages, msg]);
        scrollToBottom();
      } else {
        // Calcular el delay solo basado en los nuevos mensajessssss
        const currentTimestamp = new Date(newMessages[index].Timestamp);
        const previousTimestamp = new Date(newMessages[index - 1].Timestamp);
        const delay = currentTimestamp - previousTimestamp; // Diferencia en milisegundos

        // Acumularss el retraso total y utilizar setTimeout para agregar el mensaje al estado
        totalDelay += delay;

        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, msg]);
          scrollToBottom(); // Asegura que siempre haga scroll al nuevo mensaje
        }, totalDelay);
      }
    });
  };

  const GetMessages = async () => {
    try {
      const startTime = new Date(calculateCurrentTime).toISOString();
      const res = await getMessagesForSecond(idVod, startTime);

      if (res.messages) displayMessagesWithDelay(res.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    GetMessages();
  }, [calculateCurrentTime]);

  const conversationRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [socketDeleteMsj, setsocketDeleteMsj] = useState(null);
  const pingIntervalRef = useRef(null);
  const [donations, setDonations] = useState(null);
  const [donationsSubscriptions, setDonationsSubscriptions] = useState(null);
  const [donationCard, setDonationCard] = useState(false);
  const [dropdownPoints, setDropdownPoints] = useState(false);
  const [GetUserTheChat, setGetUserTheChat] = useState(null);
  const [ShowGetUserTheChat, setShowGetUserTheChat] = useState(false);
  const [GetInfoUserInRoom, setGetInfoUserInRoom] = useState(null);
  const [StateDonations, setStateDonations] = useState(false);
  const [MsjChatAnclado, SetMsjChatAnclado] = useState(null);
  const [NewHost, SetNewHost] = useState(null);

  const [ModSlowMode, SetModSlowMode] = useState("");
  const [ModChat, SetModChat] = useState("");

  const hostTimeoutRef = useRef(null);
  const alert = useNotification();
  const history = useHistory();

  const token = window.localStorage.getItem("token");

  const [dropdownChatConfig, setDropdownChatConfig] = useState(false);
  const onMouseEnterChatConfig = () => {
    setDropdownChatConfig(!dropdownChatConfig);
  };

  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  };

  const gets = async () => {
    try {
      const resDonations = await GetPixelesDonationsChat(streamerData.id);
      if (resDonations.message === "ok" && resDonations.data.length > 0) {
        setDonations(resDonations.data);
      } else {
        setDonations([]);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const resSubs = await GetSubssChat(streamerData.id);
      if (resSubs.message == "ok" && resSubs.data.length > 0) {
        setDonationsSubscriptions(resSubs.data);
      } else {
        setDonationsSubscriptions([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const setGetInfoUserInRoomAsync = async () => {
      const token = window.localStorage.getItem("token");
      if (token) {
        const res = await GetInfoUserInRoomFunc(streamerChat.id, token);
        if (res?.message == "ok") {
          const roomWithId = res?.data.Rooms.find(
            (room) => room.Room === streamerChat.id
          );
          setGetInfoUserInRoom(roomWithId);
        }
      }
    };
    setGetInfoUserInRoomAsync();
    gets();
  }, []);

  const onMouseEnterPoints = () => {
    if (dropdownPoints === true) {
      setDropdownPoints(false);
    } else {
      setDropdownPoints(true);
    }
  };

  const [donationAmount, setDonationAmount] = useState(0);
  const [donationName, setDonationName] = useState(null);
  const [donationAvatar, setDonationAvatar] = useState(null);
  const [donationText, setDonationText] = useState(null);
  const [donationLook, setDonationLook] = useState(null);
  const [donationColor, setDonationColor] = useState(null);
  const [donationCardVisible, setDonationCardVisible] = useState(false);

  function toggleDonationCard(amount, name, avatar, text, look, color) {
    setDonationCard((prevDonationCard) => !prevDonationCard);
    setDonationAmount(amount);
    setDonationName(name);
    setDonationAvatar(avatar);
    setDonationText(text);
    setDonationLook(look);
    setDonationColor(color);
  }

  const [showAllDonations, setShowAllDonations] = useState(false);
  const [showAllSubs, setShowAllSubs] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [allDonationsExpanded, setAllDonationsExpanded] = useState(false);
  const [movil, setMovil] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMovil(true);
    } else {
      setMovil(false);
    }
  }, []);
  const deleteMessageschat = (msj) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("no logueado");
      return;
    }
    const res = deleteChatMessage(streamerChat.id, msj.Id, token);
  };
  const anclarMessageschat = async (msj) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("no logueado");
      return;
    }
    const res = await anclarChatMessage(streamerChat.id, msj, token);
  };
  const HostChatMessageFunc = async (msj) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("no logueado");
      return;
    }
    await HostChatMessage(streamerChat.id, msj, token);
  };

  const [ResMessageschatState, setResMessageschat] = useState(null);
  const ResMessageschat = (msj) => {
    setResMessageschat(msj);
  };

  const desanclarMessageschat = (msj) => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("no logueado");
      return;
    }
    desanclarChatMessage(streamerChat.id, msj.Id, token);
  };

  const getDonationSubscriptionCard = (donationsSubscriptions) => {
    return (
      <div
        style={{
          width: "100%",
        }}
      >
        {donationsSubscriptions
          .slice(0, showAllSubs ? undefined : 1)
          .map((subscription, index) => (
            <div
              key={index}
              onClick={() => setShowAllSubs(!showAllSubs)}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#534bb3",
                padding: "5px",
                margin: "6px",
                paddingLeft: "5px",
                // paddingRight: "2px",
                borderRadius: "10px",
                height: "20px",
                cursor: index === 0 ? "pointer" : "default",
              }}
            >
              <img
                style={{ width: "19px", paddingLeft: "2px" }}
                src="https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/REGALO-DE-SUBS_jfomvu.jpg"
              />
              <div
                style={{
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    lineHeight: "10px",
                    fontSize: "14px",
                    fontWeight: "800",
                  }}
                >
                  {subscription.FromUserInfo.NameUser}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: "violet",
                    marginLeft: "5px",
                  }}
                >
                  {subscription.amount}
                </p>
              </div>
            </div>
          ))}

        {showAllSubs && donationsSubscriptions.length >= 1 && (
          <button
            style={{ width: "97%", marginLeft: "5px" }}
            onClick={() => setShowAllSubs(false)}
          ></button>
        )}
      </div>
    );
  };
  function getDonation() {
    const displayDonations = showAllDonations
      ? donations
      : [donations[donations.length - 1]];
    return (
      <div className="chat-donation-body">
        <i
          style={{
            color: "#ffff",
            cursor: "pointer",
            margin: "0",
            display: chatExpandeds ? "none" : "",
            padding: "0px 11px",
          }}
          className="fas fa-chevron-left"
          onClick={() => setStateDonations(!StateDonations)}
        ></i>
        <div
          className={
            !showAllSubs
              ? "getDonationSubscriptionCard"
              : "getDonationSubscriptionCardshowAllSubs"
          }
          style={{
            display: StateDonations === false ? "flex" : "none ",
            justifyContent: "center",
          }}
        >
          {donationsSubscriptions.length >= 1
            ? getDonationSubscriptionCard(donationsSubscriptions)
            : !chatExpandeds && (
                <h3
                  style={{
                    color: "#f36196",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  // onClick={() => {
                  //   onMouseEnterPoints();
                  // }}
                >
                  Regalá una suscripción
                </h3>
              )}
        </div>
        <div
          className={
            allDonationsExpanded
              ? "chat-donation-containerStateDonations"
              : "chat-donation-container"
          }
          style={{
            display: StateDonations === true ? "flex" : "none ",
          }}
        >
          <div
            className="chat-donation-card-container"
            style={{
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
              display: showAllSubs && "none",
            }}
          >
            {displayDonations[0] !== undefined
              ? [...displayDonations].map((donation, index) => (
                  <Donation
                    key={index}
                    donation={donation}
                    index={index}
                    callback={() => {
                      toggleDonationCard(
                        donation?.Pixeles,
                        donation?.FromUserInfo.NameUser,
                        donation?.FromUserInfo.Avatar,
                        donation?.Text,
                        donation?.userLook,
                        donation?.userColor
                      );
                      setShowAllDonations(true);
                      setDonationCardVisible(donationCardVisible);

                      setClickCount((prevCount) => prevCount + 1);

                      if (clickCount >= 1) {
                        setFirstClick(true);
                      }

                      setAllDonationsExpanded(true);
                    }}
                    ShowAllDonations={setShowAllDonations}
                  />
                ))
              : !chatExpandeds && (
                  <h3
                    style={{
                      color: "#f36196",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      onMouseEnterPoints();
                    }}
                  >
                    Envia pixeles
                  </h3>
                )}
          </div>
          <button
            style={{
              width: "100%",
              marginLeft: "",
              display: !allDonationsExpanded && "none",
            }}
            onClick={() => {
              setShowAllDonations(false);
              setDonationCardVisible(donationCardVisible);
              setClickCount(0);
              setAllDonationsExpanded(false);
              setFirstClick(false);
            }}
          ></button>
        </div>
        <i
          style={{
            color: "#ffff",
            cursor: "pointer",
            margin: "0",
            display: chatExpandeds ? "none" : "",
            padding: "0px 11px",
          }}
          className="fas fa-chevron-right"
          onClick={() => setStateDonations(!StateDonations)}
        ></i>
      </div>
    );
  }

  const [firstClick, setFirstClick] = useState(false);

  const [Modolento, setModolento] = useState(null);

  const isSubscriptor = (message) => {
    const currentTimestamp = Date.now();
    const subscriptionEndTimestamp = Date.parse(
      message?.SubscriptionInfo?.SubscriptionEnd
    );

    if (subscriptionEndTimestamp <= 0 || isNaN(subscriptionEndTimestamp)) {
      return null;
    }

    if (subscriptionEndTimestamp < currentTimestamp) {
      return null;
    } else {
      return "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404309/Emblemas/SUBSCRIPTOR.jpg_pxzloq.png";
    }
  };

  const [secondsRemaining, setSecondsRemaining] = useState(-1);

  const countdownSeconds = () => {
    if (user?.id === streamerData?.id) {
      return 0;
    }
    const difference = (Modolento - new Date()) / 1000;

    return Math.max(0, Math.floor(difference));
  };

  useEffect(() => {
    if (Modolento) {
      setSecondsRemaining(countdownSeconds());
      const interval = setInterval(() => {
        setSecondsRemaining(countdownSeconds());

        if (countdownSeconds() <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [Modolento]);
  useEffect(() => {
    if (secondsRemaining !== -1) {
      const currentDate = new Date();
      const newDate = new Date(currentDate.getTime() + ModSlowMode * 1000);
      setModolento(newDate);
    }
  }, [ModSlowMode]);
  const [GetUserTheChatFollowing, setGetUserTheChatFollowing] = useState(false);
  const [InfoUserChatSelect, setInfoUserChatSelect] = useState({});
  const [followingFrom, setFollowingFrom] = useState(null);
  const [changeTextSizeState, setchangeTextSize] = useState("12px");
  useEffect(() => {
    const chatTextSize = localStorage.getItem("chatTextSize");
    if (changeTextSize != null) {
      changeTextSize(chatTextSize);
    }
  }, []);

  const GetUserTheChatFunc = async (message) => {
    setInfoUserChatSelect(message);
    const res = await getUserByNameUser(message.nameUser);
    if (res.message == "ok") {
      setGetUserTheChat(res.data);

      setShowGetUserTheChat(true);
      if (user?.Following.hasOwnProperty(res?.data.id)) {
        setFollowingFrom(res.data?.Following[`${res.data.id}`]?.since);
        setGetUserTheChatFollowing(true);
      }
    }
  };

  const GetUserTheChatFuncfollow = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      if (GetUserTheChatFollowing) {
        await unfollow(token, GetUserTheChat?.id);
        setGetUserTheChatFollowing(false);
        alert({ type: "SUCCESS", message: "unfollow" });
      } else {
        await follow(token, GetUserTheChat?.id);
        setGetUserTheChatFollowing(true);
        alert({ type: "SUCCESS", message: "follow" });
      }
    }
  };
  const GiftsubscriptionTheChat = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const res = await suscribirse(token, GetUserTheChat?.id);
      if (res?.data?.message === "ok") {
        alert({ type: "SUCCESS" });
      } else {
        alert({
          type: "ERROR",
          message: res?.data?.message,
        });
      }
    }
  };
  const changeTextSize = async (e) => {
    if (e == 0) {
      setchangeTextSize("12px");
      return;
    } else if (e == 1) {
      setchangeTextSize("13px");
      return;
    } else if (e == 2) {
      setchangeTextSize("16px");
    } else if (e == 3) {
      setchangeTextSize("18px");
    }
  };
  const ModeratorUserChat = async (action, actionAgainst, timeOut, room) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const res = await actionsModeratorChatStream(
          action,
          actionAgainst,
          timeOut,
          room,
          token
        );
        alert({ type: "SUCCESS" });
      } catch (error) {
        alert({ type: "ERROR" });
      }
    }
  };
  const ModeratorUserChatStreamer = async (
    room,
    action,
    actionAgainst,
    timeOut
  ) => {
    const token = window.localStorage.getItem("token");
    try {
      if (token) {
        const res = await actionsChatStream(
          action,
          actionAgainst,
          timeOut,
          token,
          room
        );
      }
      alert({ type: "SUCCESS" });
    } catch (error) {
      alert({ type: "ERROR" });
    }
  };
  function parseMessage(message) {
    const urlRegex = /(https?:\/\/\S+)/g;
    const imgRegex = /<img.*?src=['"](.*?)['"].*?>/g;
    const mentionRegex = /@(\w+)/g;

    const content = message.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        if (part.includes("res.cloudinary.com/depcty8j1/")) {
          const decodedUrl = decodeURIComponent(part);
          const cutoffIndex = decodedUrl.indexOf("&");
          const imageUrl =
            cutoffIndex !== -1
              ? decodedUrl.substring(0, cutoffIndex)
              : decodedUrl;

          return (
            <img
              key={index}
              src={imageUrl}
              style={{ width: "20px", height: "auto" }}
              alt="Image"
            />
          );
        } else {
          // Si no es una URL de res.cloudinary.com/depcty8j1/, devolvemos un enlace
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              style={{
                color: "inherit",
                textDecoration: "inherit",
                borderBottom: "1px solid #ffff",
                padding: "0px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
      } else if (part.match(imgRegex)) {
        return part.replace(imgRegex, (match, src) => {
          if (src.includes("res.cloudinary.com/depcty8j1/")) {
            // Si el src coincide con res.cloudinary.com/depcty8j1/, reemplazamos la etiqueta img con un párrafo
            return `${match}`;
          } else {
            // Si el src no coincide con res.cloudinary.com/depcty8j1/, devolvemos la etiqueta img original
            return match;
          }
        });
      }
      // Si no es ni una URL ni una etiqueta img, simplemente devolvemos el texto
      return part;
    });

    // Comprobar menciones
    let isMentioned = false;
    let mentionMatch;
    while ((mentionMatch = mentionRegex.exec(message)) !== null) {
      const mentionedUser = mentionMatch[1];
      if (mentionedUser === user?.NameUser) {
        isMentioned = true;
        break;
      }
    }

    // Devolvemos el objeto con el contenido como array y la mención
    return {
      content: content, // Mantiene el array de partes (texto y componentes)
      isMentioned: isMentioned,
    };
  }

  return (
    <div
      className="ChatStreaming"
      style={{
        maxWidth: DashboardStream ? "40vh" : "",
        height: DashboardStream ? "100%" : "",
        position: DashboardStream && "relative",
      }}
    >
      <div className="info_chat_extra">
        <div
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {chatExpandeds == true && !isMobile && !DashboardStream && (
            <img
              onClick={ToggleChat}
              style={{
                width: "1%",
                cursor: "pointer",
                textAlign: "center",
                color: "white",
                position: "fixed",
                right: "1%",
                transform: "rotate(180deg)",
                zIndex: "99999",
              }}
              className="chat-button-more"
              src="/images/iconos/contraer.png"
            />
          )}
          {chatExpandeds == false && !isMobile && (
            <img
              onClick={ToggleChat}
              style={{
                width: "12px",
                cursor: "pointer",
                textAlign: "center",
                color: "white",

                zIndex: "99999",
              }}
              className="chat-button-more"
              src="/images/iconos/contraer.png"
            />
          )}
          {isMobile && (
            <img
              onClick={ToggleChat}
              style={{
                width: "12px",
                cursor: "pointer",
                textAlign: "center",
                color: "white",
                zIndex: "99999",
              }}
              className="chat-button-more"
              src="/images/iconos/contraer.png"
            />
          )}
          <h4
            style={{
              fontSize: "17px",
              fontWeight: "bolder",

              textAlign: "center",
              letterSpacing: "0.5px",
              color: "#ffff",
              position: "relative",
              right: chatExpandeds ? "-20%" : "",
              right: chatExpandeds ? "0%" : "",
              display: DashboardStream ? "" : chatExpandeds && "none",
            }}
          >
            Chat
          </h4>
          <div>
            <br></br>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#2a2e38",
            marginTop: "19px auto",
          }}
        />

        {/* <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#2a2e38",
            marginTop: "19px auto",
          }}
        /> */}
        {donations && donationsSubscriptions && getDonation()}
        {showAllDonations && firstClick && donationCard && (
          <DonationCard
            donationColor={donationColor}
            donationAmount={donationAmount}
            donationName={donationName}
            donationAvatar={donationAvatar}
            donationText={donationText}
            donationLook={donationLook}
            close={() => setDonationCard(false)}
            donationCard={donationCard}
          />
        )}

        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "#2b2b2b3f",
            marginTop: "19px auto",
          }}
        />
        <div
          style={{
            width: "100%",
            background: "#24272c",
          }}
        >
          {MsjChatAnclado != null && (
            <div
              key={MsjChatAnclado.Id}
              className="Message"
              onClick={() => GetUserTheChatFunc(MsjChatAnclado)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div className="badges">
                {MsjChatAnclado.Identidad && (
                  <img src={MsjChatAnclado.Identidad} alt="" />
                )}
                {MsjChatAnclado.EmotesChat?.Moderator && (
                  <img src={MsjChatAnclado.EmotesChat?.Moderator} alt="" />
                )}
                {MsjChatAnclado.EmotesChat?.Verified && (
                  <img src={MsjChatAnclado.EmotesChat?.Verified} alt="" />
                )}
                {MsjChatAnclado.EmotesChat?.Vip && (
                  <img src={MsjChatAnclado.EmotesChat?.Vip} alt="" />
                )}
                {isSubscriptor(MsjChatAnclado) && (
                  <img src={isSubscriptor(MsjChatAnclado)} alt="" />
                )}
                {MsjChatAnclado?.StreamerChannelOwner && (
                  <img
                    src={
                      "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/OWNER_ixhnvh.jpg "
                    }
                    alt="StreamerChannelOwner"
                  />
                )}
              </div>
              <div className="MessagesChat">
                <div className="content-info-message">
                  <div className="content-info-message-2">
                    <p
                      className="content-info-message-2-nameUser"
                      style={{ color: MsjChatAnclado.Color }}
                    >
                      <span className="content-info-message-2-nameUser-span">
                        {MsjChatAnclado.nameUser}:{" "}
                      </span>
                      <span style={{ color: "#ffff" }}>
                        {parseMessage(MsjChatAnclado.message).content}
                      </span>
                    </p>
                  </div>
                </div>
                {GetInfoUserInRoom &&
                  (GetInfoUserInRoom.Moderator ||
                    streamerChat.streamerId ==
                      window.localStorage.getItem("_id")) && (
                    <div
                      className="hover-button"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          desanclarMessageschat(MsjChatAnclado);
                        }}
                        className="hover-btn"
                      >
                        <BsFillTrashFill />
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}
          {NewHost != null && (
            <div className="Host">
              <div className="HostChat">
                <div className="contentHostInfo">
                  <div className="contentHostInfo-spans">
                    <span
                      style={{
                        color: "#ffff",
                      }}
                    >
                      host de
                      {" " + NewHost?.HostBy}
                    </span>{" "}
                    <span
                      style={{
                        color: "#ffff",
                      }}
                    >
                      con
                      {" " + NewHost?.spectators} espectadores
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className="Conversation"
        ref={conversationRef}
        style={{
          maxHeight: "100%",
        }}
      >
        {ShowGetUserTheChat && GetUserTheChat && (
          <div className="ShowGetUserTheChat">
            <div className="ShowGetUserTheChat-InfoUser">
              <Link to={"/" + GetUserTheChat?.NameUser}>
                <img src={GetUserTheChat?.Avatar} alt="" />
              </Link>
              <div className="ShowGetUserTheChat-InfoUser-gsd">
                <Link to={"/" + GetUserTheChat?.NameUser}>
                  <span
                    style={{
                      fontFamily: "inter",
                      fontSize: "0.875rem",
                      lineHeight: "1.25rem",
                      fontWeight: "700",
                    }}
                  >
                    {GetUserTheChat?.NameUser}
                  </span>
                </Link>
                {GetUserTheChatFollowing && (
                  <div className="followingFrom">
                    <span
                      style={{
                        fontFamily: "inter",
                        fontSize: "0.675rem",
                        lineHeight: "1.25rem",
                        fontWeight: "700",
                      }}
                    >
                      Siguido desde
                    </span>
                    <span
                      style={{
                        fontFamily: "inter",
                        fontSize: "0.875rem",
                        lineHeight: "1.25rem",
                        fontWeight: "700",
                      }}
                    >
                      {followingFrom && (
                        <p>{new Date(followingFrom).toLocaleDateString()}</p>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <span
                className="ShowGetUserTheChat-InfoUser-gsd-x"
                onClick={() => setShowGetUserTheChat(false)}
              >
                <i
                  style={{ cursor: "pointer", color: "#ffff" }}
                  class="fas fa-times"
                />
              </span>
            </div>
            <div className="ShowGetUserTheChat-actions">
              <span
                style={{
                  marginLeft: "0px",
                }}
                className="ShowGetUserTheChat-actions-seguir"
                onClick={() => {
                  GetUserTheChatFuncfollow();
                }}
              >
                {GetUserTheChatFollowing ? "dejar de seguir" : "seguir"}
              </span>
              {GetUserTheChat.id !== window.localStorage.getItem("_id") && (
                <div
                  onClick={() => GiftsubscriptionTheChat()}
                  className="ShowGetUserTheChat-actions-suscripción"
                >
                  <img
                    style={{ width: "19px", paddingLeft: "2px" }}
                    src="https://static.twitchcdn.net/assets/GiftBadge-Gold_72-6e5e65687a6ca6959e08.png"
                  />
                  <span>Regalar una suscripción</span>
                </div>
              )}
            </div>
            {GetInfoUserInRoom &&
            GetInfoUserInRoom.Moderator &&
            streamerChat.streamerId !== window.localStorage.getItem("_id") ? (
              <div className="ShowGetUserTheChat-actions-Moderator">
                <div
                  onClick={() =>
                    ModeratorUserChat(
                      "baneado",
                      GetUserTheChat.NameUser,
                      0,
                      streamerChat.id
                    )
                  }
                  className="ShowGetUserTheChat-actions-Moderator-banear"
                >
                  <span>banear</span>
                </div>
                <div
                  onClick={() =>
                    ModeratorUserChat(
                      "timeOut",
                      GetUserTheChat.NameUser,
                      10,
                      streamerChat.id
                    )
                  }
                  className="ShowGetUserTheChat-actions-Moderator-TimeOut"
                >
                  <span>TimeOut</span>
                </div>
              </div>
            ) : (
              <></>
            )}
            {streamerChat.streamerId === window.localStorage.getItem("_id") ? (
              <div className="ShowGetUserTheChat-actions-Moderator">
                <div
                  onClick={() =>
                    ModeratorUserChatStreamer(
                      streamerChat.id,
                      "baneado",
                      GetUserTheChat.NameUser,
                      0
                    )
                  }
                  className="ShowGetUserTheChat-actions-Moderator-banear"
                >
                  <span>banear</span>
                </div>
                <div
                  onClick={() =>
                    ModeratorUserChatStreamer(
                      streamerChat.id,
                      "timeOut",
                      GetUserTheChat.NameUser,
                      10
                    )
                  }
                  className="ShowGetUserTheChat-actions-Moderator-TimeOut"
                >
                  <span>TimeOut</span>
                </div>
                {!InfoUserChatSelect?.vip ? (
                  <div
                    onClick={() =>
                      ModeratorUserChatStreamer(
                        streamerChat.id,
                        "vip",
                        GetUserTheChat.NameUser,
                        0
                      )
                    }
                    className="ShowGetUserTheChat-actions-Moderator-vip"
                  >
                    <span>vip</span>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      ModeratorUserChatStreamer(
                        streamerChat.id,
                        "rVip",
                        GetUserTheChat.NameUser,
                        0
                      )
                    }
                    className="ShowGetUserTheChat-actions-Moderator-vip"
                  >
                    <span>sacar vip</span>
                  </div>
                )}

                {!InfoUserChatSelect?.moderator ? (
                  <div
                    onClick={() =>
                      ModeratorUserChatStreamer(
                        streamerChat.id,
                        "moderator",
                        GetUserTheChat.NameUser,
                        0
                      )
                    }
                    className="ShowGetUserTheChat-actions-Moderator-vip"
                  >
                    <span>moderator</span>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      ModeratorUserChatStreamer(
                        streamerChat.id,
                        "rModerator",
                        GetUserTheChat.NameUser,
                        0
                      )
                    }
                    className="ShowGetUserTheChat-actions-Moderator-vip"
                  >
                    <span>sacar Mod</span>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}

        {messages?.map((message, index) => {
          return message.action ? (
            <div className="donacion-chat-message-Ite">
              {message.action === "DonatePixels" ? (
                <>
                  <div className="donacion-header">
                    <span className="donacion-user">{message.data}</span>
                    {/* <span className="donacion-action">ha donado</span> */}
                    <span className="donacion-amount">
                      {message.Pixeles > 1000
                        ? `${(message.Pixeles / 1000).toFixed(1)}k`
                        : message.Pixeles}{" "}
                      píxeles
                    </span>
                  </div>
                  <div className="donacion-text">
                    <span>{message.text}</span>
                  </div>
                </>
              ) : (
                message.action === "Suscribirse" && (
                  <div className="suscripcion-header">
                    <span className="suscripcion-user">{message.data}</span>
                    <span className="suscripcion-action">
                      ha realizado una suscripción
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <div
              key={index}
              className="Message"
              onClick={() => GetUserTheChatFunc(message)}
              style={{
                cursor: "pointer",
                border:
                  parseMessage(message.message).isMentioned &&
                  "1px solid #ff69c4",
              }}
            >
              {message.ResMessage != "" && (
                <div className="ResMessage">
                  <FaReply className="grey-icon" />
                  <span> Respondio </span>
                  <span> @{message.ResNameUser}:</span>
                  <span>{parseMessage(message.ResMessage).content}</span>
                </div>
              )}
              <div className="ChatStreaming-message-main">
                <div className="badges">
                  {message.Identidad && <img src={message.Identidad} alt="" />}
                  {message.EmotesChat.Moderator && (
                    <img src={message.EmotesChat.Moderator} alt="" />
                  )}
                  {message.EmotesChat.Verified && (
                    <img src={message.EmotesChat.Verified} alt="" />
                  )}
                  {message.EmotesChat.Vip && (
                    <img src={message.EmotesChat.Vip} alt="" />
                  )}
                  {isSubscriptor(message) && (
                    <img src={isSubscriptor(message)} alt="" />
                  )}
                  {message?.StreamerChannelOwner && (
                    <img
                      src={
                        "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/OWNER_ixhnvh.jpg "
                      }
                      alt="StreamerChannelOwner"
                    />
                  )}
                </div>
                <div className="MessagesChat">
                  <div className="content-info-message">
                    <div className="content-info-message-2">
                      <p
                        className="content-info-message-2-nameUser"
                        style={{
                          color: message.Color,
                          fontSize: changeTextSizeState,
                        }}
                      >
                        <span className="content-info-message-2-nameUser-span">
                          {message.nameUser}:{" "}
                        </span>
                        <span
                          style={{
                            color: "#ffff",
                          }}
                        >
                          {parseMessage(message.message).content}
                        </span>
                      </p>
                    </div>
                  </div>
                  {GetInfoUserInRoom &&
                  (GetInfoUserInRoom.Moderator ||
                    streamerChat.streamerId ==
                      window.localStorage.getItem("_id")) ? (
                    <div
                      className="hover-button"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessageschat(message);
                        }}
                        className="hover-btn"
                      >
                        <BsFillTrashFill />
                      </button>{" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          anclarMessageschat(message);
                        }}
                        className="hover-btn"
                      >
                        <BsPin />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ResMessageschat(message);
                        }}
                        className="hover-btn"
                      >
                        <FaReply />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="hover-button"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          ResMessageschat(message);
                        }}
                        className="hover-btn"
                      >
                        <FaReply />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
