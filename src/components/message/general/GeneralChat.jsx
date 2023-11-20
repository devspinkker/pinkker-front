import React, { useState, useEffect } from "react";

import "./GeneralChat.css";

import { useSelector } from "react-redux";

import {
  getMessages,
  getGeneralMessages,
  sendMessage,
} from "../../../services/messages";

export default function GeneralChat() {
  const [type, setType] = useState(0);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [messages, setMessages] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState(null);

  const [dataUsed, setDataUsed] = useState(false);

  useEffect(() => {
    if (dataUsed === false) {
      const fetchData = async () => {
        const data = await getGeneralMessages(token);
        if (data != null && data != undefined) {
          setMessages(data);
          setDataUsed(true);
        }
      };
      fetchData();
    }
  }, [token]);

  function getLeftForType() {
    if (type === 0) {
      return "45px";
    }

    if (type === 1) {
      return "190px";
    }

    if (type === 2) {
      return "323px";
    }
  }

  async function handleClick(user) {
    setSelectedUser(user);

    const data = await getMessages(token, user.name);
    if (data != null && data != undefined) {
      setSelectedMessages(data);
    }
  }

  const [message, setMessage] = useState(null);

  const reloadData = async () => {
    const data = await getMessages(token, selectedUser.name);
    if (data != null && data != undefined) {
      setSelectedMessages(data);
    }
  };

  async function handleSendMessage() {
    await sendMessage(token, selectedUser.name, message);
    setMessage("");
    reloadData();
  }

  const onKeyPressInput = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  function renderPrimary() {
    return (
      <div className="general-chat-primary">
        <div className="general-chat-primary-profile">
          <h3>asd123</h3>
          <i
            style={{ marginLeft: "5px", marginTop: "3px" }}
            class="fas fa-angle-down"
          ></i>
        </div>
        <div
          style={{
            justifyContent: "center",
            width: "100%",
            margin: "0",
            borderTop: "0.01em solid #2b2b2b3f",
          }}
          className="type-set"
        >
          <div
            onClick={() => setType(0)}
            className={type === 0 ? "type-card active" : "type-card"}
          >
            <h3>Principal</h3>
          </div>
          <div
            onClick={() => setType(1)}
            className={type === 1 ? "type-card active" : "type-card"}
          >
            <h3>General</h3>
          </div>
          <div
            style={{ width: "120px" }}
            onClick={() => setType(2)}
            className={type === 2 ? "type-card active" : "type-card"}
          >
            <h3>Solicitudes (2)</h3>
          </div>
          <div style={{ left: getLeftForType() }} className="type-line"></div>
        </div>

        <div className="general-chat-card-container">
          {messages &&
            messages.map((message) => {
              return (
                <div
                  onClick={() => handleClick(message)}
                  className="general-chat-card"
                >
                  <div>
                    <img
                      style={{
                        backgroundColor: "#f36196",
                        width: "40px",
                        height: "40px",
                      }}
                      className="avatar-only-head"
                      src={message.avatar}
                    />
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <h3>{message.name}</h3>
                    <p>{message.message}</p>
                  </div>

                  <div style={{ width: "65%", textAlign: "right" }}>
                    <h3
                      style={{
                        fontSize: "14px",
                        position: "relative",
                        top: "-10px",
                      }}
                    >
                      {formatHour(message.createdAt)}
                    </h3>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
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

  function renderMessageSelected() {
    return (
      <div className="general-chat-selected">
        <div className="general-chat-selected-profile">
          <img className="avatar-only-head" src={selectedUser.avatar} alt="" />
          <h3>{selectedUser.name}</h3>
        </div>

        <div className="general-chat-selected-messages">
          <div style={{ width: "100%" }}>
            {selectedMessages &&
              selectedMessages.map((message, index) => {
                return (
                  <div>
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
                        justifyContent: message.name === user.name && "right",
                      }}
                      className="general-chat-selected-message"
                    >
                      {message.name != user.name && (
                        <div>
                          <img
                            className="avatar-only-head"
                            src={message.avatar}
                            alt=""
                          />
                        </div>
                      )}
                      <div
                        style={{
                          backgroundColor:
                            message.name === user.name ? "#005246" : "#363638",
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
                );
              })}
          </div>
        </div>

        <div className="general-chat-selected-input">
          <i
            style={{ width: "40px", textAlign: "center" }}
            class="fas fa-smile"
          ></i>
          <input
            type="text"
            value={message}
            placeholder="Enviar un mensaje"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(event) => onKeyPressInput(event)}
          />
        </div>
      </div>
    );
  }

  function renderSecondary() {
    return (
      <div className="general-chat-secondary">
        {selectedMessages === null ? (
          <div style={{ textAlign: "center" }}>
            <i
              style={{ fontSize: "34px", marginBottom: "10px" }}
              class="fas fa-envelope-open-text"
            />
            <h3>Tus mensajes</h3>
            <p
              style={{
                color: "darkgray",
                fontSize: "13px",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              Envía fotos y mensajes privados a un amigo o grupo.
            </p>
            <button className="chat-button-view-chat">Enviar mensaje</button>
          </div>
        ) : (
          renderMessageSelected()
        )}
      </div>
    );
  }

  return (
    <div className="general-chat-body">
      <div className="general-chat-container">
        {renderPrimary()}

        {renderSecondary()}
      </div>
    </div>
  );
}
