import React, { useState, useEffect, useRef } from "react";
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

export function ChatStreaming({
  OnechatId,
  chatExpandeds,
  ToggleChat,
  streamerData,
  user,
}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const conversationRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [donations, setDonations] = useState([]);
  const [donationsSubscriptions, setDonationsSubscriptions] = useState(null);
  const [donationCard, setDonationCard] = useState(false);
  const [incrementPoints, setIncrementPoints] = useState(false);
  const [points, setPoints] = useState(0);
  const [incrementPoints2, setIncrementPoints2] = useState(false);
  const [dropdownPoints, setDropdownPoints] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [GetUserTheChat, setGetUserTheChat] = useState(null);
  const [ShowGetUserTheChat, setShowGetUserTheChat] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      const token = window.localStorage.getItem("token");
      const newSocket = new WebSocket(
        `ws://localhost:8081/ws/chatStreaming/${OnechatId}/${token}`
      );
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      newSocket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        newSocket.send("onmessage");
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        console.log(receivedMessage);
        scrollToBottom();
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
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  };

  const gets = async () => {
    try {
      const resDonations = await GetPixelesDonationsChat(streamerData.id);
      if (resDonations.message === "ok" && resDonations.data.length > 0) {
        console.log(resDonations);
        setDonations(resDonations.data);
      } else {
        setDonations([]);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const resSubs = await GetSubssChat(streamerData.id);
      if (resSubs.message === "ok" && resSubs.data.length > 0) {
        setDonationsSubscriptions(resSubs.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
      <div>
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
                cursor: index === 0 ? "pointer" : "default", // Hacer el primer elemento clickeable
              }}
            >
              <img
                style={{ width: "19px", paddingLeft: "2px" }}
                src="https://static.twitchcdn.net/assets/GiftBadge-Gold_72-6e5e65687a6ca6959e08.png"
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

        {showAllSubs && donationsSubscriptions.length > 1 && (
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
        <div
          className="getDonationSubscriptionCard"
          style={{
            position: showAllSubs && "fixed",
            width: showAllSubs && "25.9%",
          }}
        >
          {getDonationSubscriptionCard(donationsSubscriptions)}
        </div>
        <div className="chat-donation-container">
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
            {[...displayDonations].map((donation, index) => (
              <Donation
                key={index}
                donation={donation}
                index={index}
                callback={() => {
                  toggleDonationCard(
                    donation.Pixeles,
                    donation.FromUserInfo.NameUser,
                    donation.FromUserInfo.Avatar,
                    donation.Text,
                    donation.userLook,
                    donation.userColor
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
            ))}
          </div>
          <button
            style={{
              width: "100%",
              marginLeft: "9px",
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
      </div>
    );
  }

  const [firstClick, setFirstClick] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = async () => {
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
      const res = await axios.post(
        `http://localhost:8081/chatStreaming/${OnechatId}`,
        { message },
        config
      );

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const [GetUserTheChatFollowing, setGetUserTheChatFollowing] = useState(false);
  const GetUserTheChatFunc = async (NameUser) => {
    const res = await getUserByNameUser(NameUser);
    if (res.message == "ok") {
      setGetUserTheChat(res.data);
      setShowGetUserTheChat(true);
      if (user?.Following.includes(res?.data.id)) {
        setGetUserTheChatFollowing(true);
      }
    }
  };

  const GetUserTheChatFuncfollow = async () => {
    const token = window.localStorage.getItem("token");
    console.log(GetUserTheChat);
    console.log("!");
    if (token) {
      if (GetUserTheChatFollowing) {
        await unfollow(token, GetUserTheChat?.id);
        setGetUserTheChatFollowing(false);
      } else {
        await follow(token, GetUserTheChat?.id);
        setGetUserTheChatFollowing(true);
      }
    }
  };
  const GiftsubscriptionTheChat = async () => {
    const token = window.localStorage.getItem("token");
    console.log(token, GetUserTheChat);
    if (token) {
      const res = await suscribirse(token, GetUserTheChat?.id);
    }
  };
  return (
    <div className="ChatStreaming">
      {chatExpandeds == true ? (
        <img
          onClick={ToggleChat}
          style={{
            width: "12px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            position: "fixed",
            right: "10px",
            top: "60px",
            transform: "rotate(180deg)",
            zIndex: "99999",
          }}
          className="chat-button-more"
          src="/images/iconos/contraer.png"
        />
      ) : (
        <img
          onClick={ToggleChat}
          style={{
            width: "12px",
            cursor: "pointer",
            textAlign: "center",
            color: "white",
            position: "fixed",
            right: "25%",
            top: "60px",
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
              <img src={GetUserTheChat?.Avatar} alt="" />
              <div className="ShowGetUserTheChat-InfoUser-gsd">
                <span>{GetUserTheChat?.NameUser}</span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowGetUserTheChat(false)}
                >
                  x
                </span>
              </div>
            </div>
            <div className="ShowGetUserTheChat-actions">
              <span
                className="ShowGetUserTheChat-actions-seguir"
                onClick={() => {
                  GetUserTheChatFuncfollow();
                }}
              >
                {GetUserTheChatFollowing ? "dejar de seguir" : "seguir"}
              </span>
              <span>hace algo</span>
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
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className="Message"
            onClick={() => GetUserTheChatFunc(message.nameUser)}
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
