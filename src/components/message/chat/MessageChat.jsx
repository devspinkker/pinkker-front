import React, { useState, useEffect, useRef } from "react";
import "./MessageChat.css";
import Loader from "react-loader-spinner";
import { getMessages, sendMessage } from "../../../services/backGo/Chats";
import Emblem from "../../emblem/Emblem";

export default function MessageChat({ openedWindow, to, chatID }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [opened, setOpened] = useState(openedWindow);
  const id = window.localStorage.getItem("_id");
  const token = window.localStorage.getItem("token");
  const Avatar = window.localStorage.getItem("avatar");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null); // Referencia para el final de los mensajes

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
    const fetchData = async () => {
      try {
        const data = await getMessages(token, id, to.ID);
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
  }, [opened, to, id, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function handleSendMessage() {
    try {
      if (message.trim() !== "") {
        // Verificar que el mensaje no esté vacío
        const response = await sendMessage(token, id, to.ID, message);
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

  function getType() {
    if (opened) {
      return (
        <div className="messagechat-opened">
          <div
            onClick={() => setOpened(false)}
            className="messagechat-opened-close"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h5 style={{ color: "#ededed", margin: "0px 10px" }}>
                {to.NameUser}
              </h5>
              {to.Partner.Active === true && (
                <Emblem
                  chat={true}
                  name="Pinkker Prime"
                  img={
                    "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404309/Emblemas/VERIFICADO_rlbuwi.jpg"
                  }
                />
              )}
            </div>

            <i
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
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index}>
                  {index === 0 && (
                    <div className="messagechat-date">
                      <h3>hoy</h3>
                    </div>
                  )}
                  <div
                    className={`general-chat-selected-message${
                      message.SenderID === id ? "right" : "left"
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
                          <img src={to.Avatar} alt="" />
                        </div>
                      </div>
                    )}
                    {message.SenderID === id && (
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
                          <img src={Avatar} alt="" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`general-chat-selected-message-message ${
                        message.SenderID === id ? "own-message" : ""
                      }`}
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
            {/* Elemento vacío para scroll al final */}
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
                  e.preventDefault(); // Evitar el comportamiento por defecto
                  handleSendMessage(); // Llamar a la función para enviar el mensaje
                }
              }}
              autoComplete="off"
            />
            <button
              style={{ marginRight: "3px" }}
              className="config-button"
              onClick={handleSendMessage}
            >
              <i className="fas fa-paper-plane" />
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div onClick={() => setOpened(true)} className={"messagechat-closed"}>
          <div className="messagechat-InfoUserTo">
            <h5 style={{ color: "#ededed", marginLeft: "5px" }}>
              {to.NameUser}
            </h5>
            <div className="navbar-image-avatar-messagechat">
              <img src={to.Avatar} alt="" />
            </div>
          </div>
          {to.Partner.Active === true && (
            <Emblem
              chat={true}
              name="Pinkker Prime"
              img={
                "https://res.cloudinary.com/dcj8krp42/image/upload/v1709404309/Emblemas/VERIFICADO_rlbuwi.jpg"
              }
            />
          )}
        </div>
      );
    }
  }

  return <div className={"message-chat-body"}>{getType()}</div>;
}
