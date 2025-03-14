import React, { useState, useEffect, useRef } from "react";
import "./MessageChat.css";
import Loader from "react-loader-spinner";
import { getMessages, sendMessage } from "../../../services/backGo/Chats";
import Emblem from "../../emblem/Emblem";
import ChatSettings from "../settingchat/ChatSettings";
import { IoMdCloseCircle, IoMdSettings } from "react-icons/io";
import { Grid, Typography } from "@mui/material";

export default function MessageChat({
  openedWindow,
  to,
  chatID,
  NotifyA,
  handleOpenChat,
  handleCloseChat,
  activeTab,
  chat,
  handleStatusChange,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [opened, setOpened] = useState(openedWindow);
  const id = window.localStorage.getItem("_id");
  const token = window.localStorage.getItem("token");
  const Avatar = window.localStorage.getItem("avatar");
  const [socket, setSocket] = useState(null);
  const [NotifyState, setNotifyState] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [showSettings, setShowSettings] = useState(false); // Estado para mostrar configuración

  const messagesEndRef = useRef(null);

  

  useEffect(() => {

    const connectWebSocket = () => {
      const REACT_APP_BACKCHATWS = process.env.REACT_APP_BACKCOMMERCIALWS;
      const newSocket = new WebSocket(
        `${REACT_APP_BACKCHATWS}/ws/chat/${chatID}/${token}`
      );

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.action === "new_message") {
          setMessages((prevMessages) => [
            ...prevMessages,
            receivedMessage.message,
          ]);
        }
      };

      newSocket.onopen = () => {
        console.log("WebSocket connected");
      };

      setSocket(newSocket);

      return () => {
        newSocket.close();
        console.log("WebSocket disconnected");
      };
    };

    if (opened && !socket) {
      connectWebSocket();
    }
  }, [opened, chatID, token]);
  useEffect(() => {
    setNotifyState(NotifyA === id);

    const fetchData = async () => {
      try {
        const data = await getMessages(token, to.ID);
        if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (opened) {
      fetchData();
    }
  }, [opened]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const closeSettings = () => setShowSettings(false);
  async function handleSendMessage() {
    try {
      if (message.trim() !== "") {
        const response = await sendMessage(token, to.ID, message);
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  function formatHour(dateString) {
    const date = new Date(dateString);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return `${hour}:${minutes < 10 ? "0" + minutes : minutes}`;
  }
  function formatDate(dateString) {
    const messageDate = new Date(dateString);
    const today = new Date();
    const dayOfWeek = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    const diffTime = today - messageDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return "hoy";
    } else if (diffDays === 1) {
      return "ayer";
    } else if (diffDays < 7) {
      return dayOfWeek[messageDate.getDay()];
    } else {
      return `${messageDate.getDate()}/${messageDate.getMonth() + 1
        }/${messageDate.getFullYear()}`;
    }
  }

  return (
    <div className="message-chat-body">
      {opened && (
        <div className="messagechat-opened">
          <div

            className="messagechat-opened-close"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="navbar-image-avatar">
                {!imageLoaded && (
                  <div className="image-placeholder">
                    <Loader
                      type="TailSpin"
                      color="#ff60b2"
                      height={20}
                      width={20}
                    />
                  </div>
                )}
                <img
                  src={to.Avatar}
                  alt=""
                  onLoad={() => setImageLoaded(true)}
                  style={{ display: imageLoaded ? "block" : "none", height: '50px', width: '50px' }}
                />
              </div>

              <h5 className="ChatUserTo">{to.NameUser}</h5>
              {to.Partner.Active === true && (
                <Emblem
                  chat={true}
                  name="Pinkker Prime"
                  img={
                    "https://www.pinkker.tv/uploads/assets/emblemas/VERIFICADO.jpg"
                  }
                />
              )}
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

              {/* <i
                style={{
                  marginRight: "10px",
                  cursor: "pointer",
                  color: "#ededed",
                  padding: "7px",
                  borderRadius: "3px",
                }}
                className="fas fa-times gray-button"
              /> */}


              <IoMdCloseCircle
                onClick={() => {
                  
                  setOpened(false)
                  handleCloseChat()
                }}
                style={{ color: 'rgb(248, 107, 185)', fontSize: '32px' }}
              />
              {
                !showSettings && (

                  <IoMdSettings style={{ color: 'rgb(248, 107, 185)', fontSize: '32px' }} onClick={(e) => {
                    e.stopPropagation();

                    setShowSettings((prev) => !prev);
                  }} />
                )
              }


            </div>
          </div>
          {showSettings && (
            <ChatSettings
              closeSettings={closeSettings}
              chat={chat}
              to={to}
              chatID={chatID}
              onStatusChange={handleStatusChange}
            />
          )}

          <div
            id="messagechat-messages"
            className="messagechat-opened-messages"
          >
            {messages.length > 0 ? (
              messages?.map((message, index) => (
                <div key={index}>
                  {(index === 0 ||
                    formatDate(message.CreatedAt) !==
                    formatDate(messages[index - 1].CreatedAt)) && (
                      <div className="messagechat-date">
                        <span>{formatDate(message.CreatedAt)}</span>
                      </div>
                    )}
                  <div
                    className={`general-chat-selected-message${message.SenderID === id ? "right" : "left"
                      }`}
                  >
                    {message.SenderID !== id && (
                      <div
                        className="navbar-image-avatar-container"
                        style={{
                          width: "45px",
                          position: "relative",
                          left: "10px",
                          marginRight: "5px",
                        }}
                      >
                        <div className="navbar-image-avatar">
                          {!imageLoaded && (
                            <div className="image-placeholder">
                              <Loader
                                type="TailSpin"
                                color="#ff60b2"
                                height={20}
                                width={20}
                              />
                            </div>
                          )}
                          <img
                            src={to.Avatar}
                            alt=""
                            onLoad={() => setImageLoaded(true)}
                            style={{ display: imageLoaded ? "block" : "none" }}
                          />
                        </div>
                      </div>
                    )}

                    <div
                      className={`general-chat-selected-message-message ${message.SenderID === id ? "own-message" : ""
                        }`}
                        style={{backgroundColor: message.SenderID === id ? '#075e54' : '#16252d' }}
                    >
                      <p>{message.Content}</p>
                      <p className="messagechat-time">
                        {formatHour(message.CreatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader
                  type="TailSpin"
                  color="#ff60b2"
                  height={30}
                  width={30}
                  timeout={3000}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="messagechat-opened-input">
            <input
              id="chat-input"
              type="text"
              value={message}
              className="message-chat-send-input"
              placeholder="Enviar un mensaje"
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              autoComplete="off"
            />
            {/* <button
              style={{ marginRight: "3px" }}
              className="config-button"
              onClick={handleSendMessage}
            >
              <i className="fas fa-paper-plane" />
            </button> */}
            <button
                onClick={handleSendMessage}
                type="submit"
                className="button-enviar"
                style={{width: '6%'}}
              >
                Enviar
              </button>
          </div>
        </div>
      )}
      <div
        onClick={() => {
       
            setOpened(true);
          handleOpenChat();
          
        }}
        className="messagechat-closed"
      >
        <div className="messagechat-InfoUserTo">
          <div
            style={{
              margin: "10px",
              fontSize: "5px",
            }}
          >
            {to.Partner.Active === true && (
              <Emblem
                chat={true}
                name="Pinkker Prime"
                img={
                  "https://www.pinkker.tv/uploads/assets/emblemas/VERIFICADO.jpg"
                }
              />
            )}
          </div>

          {NotifyState && <span className="messagechat-InfoUserTo-noti"></span>}
          <div style={{width:'100%'}}>

            <h5 style={{ color: "#ededed",  fontSize: '18px' }}>{to.NameUser}</h5>
            <Grid style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
              <Typography style={{ color: "#ededed", fontSize: '14px' }}>Hola..</Typography>
              <Typography style={{ color: "#ededed", fontSize: '14px' }}>1d</Typography>
            </Grid>
          </div>

          <div className="navbar-image-avatar-messagechat">
            {!imageLoaded && (
              <div className="image-placeholder">
                <Loader
                  type="TailSpin"
                  color="#ff60b2"
                  height={20}
                  width={20}
                />
              </div>
            )}
            <img
              src={to.Avatar}
              alt=""
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
