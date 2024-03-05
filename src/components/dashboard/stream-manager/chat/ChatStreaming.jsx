import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ChatStreaming.css";
import DonationCard from "../../../channel/chat/donation/card/DonationCard";
import { GetPixelesDonationsChat } from "../../../../services/backGo/donation";
import Donation from "../../../channel/chat/donation/card/Donation";
import { GetSubssChat, suscribirse } from "../../../../services/backGo/subs";
import Tippy from "@tippyjs/react";
import DropdownPoints from "../../../channel/chat/dropdown/points/DropdownPoints";
import {
  follow,
  getUserByNameUser,
  unfollow,
} from "../../../../services/backGo/user";
import { getStreamerDonationSubscription } from "../../../../services/donationSubscription";
import {
  GetInfoUserInRoomFunc,
  actionsChatStream,
  actionsModeratorChatStream,
} from "../../../../services/backGo/chat";
import { useNotification } from "../../../Notifications/NotificationProvider";
export function ChatStreaming({
  streamerChat,
  chatExpandeds,
  ToggleChat,
  streamerData,
  user,
  isMobile,
  DashboardStream = false,
}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const conversationRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [donations, setDonations] = useState(null);
  const [donationsSubscriptions, setDonationsSubscriptions] = useState(null);
  const [donationCard, setDonationCard] = useState(false);
  const [incrementPoints, setIncrementPoints] = useState(false);
  const [points, setPoints] = useState(0);
  const [incrementPoints2, setIncrementPoints2] = useState(false);
  const [dropdownPoints, setDropdownPoints] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [GetUserTheChat, setGetUserTheChat] = useState(null);
  const [ShowGetUserTheChat, setShowGetUserTheChat] = useState(false);
  const [GetInfoUserInRoom, setGetInfoUserInRoom] = useState(null);
  const [StateDonations, setStateDonations] = useState(false);
  const alert = useNotification();
  const history = useHistory();
  useEffect(() => {
    if (isMobile) {
      ToggleChat(false);
    }
    const token = window.localStorage.getItem("token");
    const REACT_APP_BACKCHATWS = process.env.REACT_APP_BACKCHATWS;
    const newSocket = new WebSocket(
      `${REACT_APP_BACKCHATWS}/ws/chatStreaming/${streamerChat.id}/${token}`
    );
    const connectWebSocket = () => {
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      newSocket.onmessage = (event) => {
        try {
          const receivedMessage = JSON.parse(event.data);
          newSocket.send("onmessage");
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          scrollToBottom();
        } catch (error) {
          console.error("Error al analizar el mensaje JSON:", error);
        }
      };

      newSocket.onclose = () => {
        newSocket.send("closing");
      };

      newSocket.onopen = () => {};
      setSocket(newSocket);

      window.addEventListener("beforeunload", () => {
        newSocket.send("closing");
        newSocket.close();
      });
    };

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }
    return () => {
      // window.addEventListener("beforeunload", () => {
      //   newSocket.send("closing");
      //   newSocket.close();
      // });
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [history]);
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
    };
  }, [socket]);

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

    const intervalId = setInterval(() => {
      gets();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
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
                      setSelectedDonation(donation);

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
          }}
          className="fas fa-chevron-right"
          onClick={() => setStateDonations(!StateDonations)}
        ></i>
      </div>
    );
  }

  const [firstClick, setFirstClick] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = async () => {
    setMessage("");

    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        alert("no logueado");
        return;
      }
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const REACT_APP_BACKCHAT = process.env.REACT_APP_BACKCHAT;
      const res = await axios.post(
        `${REACT_APP_BACKCHAT}/chatStreaming/${streamerChat.id}`,
        { message },
        config
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const isSubscriptor = (message) => {
    const currentTimestamp = Date.now();
    const subscriptionEndTimestamp = Date.parse(
      message.SubscriptionInfo.SubscriptionEnd
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

  const [GetUserTheChatFollowing, setGetUserTheChatFollowing] = useState(false);
  const [InfoUserChatSelect, setInfoUserChatSelect] = useState({});
  const GetUserTheChatFunc = async (message) => {
    setInfoUserChatSelect(message);
    console.log(message);
    const res = await getUserByNameUser(message.nameUser);
    if (res.message == "ok") {
      setGetUserTheChat(res.data);
      setShowGetUserTheChat(true);
      if (user?.Following.hasOwnProperty(res?.data.id)) {
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
  return (
    <div
      className="ChatStreaming"
      style={{
        maxWidth: DashboardStream ? "51vh" : "",
        height: DashboardStream ? "90%" : "",
      }}
    >
      {chatExpandeds == true && !isMobile && !DashboardStream && (
        <img
          onClick={ToggleChat}
          style={{
            width: "12px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            position: "fixed",
            right: "10px",
            top: "66px",
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
            position: "fixed",
            right: "24%",
            top: "66px",
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
            position: "fixed",
            // right: "24%",
            top: "80px",
            right: "20px",
            zIndex: "99999",
          }}
          className="chat-button-more"
          src="/images/iconos/contraer.png"
        />
      )}
      <div className="info_chat_extra">
        <div style={{ height: "40px", display: "flex", alignItems: "center" }}>
          <h4
            style={{
              fontSize: "12px",
              width: "290px",
              textAlign: "center",
              letterSpacing: "0.5px",
              color: "#ffff",
              position: "relative",
              right: chatExpandeds ? "-20%" : "",
              right: chatExpandeds ? "0%" : "",
            }}
          >
            CHAT DEL DIRECTO
          </h4>
        </div>

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
            height: "1px",
            backgroundColor: "#2b2b2b3f",
            marginTop: "19px auto",
          }}
        />
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
      </div>
      <div className="Conversation" ref={conversationRef}>
        {ShowGetUserTheChat && GetUserTheChat && (
          <div className="ShowGetUserTheChat">
            <div className="ShowGetUserTheChat-InfoUser">
              <Link to={"/" + GetUserTheChat?.NameUser}>
                <img src={GetUserTheChat?.Avatar} alt="" />
              </Link>
              <div className="ShowGetUserTheChat-InfoUser-gsd">
                <Link to={"/" + GetUserTheChat?.NameUser}>
                  <span>{GetUserTheChat?.NameUser}</span>
                </Link>
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
                    <span>quitar Moderator</span>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className="Message"
            onClick={() => GetUserTheChatFunc(message)}
            style={{ cursor: "pointer" }}
          >
            <div className="MessagesChat">
              <div className="badges">
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
              </div>
              <div className="content-info-message">
                <div className="content-info-message-2">
                  <p
                    className="content-info-message-2-nameUser"
                    style={{
                      color: message.Color,
                    }}
                  >
                    {message.nameUser}:
                    <span style={{ color: "#ffff" }}>
                      {" " + message.message}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="actions-chat-conteiner">
        <form className="ChatStreaming_form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            placeholder="Enviar un mensaje"
            onChange={handleChange}
          />
        </form>
        <div className="actions-chat">
          <button
            onClick={() => onMouseEnterPoints()}
            className="button-points gray-button"
          >
            <img
              style={{ width: false ? "30px" : "16px" }}
              src="/images/pixel.png"
              alt=""
            />
            <h3
              style={{
                fontFamily: "Poppins",
                minWidth: "15px",
                marginLeft: "3px",
                fontSize: false ? "24px" : "13px",
              }}
            >
              {user?.Pixeles}
            </h3>
            {incrementPoints === true && (
              <p className="text-points-increment">+{points}</p>
            )}
            {incrementPoints2 === true && (
              <Tippy
                placement="bottom"
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Has ganado {points} pixels
                  </h1>
                }
              >
                <p className="text-points-increment2">+{points}</p>
              </Tippy>
            )}
          </button>
          <button onClick={handleSubmit} type="submit">
            Enviar
          </button>
          <div style={{ zIndex: "100000000000" }}>
            {dropdownPoints && (
              <DropdownPoints
                streamer={streamerData}
                closeNavbar={() => setDropdownPoints(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
