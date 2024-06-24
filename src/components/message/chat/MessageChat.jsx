import React, { useState, useEffect } from "react";
import "./MessageChat.css";
import Loader from "react-loader-spinner";
import { getMessages, sendMessage } from "../../../services/backGo/Chats";

export default function MessageChat({
  closeMessageChat,
  openedWindow,
  to,
  selectedUser,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [opened, setOpened] = useState(openedWindow);
  let id = window.localStorage.getItem("_id");
  let token = window.localStorage.getItem("token");

  useEffect(() => {
    if (opened) {
      const fetchData = async () => {
        try {
          const data = await getMessages(token, id, to);
          console.log(data);
          if (data != null && data != undefined) {
            setMessages(data);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchData();
    }
  }, [opened, to]);

  async function handleSendMessage() {
    if (!selectedUser) {
      console.error("No user selected to send message to.");
      return;
    }

    try {
      let id = window.localStorage.getItem("_id");
      const response = await sendMessage(token, id, selectedUser._id, message);
      console.log("Message sent:", response);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  function formatHour(dateString) {
    const date = new Date(dateString);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    if (minutes < 10) {
      return `${hour}:0${minutes}`;
    } else {
      return `${hour}:${minutes}`;
    }
  }

  function handleOpened() {
    setOpened(true);
  }

  function getType() {
    if (opened) {
      return (
        <div className="messagechat-opened">
          <div
            onClick={() => setOpened(false)}
            className="messagechat-opened-close"
          >
            <h5 style={{ color: "#ededed", marginLeft: "10px" }}>{to}</h5>
            <i
              onClick={() => closeMessageChat(to)}
              style={{
                marginRight: "10px",
                cursor: "pointer",
                color: "#ededed",
                padding: "7px",
                borderRadius: "3px",
              }}
              className="fas fa-times gray-button"
            />
          </div>
          <div
            id="messagechat-messages"
            className="messagechat-opened-messages"
          >
            {messages != null ? (
              messages.map((message, index) => (
                <div key={index}>
                  {index === 0 && (
                    <div className="messagechat-date">
                      <h3
                        style={{
                          color: "white",
                          fontSize: "11px",
                          backgroundColor: "rgba(27, 27, 27, 0.366)",
                          padding: "3px",
                          width: "50px",
                          borderRadius: "3px",
                          margin: "0 auto",
                          marginTop: "3px",
                        }}
                      >
                        hoy
                      </h3>
                    </div>
                  )}
                  <div
                    style={{
                      justifyContent: message._id === id && "right",
                      color: "#ededed",
                    }}
                    className="general-chat-selected-message"
                  >
                    {message._id !== id && (
                      <div
                        style={{
                          width: "45px",
                          position: "relative",
                          left: "10px",
                          marginRight: "5px",
                        }}
                        className="navbar-image-avatar-container"
                      >
                        <div
                          style={{ backgroundColor: "transparent" }}
                          className="navbar-image-avatar"
                        >
                          <img src={message.avatar} alt="" />
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        backgroundColor:
                          message._id === id ? "#005246" : "#363638",
                        display: "flex",
                        marginLeft: "5px",
                      }}
                      className="general-chat-selected-message-message"
                    >
                      <p>{message.message}</p>
                      <p className="messagechat-time">
                        {formatHour(message.createdAt)}
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
          </div>
          <div className="messagechat-opened-input">
            <input
              id="chat-input"
              type="text"
              value={message}
              className="message-chat-send-input"
              placeholder="Enviar un mensaje"
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
            />
            <button
              style={{ marginRight: "3px" }}
              className="config-button"
              onClick={() => handleSendMessage()}
            >
              <i className="fas fa-paper-plane" />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div onClick={() => handleOpened()} className={"messagechat-closed"}>
          <h5 style={{ color: "#ededed", marginLeft: "10px" }}>{to}</h5>
          <i
            onClick={() => closeMessageChat(to)}
            style={{
              marginRight: "10px",
              cursor: "pointer",
              color: "#ededed",
              padding: "7px",
              borderRadius: "3px",
            }}
            className="fas fa-times gray-button"
          />
        </div>
      );
    }
  }

  return (
    <div className={opened ? "message-chat-body-window" : "message-chat-body"}>
      {getType()}
    </div>
  );
}
