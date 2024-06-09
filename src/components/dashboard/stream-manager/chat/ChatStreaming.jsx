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
import { getStreamerDonationSubscription } from "../../../../services/donationSubscription";
import {
  GetInfoUserInRoomFunc,
  HostChatMessage,
  actionsChatStream,
  actionsModeratorChatStream,
  anclarChatMessage,
  deleteChatMessage,
  desanclarChatMessage,
} from "../../../../services/backGo/chat";
import { useNotification } from "../../../Notifications/NotificationProvider";
import DropdownChatConfig from "../../../channel/chat/dropdown/config/DropdownChatConfig";
import UserInfo from "../../../userinfo/UserInfo";
import DropdownChatIdentity from "../../../channel/chat/dropdown/identity/DropdownChatIdentity";
import DropdownEmotes from "../../../channel/chat/dropdown/emotes/DropdownEmotes";
export function ChatStreaming({
  streamerChat,
  chatExpandeds,
  ToggleChat,
  streamerData,
  user,
  isMobile,
  DashboardStream = false,
  followParam,
}) {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);

  const conversationRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [socketDeleteMsj, setsocketDeleteMsj] = useState(null);
  const pingIntervalRef = useRef(null);
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
  const [messagesold, setMessageold] = useState([]);
  const [SubStateAct, SetSubStateAct] = useState(false);
  const [FollowParamOwnner, SetFollowParamOwner] = useState(false);
  const [MsjChatAnclado, SetMsjChatAnclado] = useState(null);
  const [NewHost, SetNewHost] = useState(null);
  const hostTimeoutRef = useRef(null);
  const alert = useNotification();
  const history = useHistory();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isNavbarOpenDropdownEmotes, setisNavbarOpenDropdownEmotes] =
    useState(false);

  const closeNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  const closeNavbarDropdownEmotes = () => {
    setisNavbarOpenDropdownEmotes(!isNavbarOpenDropdownEmotes);
  };
  const [message, setMessage] = useState("");
  const [emoticonMessage, setEmoticonMessage] = useState([]);
  const [cursorIndex, setCursorIndex] = useState(0);
  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.innerHTML = message;
  //     placeCaretAtEnd(inputRef.current);
  //   }
  // }, [message]);
  const placeCaretAtEnd = (el) => {
    el.focus();
    if (
      typeof window.getSelection != "undefined" &&
      typeof document.createRange != "undefined"
    ) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const inputRef = useRef(null);
  const insertHTMLAtCaret = (html) => {
    const el = document.createElement("div");
    el.innerHTML = html;

    const range = window.getSelection().getRangeAt(0);
    const selectedNode = range.commonAncestorContainer;
    if (!inputRef.current) {
      console.error("inputRef.current is null");
      return;
    }
    if (selectedNode.nodeType === Node.TEXT_NODE) {
      const text = selectedNode.textContent;
      const beforeText = text.substring(0, range.startOffset);
      const afterText = text.substring(range.endOffset);
      const textNodeBefore = document.createTextNode(beforeText);
      const textNodeAfter = document.createTextNode(afterText);

      inputRef.current.insertBefore(textNodeBefore, selectedNode);
      inputRef.current.insertBefore(el.firstChild, selectedNode);
      inputRef.current.insertBefore(textNodeAfter, selectedNode);

      inputRef.current.removeChild(selectedNode);
    } else {
      console.log(el?.firstChild);
      inputRef?.current?.appendChild(el?.firstChild);
    }

    setMessage(inputRef.current.innerHTML);
  };

  const clickEmoticon = (emoticon) => {
    const imgHTML = `<img src="${emoticon.url}" alt="${emoticon.name}" style="width: 20px; height: 20px;" />`;
    insertHTMLAtCaret(imgHTML);
    // setEmoticonMessage((prevMessage) => [...prevMessage, emoticon.url]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      const node = inputRef.current.childNodes[0];
      if (node) {
        range.setStart(node, cursorIndex);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [cursorIndex]);

  const handleInput = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    setCursorIndex(range.startOffset);

    setMessage(inputRef.current.innerText);
  };
  const getPlainTextMessage = () => {
    const inputElement = inputRef.current;
    const imgTags = inputElement.getElementsByTagName("img");
    let messageWithImages = "";

    for (let node of inputElement.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        messageWithImages += node.textContent;
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === "IMG"
      ) {
        messageWithImages += " " + node.src + " ";
      }
    }
    return messageWithImages.trim();
  };
  let stopIteration = true;

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  useEffect(() => {
    const timer = setTimeout(async () => {
      stopIteration = false;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
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
          if (stopIteration) {
            setMessageold((prevMessages) => [...prevMessages, receivedMessage]);
            scrollToBottom();
          } else {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            scrollToBottom();
          }
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
  }, []);

  useEffect(() => {
    if (isMobile) {
      ToggleChat(false);
    }

    const token = window.localStorage.getItem("token");
    const REACT_APP_BACKCHATWS = process.env.REACT_APP_BACKCHATWS;
    const newSocket = new WebSocket(
      `${REACT_APP_BACKCHATWS}/ws/notifications/notifications/actionMessages/${streamerChat.id}`
    );
    const connectWebSocket = () => {
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      newSocket.onmessage = (event) => {
        try {
          const receivedMessage = JSON.parse(event.data);
          newSocket.send("onmessage");
          if (
            receivedMessage.action === "message_deleted" &&
            typeof receivedMessage.message_id === "string"
          ) {
            deleteMessages(receivedMessage);
            return;
          }
          if (receivedMessage.action === "message_Anclar") {
            AnclarMessage(receivedMessage?.message);
            return;
          }
          if (receivedMessage.action === "message_Desanclar") {
            SetMsjChatAnclado(null);
          }
          if (receivedMessage?.action === "host_action") {
            const delay = Math.floor(Math.random() * 3000);
            setTimeout(() => {
              history.push("/" + receivedMessage?.hostA?.nameUser);
            }, delay);
          }
          if (receivedMessage?.action === "Host") {
            SetNewHost({
              HostBy: receivedMessage.hostby,
              spectators: receivedMessage.spectators,
            });

            if (hostTimeoutRef.current) {
              clearTimeout(hostTimeoutRef.current);
            }

            hostTimeoutRef.current = setTimeout(() => {
              SetNewHost(null);
            }, 90000);
          }
        } catch (error) {
          console.error("Error al analizar el mensaje JSON:", error);
        }
      };

      newSocket.onopen = () => {};
      setsocketDeleteMsj(newSocket);

      window.addEventListener("beforeunload", () => {
        newSocket.send("closing");
        newSocket.close();
      });
    };

    if (!socketDeleteMsj || socketDeleteMsj.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }
    return () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  useEffect(() => {
    const pingInterval = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    };

    pingInterval(); // Invocar la función aquí para que se ejecute inmediatamente
    pingIntervalRef.current = setInterval(pingInterval, 3000);
    return () => {
      clearInterval(pingIntervalRef.current);
    };
  }, [socket]);
  useEffect(() => {
    const pingInterval = () => {
      if (socketDeleteMsj && socketDeleteMsj.readyState === WebSocket.OPEN) {
        socketDeleteMsj.send("ping");
      }
    };

    pingInterval(); // Invocar la función aquí para que se ejecute inmediatamente
    pingIntervalRef.current = setInterval(pingInterval, 3000);
    return () => {
      clearInterval(pingIntervalRef.current);
    };
  }, [socketDeleteMsj]);

  function AnclarMessage(receivedMessage) {
    const emotesChat = JSON.parse(receivedMessage.EmotesChat);
    const subscriptionInfo = JSON.parse(receivedMessage?.SubscriptionInfo);

    const messageData = {
      ...receivedMessage,
      EmotesChat: emotesChat,
      SubscriptionInfo: subscriptionInfo,
    };
    SetMsjChatAnclado(null);
    SetMsjChatAnclado(messageData);
  }

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  function deleteMessages(receivedMessage) {
    setMessages((prevMessages) =>
      prevMessages.filter(
        (message) => message.Id !== receivedMessage.message_id
      )
    );
    setMessageold((prevMessages) =>
      prevMessages.filter(
        (message) => message.Id !== receivedMessage.message_id
      )
    );
  }
  const [dropdownChatConfig, setDropdownChatConfig] = useState(false);
  const onMouseEnterChatConfig = () => {
    setDropdownChatConfig(!dropdownChatConfig);
  };

  useEffect(() => {
    const fetchGetSubsAct = async () => {
      const res = await GetSubsAct(user?.id, streamerData?.id);

      if (res?.data && res?.message === "ok") {
        SetSubStateAct(true);
      } else {
        SetSubStateAct(false);
      }
    };
    if (user?.id !== streamerData?.id) {
      fetchGetSubsAct();
    } else {
      SetSubStateAct(true);
      SetFollowParamOwner(true);
    }
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
            padding: "0px 11px",
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
  const [Modolento, setModolento] = useState(null);
  const sendMessage = async () => {
    if (message.startsWith("/host")) {
      const regex = /\/host\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        HostChatMessageFunc(nameUser);
        setResMessageschat(null);

        setMessage("");
        return;
      }
      setResMessageschat(null);

      setMessage("");
      return;
    }
    setResMessageschat(null);
    setMessage("");
    const textplain = await getPlainTextMessage();
    if (
      streamerChat?.ModChat == "Following" &&
      (followParam || FollowParamOwnner)
    ) {
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
        let ResNameUser = "";
        let ResMessage = "";

        if (ResMessageschatState != null) {
          ResNameUser = ResMessageschatState.nameUser;
          ResMessage = ResMessageschatState.message;
        }

        const res = await axios.post(
          `${REACT_APP_BACKCHAT}/chatStreaming/${streamerChat.id}`,
          { message: textplain, ResNameUser, ResMessage },
          config
        );
        const currentDate = new Date();
        const newDate = new Date(
          currentDate.getTime() + streamerChat.ModSlowMode * 1000
        );

        setModolento(newDate);
      } catch (error) {
        console.log(error);
      }
    } else if (streamerChat?.ModChat == "") {
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
        let ResNameUser = "";
        let ResMessage = "";

        if (ResMessageschatState != null) {
          ResNameUser = ResMessageschatState.nameUser;
          ResMessage = ResMessageschatState.message;
        }

        const res = await axios.post(
          `${REACT_APP_BACKCHAT}/chatStreaming/${streamerChat.id}`,
          { message: textplain, ResNameUser, ResMessage },
          config
        );
        const currentDate = new Date();
        const newDate = new Date(
          currentDate.getTime() + streamerChat.ModSlowMode * 1000
        );

        setModolento(newDate);
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
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
  const countdownSeconds = () => {
    const difference = (Modolento - new Date()) / 1000;
    return Math.floor(difference);
  };

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
    const parts = message.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // Si la parte del mensaje es una URL
        if (part.includes("files.kick.com")) {
          // Decodificamos la URL para manejar los caracteres especiales correctamente
          const decodedUrl = decodeURIComponent(part);
          // Cortamos la URL a partir del símbolo &
          const cutoffIndex = decodedUrl.indexOf("&");
          const imageUrl =
            cutoffIndex !== -1
              ? decodedUrl.substring(0, cutoffIndex)
              : decodedUrl;

          // Devolvemos la etiqueta img con la URL cortada como src
          return (
            <img
              key={index}
              src={imageUrl}
              style={{ width: "20px", height: "auto" }}
              alt="Image"
            />
          );
        } else {
          // Si no es una URL de files.kick.com, devolvemos un enlace
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
        // Si la parte del mensaje es una etiqueta img
        return part.replace(imgRegex, (match, src) => {
          if (src.includes("files.kick.com")) {
            // Si el src coincide con files.kick.com, reemplazamos la etiqueta img con un párrafo
            return `${match}`;
          } else {
            // Si el src no coincide con files.kick.com, devolvemos la etiqueta img original
            return match;
          }
        });
      }
      return part;
    });
  }

  function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
            top: "139px",
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
            top: "96px",
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
        <div style={{ height: "50px", display: "flex", alignItems: "center" }}>
          <h4
            style={{
              fontSize: "17px",
              fontWeight: "bolder",
              width: "290px",
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
              style={{ cursor: "pointer" }}
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
                      "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/OWNER_ixhnvh.jpg"
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
                      {MsjChatAnclado.nameUser}:{" "}
                      <span style={{ color: "#ffff" }}>
                        {parseMessage(MsjChatAnclado.message)}
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
      <div className="Conversation" ref={conversationRef}>
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

        {messagesold.map((message, index) => (
          <div
            key={index}
            className="Message"
            onClick={() => GetUserTheChatFunc(message)}
            style={{ cursor: "pointer" }}
          >
            {message.ResMessage != "" && (
              <div className="ResMessage">
                <FaReply className="grey-icon" />
                <span> Respondio a </span>
                <span> @{message.ResNameUser}:</span>
                <span>{message.ResMessage}</span>
              </div>
            )}
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
                    "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/OWNER_ixhnvh.jpg"
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
                    {message.nameUser}:{" "}
                    <span style={{ color: "#ffff" }}>
                      {parseMessage(message.message)}
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
        ))}

        {messages.length > 0 && (
          <div className="new-messages">
            <div />
            <span>Nuevos mensajes</span>
            <div />
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className="Message"
            onClick={() => GetUserTheChatFunc(message)}
            style={{ cursor: "pointer" }}
          >
            {message.ResMessage != "" && (
              <div className="ResMessage">
                <FaReply className="grey-icon" />
                <span> Respondio a </span>
                <span> @{message.ResNameUser}:</span>
                <span>{message.ResMessage}</span>
              </div>
            )}
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
                    "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/OWNER_ixhnvh.jpg"
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
                    {message.nameUser}:{" "}
                    <span style={{ color: "#ffff" }}>
                      {parseMessage(message.message)}
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
        ))}
      </div>
      <div className="actions-chat-conteiner">
        {ResMessageschatState != null && (
          <div
            key={ResMessageschatState.Id}
            className="Message"
            onClick={() => GetUserTheChatFunc(ResMessageschatState)}
            style={{ cursor: "pointer" }}
          >
            <div className="badges">
              {ResMessageschatState.EmotesChat.Moderator && (
                <img src={ResMessageschatState.EmotesChat.Moderator} alt="" />
              )}
              {ResMessageschatState.EmotesChat.Verified && (
                <img src={ResMessageschatState.EmotesChat.Verified} alt="" />
              )}
              {ResMessageschatState.EmotesChat.Vip && (
                <img src={ResMessageschatState.EmotesChat.Vip} alt="" />
              )}
              {isSubscriptor(ResMessageschatState) && (
                <img src={isSubscriptor(ResMessageschatState)} alt="" />
              )}
              {ResMessageschatState?.StreamerChannelOwner && (
                <img
                  src={
                    "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404308/Emblemas/OWNER_ixhnvh.jpg"
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
                      color: ResMessageschatState.Color,
                    }}
                  >
                    {ResMessageschatState.nameUser}:{" "}
                    <span style={{ color: "#ffff" }}>
                      {parseMessage(ResMessageschatState.message)}
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="hover-button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setResMessageschat(null);
                  }}
                  className="hover-btn"
                >
                  x
                </button>
              </div>
            </div>
          </div>
        )}
        {streamerChat?.ModChat === "Following" &&
          (followParam || FollowParamOwnner) && (
            <form className="ChatStreaming_form" onSubmit={handleSubmit}>
              <span
                style={{
                  cursor: "pointer",
                  display: "flex",
                }}
                onClick={() => closeNavbar()}
              >
                <svg
                  style={{
                    padding: "3px",
                  }}
                  width="25"
                  height="25"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="grey"
                    fillRule="evenodd"
                    d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {isNavbarOpen && (
                <DropdownChatIdentity
                  closeNavbar={closeNavbar}
                  chatData={GetInfoUserInRoom}
                  user={user}
                />
              )}
              {isNavbarOpenDropdownEmotes && (
                <DropdownEmotes
                  clickEmoticon={clickEmoticon}
                  closeNavbar={closeNavbarDropdownEmotes}
                  chatData={GetInfoUserInRoom}
                  user={user}
                />
              )}
              {Modolento >= new Date() ? (
                <input
                  type="text"
                  value={message}
                  placeholder={`Faltan ${countdownSeconds()} segundos`}
                />
              ) : (
                // <input
                //   type="text"
                //   value={message}
                //   placeholder="Enviar un mensaje"
                //   onChange={handleChange}
                // />
                <div
                  contentEditable
                  className="divinput-chat"
                  ref={inputRef}
                  onInput={handleInput}
                  dangerouslySetInnerHTML={{ __html: message }}
                  color="#fff"
                  placeholder="Type a message..."
                  onKeyPress={handleKeyPress}
                />
              )}
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Emoticonos
                  </h1>
                }
              >
                <div
                  style={{ marginRight: "3px" }}
                  onClick={() => closeNavbarDropdownEmotes()}
                  className="config-buttoncloseNavbarDropdownEmotes"
                >
                  <i
                    style={{ fontSize: isMobile && "24px" }}
                    class="fas fa-laugh"
                  />
                </div>
              </Tippy>
            </form>
          )}
        {streamerChat?.ModChat === "Following" &&
          !followParam &&
          !FollowParamOwnner && (
            <form className="ChatStreaming_form" onSubmit={handleSubmit}>
              <span
                style={{
                  cursor: "pointer",
                  display: "flex",
                }}
                onClick={() => closeNavbar()}
              >
                <svg
                  style={{
                    padding: "3px",
                  }}
                  width="25"
                  height="25"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="grey"
                    fillRule="evenodd"
                    d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {isNavbarOpen && (
                <DropdownChatIdentity
                  closeNavbar={closeNavbar}
                  chatData={GetInfoUserInRoom}
                  user={user}
                />
              )}
              {isNavbarOpenDropdownEmotes && (
                <DropdownEmotes
                  clickEmoticon={clickEmoticon}
                  closeNavbar={closeNavbarDropdownEmotes}
                  chatData={GetInfoUserInRoom}
                  user={user}
                />
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  padding: "9px",
                  background: "#171a1f",
                  border: "#545658 1px solid",
                  borderRight: "none",
                }}
              >
                <path
                  d="M11.75 6.25V1H4.75V6.25H3V15H13.5V6.25H11.75ZM6.5 2.75H10V6.25H6.5V2.75ZM10.4375 10.625H9.125V12.375H7.375V10.625H6.0625V8.875H10.4375V10.625Z"
                  fill="#ffff"
                ></path>
              </svg>
              <input
                style={{
                  borderRadius: "0px 5px 5px 0px",
                  borderLeft: "none",
                }}
                type="text"
                // value={message}
                placeholder="solo seguidores"
                // onChange={handleChange}
              />
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Emoticonos
                  </h1>
                }
              >
                <div
                  style={{ marginRight: "3px" }}
                  onClick={() => closeNavbarDropdownEmotes()}
                  className="config-buttoncloseNavbarDropdownEmotes"
                >
                  <i
                    style={{ fontSize: isMobile && "24px" }}
                    class="fas fa-laugh"
                  />
                </div>
              </Tippy>
            </form>
          )}
        {streamerChat?.ModChat === "Subscriptions" && SubStateAct && (
          <form className="ChatStreaming_form" onSubmit={handleSubmit}>
            <span
              style={{
                cursor: "pointer",
                display: "flex",
              }}
              onClick={() => closeNavbar()}
            >
              <svg
                style={{
                  padding: "3px",
                }}
                width="25"
                height="25"
                viewBox="0 0 20 20"
              >
                <path
                  fill="grey"
                  fillRule="evenodd"
                  d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {isNavbarOpen && (
              <DropdownChatIdentity
                closeNavbar={closeNavbar}
                chatData={GetInfoUserInRoom}
                user={user}
              />
            )}
            {isNavbarOpenDropdownEmotes && (
              <DropdownEmotes
                clickEmoticon={clickEmoticon}
                closeNavbar={closeNavbarDropdownEmotes}
                chatData={GetInfoUserInRoom}
                user={user}
              />
            )}
            {Modolento >= new Date() ? (
              <input
                type="text"
                value={message}
                placeholder={`Faltan ${countdownSeconds()} segundos`}
              />
            ) : (
              // <input
              //   type="text"
              //   value={message}
              //   placeholder="Enviar un mensaje"
              //   onChange={handleChange}
              // />
              <div
                contentEditable
                className="divinput-chat"
                ref={inputRef}
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: message }}
                color="#fff"
                placeholder="Type a message..."
                onKeyPress={handleKeyPress}
              />
            )}
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Emoticonos
                </h1>
              }
            >
              <div
                style={{ marginRight: "3px" }}
                onClick={() => closeNavbarDropdownEmotes()}
                className="config-buttoncloseNavbarDropdownEmotes"
              >
                <i
                  style={{ fontSize: isMobile && "24px" }}
                  class="fas fa-laugh"
                />
              </div>
            </Tippy>{" "}
          </form>
        )}
        {streamerChat?.ModChat === "Subscriptions" && !SubStateAct && (
          <form className="ChatStreaming_form" onSubmit={handleSubmit}>
            <span
              style={{
                cursor: "pointer",
                display: "flex",
              }}
              onClick={() => closeNavbar()}
            >
              <svg
                style={{
                  padding: "3px",
                }}
                width="25"
                height="25"
                viewBox="0 0 20 20"
              >
                <path
                  fill="grey"
                  fillRule="evenodd"
                  d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {isNavbarOpen && (
              <DropdownChatIdentity
                closeNavbar={closeNavbar}
                chatData={GetInfoUserInRoom}
                user={user}
              />
            )}
            {isNavbarOpenDropdownEmotes && (
              <DropdownEmotes
                clickEmoticon={clickEmoticon}
                closeNavbar={closeNavbarDropdownEmotes}
                chatData={GetInfoUserInRoom}
                user={user}
              />
            )}
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                padding: "9px",
                background: "#171a1f",
                border: "#545658 1px solid",
                borderRight: "none",
              }}
            >
              <path
                d="M11.75 6.25V1H4.75V6.25H3V15H13.5V6.25H11.75ZM6.5 2.75H10V6.25H6.5V2.75ZM10.4375 10.625H9.125V12.375H7.375V10.625H6.0625V8.875H10.4375V10.625Z"
                fill="#ffff"
              ></path>
            </svg>
            <input
              style={{
                borderRadius: "0px 5px 5px 0px",
                borderLeft: "none",
              }}
              type="text"
              // value={message}
              placeholder="solo suscriptores"
              // onChange={handleChange}
            />
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Emoticonos
                </h1>
              }
            >
              <div
                style={{ marginRight: "3px" }}
                onClick={() => closeNavbarDropdownEmotes()}
                className="config-buttoncloseNavbarDropdownEmotes"
              >
                <i
                  style={{ fontSize: isMobile && "24px" }}
                  class="fas fa-laugh"
                />
              </div>
            </Tippy>
          </form>
        )}
        {streamerChat?.ModChat === "" && (
          <form className="ChatStreaming_form" onSubmit={handleSubmit}>
            <span
              style={{
                cursor: "pointer",
                display: "flex",
              }}
              onClick={() => closeNavbar()}
            >
              <svg
                style={{
                  padding: "3px",
                }}
                width="25"
                height="25"
                viewBox="0 0 20 20"
              >
                <path
                  fill="grey"
                  fillRule="evenodd"
                  d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 6a6 6 0 0 1-4.904-9.458l8.362 8.362A5.972 5.972 0 0 1 10 16zm4.878-2.505a6 6 0 0 0-8.372-8.372l8.372 8.372z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {isNavbarOpen && (
              <DropdownChatIdentity
                closeNavbar={closeNavbar}
                chatData={GetInfoUserInRoom}
                user={user}
              />
            )}
            {isNavbarOpenDropdownEmotes && (
              <DropdownEmotes
                clickEmoticon={clickEmoticon}
                closeNavbar={closeNavbarDropdownEmotes}
                chatData={GetInfoUserInRoom}
                user={user}
              />
            )}
            {Modolento >= new Date() ? (
              <input
                type="text"
                value={message}
                placeholder={`Faltan ${countdownSeconds()} segundos`}
              />
            ) : (
              // <input
              //   type="text"
              //   // value={message}
              //   placeholder="Enviar un mensaje"
              //   onChange={handleChange}
              //   dangerouslySetInnerHTML={{ __html: message }}
              // />
              <div
                contentEditable
                className="divinput-chat"
                ref={inputRef}
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: message }}
                color="#fff"
                placeholder="Type a message..."
                onKeyPress={handleKeyPress}
              />
            )}
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Emoticonos
                </h1>
              }
            >
              <div
                style={{ marginRight: "3px" }}
                onClick={() => closeNavbarDropdownEmotes()}
                className="config-buttoncloseNavbarDropdownEmotes"
              >
                <i
                  style={{ fontSize: isMobile && "24px" }}
                  class="fas fa-laugh"
                />
              </div>
            </Tippy>
          </form>
        )}
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
          {dropdownChatConfig && (
            <DropdownChatConfig changeTextSize={(e) => changeTextSize(e)} />
          )}
          <div>
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Config. del chat
                </h1>
              }
            >
              <button
                onClick={() => onMouseEnterChatConfig()}
                style={{ marginRight: "5px" }}
                className="config-button"
              >
                <i
                  style={{ fontSize: isMobile && "24px" }}
                  class="fas fa-cog"
                />
              </button>
            </Tippy>

            <button onClick={handleSubmit} type="submit">
              Enviar
            </button>
          </div>
          {dropdownPoints && (
            <div style={{ zIndex: "100000000000" }}>
              <DropdownPoints
                streamer={streamerData}
                closeNavbar={() => setDropdownPoints(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
