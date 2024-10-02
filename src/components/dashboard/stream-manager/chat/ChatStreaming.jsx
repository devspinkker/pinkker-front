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
  RedisFindMatchingUsersInRoomByPrefix,
} from "../../../../services/backGo/chat";
import { useNotification } from "../../../Notifications/NotificationProvider";
import DropdownChatConfig from "../../../channel/chat/dropdown/config/DropdownChatConfig";
import DropdownChatIdentity from "../../../channel/chat/dropdown/identity/DropdownChatIdentity";
import DropdownEmotes from "../../../channel/chat/dropdown/emotes/DropdownEmotes";
export function ChatStreaming({
  openChatWindow,
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

  const [ModSlowMode, SetModSlowMode] = useState("");
  const [ModChat, SetModChat] = useState("");

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

  // selcecionar sugerencia
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestedUsers.length - 1)
      );
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActiveSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0) {
        handleSuggestionSelect(suggestedUsers[activeSuggestionIndex]);
      }
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (suggestedUsers?.length > 0) {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [suggestedUsers, activeSuggestionIndex]);

  // buscqueda de usuario en el chat

  const handleSuggestionSelect = (suggestion) => {
    const content = inputRef.current.innerHTML;
    const atSymbolIndex = content.lastIndexOf("@");

    if (atSymbolIndex !== -1) {
      const trimmedContent = content.slice(atSymbolIndex + 1);
      const spaceIndex = trimmedContent.indexOf(" ");

      const afterAt =
        spaceIndex === -1
          ? trimmedContent
          : trimmedContent.slice(0, spaceIndex);

      const newContent =
        content.slice(0, atSymbolIndex + 1) +
        suggestion +
        "&nbsp;" +
        content.slice(atSymbolIndex + 1 + afterAt.length);

      // Actualizar el contenido del input
      inputRef.current.innerHTML = newContent;

      // Establecer el mensaje y limpiar sugerencias
      setMessage(newContent);
      setSuggestedUsers([]); // Limpiar sugerencias

      // Enfocar el campo de entrada
      inputRef.current.focus();
      // Mover el cursor al final del contenido
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const token = window.localStorage.getItem("token");
  const detectAtSymbolAndFetchUsers = async (content) => {
    const atSymbolIndex = content.lastIndexOf("@");
    if (atSymbolIndex !== -1) {
      const trimmedContent = content.slice(atSymbolIndex + 1).trim();
      const spaceIndex = trimmedContent.indexOf(" ");

      const afterAt =
        spaceIndex === -1
          ? trimmedContent
          : trimmedContent.slice(0, spaceIndex).trim();

      const cleanAfterAt = afterAt.replace(/&nbsp;/g, "").trim();

      const remainingText =
        spaceIndex === -1 ? "" : trimmedContent.slice(spaceIndex).trim();

      if (cleanAfterAt.length > 0 && remainingText === "") {
        try {
          const users = await RedisFindMatchingUsersInRoomByPrefix(
            cleanAfterAt,
            streamerChat.id,
            token
          );
          setSuggestedUsers(users.active);
        } catch (error) {
          console.log("no encontrado");
        }
      }
    }
  };

  // manejo de los msj en el chat
  const [message, setMessage] = useState("");

  const [cursorIndex, setCursorIndex] = useState(0);
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

      const newRange = document.createRange();
      newRange.setStart(textNodeAfter, 0);
      newRange.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      const nodeToInsert = el.firstChild;
      if (nodeToInsert) {
        inputRef.current.appendChild(nodeToInsert);
        const newRange = document.createRange();
        newRange.setStartAfter(nodeToInsert);
        newRange.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
    setMessage(inputRef.current.innerHTML);
  };

  const clickEmoticon = (emoticon) => {
    const imgHTML = `<img src="${emoticon.url}" alt="${emoticon.name}" style="width: 20px; height: 20px;" />`;
    insertHTMLAtCaret(imgHTML);
  };

  // const handleInput = () => {
  //   detectAtSymbolAndFetchUsers(inputRef.current.innerHTML);
  //   setMessage(inputRef.current.innerHTML);
  // };

  const handleInput = (event) => {
    const content = inputRef.current.innerHTML;
    const cursorPosition = window.getSelection().getRangeAt(0).startOffset;

    setMessage(content);
    detectAtSymbolAndFetchUsers(content, cursorPosition); // Detecta solo si el cursor está cerca del @
  };

  const getPlainTextMessage = () => {
    const inputElement = inputRef.current;
    let messageWithImages = "";

    inputElement?.childNodes?.forEach((node) => {
      if (node?.nodeType === Node?.TEXT_NODE) {
        messageWithImages += node.textContent;
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === "IMG"
      ) {
        const src = node.src;
        if (
          src.includes("res.cloudinary.com/depcty8j1/") &&
          src.includes("subs")
        ) {
          if (!SubStateAct) {
            return;
          }
        }
        messageWithImages += " " + src + " ";
      }
    });

    return messageWithImages.trim();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
      CleansendMessage();
    }
  };
  const CleansendMessage = () => {
    if (inputRef.current) {
      inputRef.current.innerHTML = "";
      setMessage("");
      setSuggestedUsers([]);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
    CleansendMessage();
  };
  // ws para las conexiones de lo msj que entran y las acciones que hay en el chat
  let stopIteration = true;
  useEffect(() => {
    const timer = setTimeout(async () => {
      stopIteration = false;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
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
          if (receivedMessage?.action === "ModSlowMode") {
            SetModSlowMode(receivedMessage?.ModSlowMode);
          }
          if (receivedMessage?.action === "ModChat") {
            SetModChat(receivedMessage?.ModChat);
          }
          if (receivedMessage?.action === ("DonatePixels" || "Suscribirse")) {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            scrollToBottom();
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

  //
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
    SetModSlowMode(streamerChat?.ModSlowMode);
    SetModChat(streamerChat?.ModChat);

    const fetchGetSubsAct = async () => {
      const res = await GetSubsAct(user?.id, streamerData?.id);
      if (res?.data && res?.message === "ok") {
        const subQue = isSubscriptorGetSubsAct(res.data);
        SetSubStateAct(subQue);
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
              className="getDonationSubscriptionCard-map-daughter"
              style={{
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

  const [Modolento, setModolento] = useState(null);
  async function ActionSendMessageComando(action, nameUser) {
    const streamerId = window.localStorage.getItem("_id");
    if (streamerChat.streamerId === streamerId) {
      await ModeratorUserChatStreamer(streamerChat.id, action, nameUser, 0);
    } else if (
      GetInfoUserInRoom.Moderator &&
      streamerChat.streamerId !== streamerId
    ) {
      ModeratorUserChat(action, nameUser, 0, streamerChat.id);
    }
  }
  const sendMessage = async () => {
    if (message.startsWith("/host")) {
      const regex = /\/host\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        HostChatMessageFunc(nameUser);
        setResMessageschat(null);

        setMessage("");
        setSuggestedUsers([]);
        return;
      }
      setResMessageschat(null);

      setMessage("");
      setSuggestedUsers([]);
      return;
    }

    if (message.startsWith("/vip")) {
      const regex = /\/vip\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        ActionSendMessageComando("vip", nameUser);
        setResMessageschat(null);

        setMessage("");
        setSuggestedUsers([]);
        return;
      }
      setResMessageschat(null);

      setMessage("");
      setSuggestedUsers([]);
      return;
    }
    if (message.startsWith("/unvip")) {
      const regex = /\/unvip\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        ActionSendMessageComando("rVip", nameUser);
        setResMessageschat(null);

        setMessage("");
        setSuggestedUsers([]);
        return;
      }
      setResMessageschat(null);

      setMessage("");
      setSuggestedUsers([]);
      return;
    }
    if (message.startsWith("/ban")) {
      const regex = /\/ban\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        ActionSendMessageComando("baneado", nameUser);
        setResMessageschat(null);

        setMessage("");
        setSuggestedUsers([]);
        return;
      }
      setResMessageschat(null);

      setMessage("");
      setSuggestedUsers([]);
      return;
    }
    if (message.startsWith("/unban")) {
      const regex = /\/unban\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        ActionSendMessageComando("removeban", nameUser);
        setResMessageschat(null);

        setMessage("");
        setSuggestedUsers([]);
        return;
      }
      setResMessageschat(null);

      setMessage("");
      setSuggestedUsers([]);
      return;
    }
    if (message.startsWith("/mod")) {
      const regex = /\/mod\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        ActionSendMessageComando("moderator", nameUser);
        setResMessageschat(null);

        setMessage("");
        setSuggestedUsers([]);
        return;
      }
      setResMessageschat(null);

      setMessage("");
      setSuggestedUsers([]);
      return;
    }
    if (message.startsWith("/unmod")) {
      const regex = /\/unmod\s+(\S+)\s*(.*)/;
      const match = message.match(regex);
      if (match) {
        const nameUser = match[1];
        ActionSendMessageComando("rModerator", nameUser);
        setResMessageschat(null);

        setMessage("");
        setSuggestedUsers([]);
        return;
      }
      setResMessageschat(null);

      setMessage("");
      setSuggestedUsers([]);
      return;
    }
    setResMessageschat(null);
    setMessage("");
    setSuggestedUsers([]);
    const textplain = getPlainTextMessage();

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
      const newDate = new Date(currentDate.getTime() + ModSlowMode * 1000);
      setModolento(newDate);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const isSubscriptorGetSubsAct = (data) => {
    const currentTimestamp = Date.now();
    const subscriptionEndTimestamp = Date.parse(data?.SubscriptionEnd);

    if (subscriptionEndTimestamp <= 0 || isNaN(subscriptionEndTimestamp)) {
      return false;
    }

    if (subscriptionEndTimestamp < currentTimestamp) {
      return false;
    } else {
      return true;
    }
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
      if (user?.Following?.hasOwnProperty(res?.data?.id)) {
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
        maxWidth: DashboardStream ? "40%" : "",
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
                <span> Respondio </span>
                <span> @{message.ResNameUser}:</span>
                <span> {parseMessage(message.ResMessage).content}</span>
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
                      <span style={{ color: "#ffff" }}>
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
        ))}

        {messages.length > 0 && (
          <div className="new-messages">
            <div />
            <span>Nuevos mensajes</span>
            <div />
          </div>
        )}
        {messages.map((message, index) => {
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
      <div className="actions-chat-conteiner">
        <div className="actions-chat-conteiner-content">
          {ResMessageschatState != null && (
            <div
              key={ResMessageschatState.Id}
              className="Message "
              onClick={() => GetUserTheChatFunc(ResMessageschatState)}
              style={{
                cursor: "pointer",
                flexDirection: "row",
              }}
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
                        color: ResMessageschatState.Color,
                      }}
                    >
                      <span className="content-info-message-2-nameUser-span">
                        {ResMessageschatState.nameUser}:{" "}
                      </span>
                      <span style={{ color: "#ffff" }}>
                        {parseMessage(ResMessageschatState.message).content}
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
          <div className="suggestedUsers">
            {suggestedUsers?.length > 0 &&
              suggestedUsers.map((u, index) => (
                <span
                  key={u}
                  className={`suggestedUsers-span ${
                    index === activeSuggestionIndex ? "active" : ""
                  }`}
                  onClick={() => handleSuggestionSelect(u)}
                >
                  {u}
                </span>
              ))}
          </div>

          {ModChat === "Following" && (followParam || FollowParamOwnner) && (
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
                  ImgStreamer={streamerChat.streamer_avatar}
                  SubStateAct={SubStateAct}
                  idStreamer={streamerChat.streamerId}
                  clickEmoticon={clickEmoticon}
                  closeNavbar={closeNavbarDropdownEmotes}
                  chatData={GetInfoUserInRoom}
                  user={user}
                />
              )}
              {Modolento && Modolento >= new Date() && secondsRemaining > 0 ? (
                <input
                  type="text"
                  style={{
                    height: "38px",
                  }}
                  value={`Faltan ${secondsRemaining} segundos`}
                  readOnly
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
                  style={{ color: "#fff" }}
                  placeholder="Enviar un mensaje..."
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
          {ModChat === "Following" && !followParam && !FollowParamOwnner && (
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
                  ImgStreamer={streamerChat.streamer_avatar}
                  SubStateAct={SubStateAct}
                  idStreamer={streamerChat.streamerId}
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
          {ModChat === "Subscriptions" && SubStateAct && (
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
                  ImgStreamer={streamerChat.streamer_avatar}
                  SubStateAct={SubStateAct}
                  idStreamer={streamerChat.streamerId}
                  clickEmoticon={clickEmoticon}
                  closeNavbar={closeNavbarDropdownEmotes}
                  chatData={GetInfoUserInRoom}
                  user={user}
                />
              )}
              {Modolento && Modolento >= new Date() && secondsRemaining > 0 ? (
                <input
                  type="text"
                  style={{
                    height: "38px",
                  }}
                  value={`Faltan ${secondsRemaining} segundos`}
                  readOnly
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
                  style={{ color: "#fff" }}
                  placeholder="Enviar un mensaje..."
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
          {ModChat === "Subscriptions" && !SubStateAct && (
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
                  ImgStreamer={streamerChat.streamer_avatar}
                  SubStateAct={SubStateAct}
                  idStreamer={streamerChat.streamerId}
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
          {ModChat === "" && (
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
                  ImgStreamer={streamerChat.streamer_avatar}
                  SubStateAct={SubStateAct}
                  idStreamer={streamerChat.streamerId}
                  clickEmoticon={clickEmoticon}
                  closeNavbar={closeNavbarDropdownEmotes}
                  chatData={GetInfoUserInRoom}
                  user={user}
                />
              )}
              {Modolento && Modolento >= new Date() && secondsRemaining > 0 ? (
                <input
                  type="text"
                  style={{
                    height: "38px",
                  }}
                  value={`Faltan ${secondsRemaining} segundos`}
                  readOnly
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
                  style={{ color: "#fff" }}
                  placeholder="Enviar un mensaje..."
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
              <DropdownChatConfig
                openChatWindow={openChatWindow}
                changeTextSize={(e) => changeTextSize(e)}
              />
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
    </div>
  );
}
