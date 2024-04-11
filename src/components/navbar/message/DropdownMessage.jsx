import React, { useState, useEffect, useRef, useCallback } from "react";
import "./DropdownMessage.css";

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import { getGeneralMessages } from "../../../services/messages";
import { ScaleLoader } from "react-spinners";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function DropdownMessage({ closeNavbar, handleMessage }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const divRef = useRef();
  const handler = useCallback(() => setClick(true), []);
  useOnClickOutside(divRef, handler);

  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGeneralMessages(token);
      if (data != null && data != undefined) {
        setMessages(data);
      }
    };
    fetchData();
  }, [token]);

  function dateStringSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const day = 1000 * 60 * 60 * 24;
    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % day) / (1000 * 60));
    const seconds = Math.floor((diff % day) / 1000);
    if (days > 0) {
      return days + " d";
    } else if (hours > 0) {
      return hours + " h";
    } else if (minutes > 0) {
      return minutes + " min";
    } else if (seconds > 0) {
      return seconds + " sec";
    } else {
      return "just now";
    }
  }

  function openHandleMessage(to) {
    handleMessage(to);
    handleClick();
  }

  const renderMessages = (message) => {
    if (message.name === user.name) {
      return (
        <li onClick={() => openHandleMessage(message.to)}>
          <div className="dropdownmessage-news-card">
            <div>
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
            </div>
            <div style={{ marginLeft: "5px", width: "90%" }}>
              <h3>{message.to}</h3>
              {message.viewed === false && (
                <p>
                  {" "}
                  <a style={{ color: "darkgray" }}>
                    Enviado hace {dateStringSince(message.createdAt)}
                  </a>
                </p>
              )}
              {message.viewed === true && (
                <p>
                  {" "}
                  <a style={{ color: "darkgray" }}>
                    Visto hace {dateStringSince(message.viewedDate)}
                  </a>
                </p>
              )}
            </div>
          </div>
        </li>
      );
    }

    return (
      <li
        style={{ paddingLeft: "5px" }}
        onClick={() => openHandleMessage(message.name)}
      >
        <div className="dropdownmessage-news-card">
          <div>
            <div
              style={{ width: "45px", position: "relative" }}
              className="navbar-image-avatar-container"
            >
              <div
                style={{ backgroundColor: "transparent", width: "45px" }}
                className="navbar-image-avatar"
              >
                <a href={"/" + message.name}>
                  <img
                    style={{ backgroundColor: "#080809" }}
                    src={message.avatar}
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "5px", width: "90%" }}>
            <h3>{message.name}</h3>
            <p>
              {" "}
              <a style={{ fontWeight: "600", letterSpacing: "0.7px" }}>
                {message.message}
              </a>{" "}
              •{" "}
              <a style={{ color: "darkgray" }}>
                {dateStringSince(message.createdAt)}
              </a>
            </p>
          </div>
          {message.viewed === false && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "34px",
                color: "#f36196",
                marginRight: "20px",
              }}
            >
              •
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <>
      <ul
        ref={divRef}
        className={
          click ? "dropdownmessage-menu clicked" : "dropdownmessage-menu"
        }
      >
        <div style={{ width: "99%" }} className="dropdowncomunidad-container">
          <div
            className="dropdowns-title-container"
            style={{ borderBottom: "1px solid #4b4b4b8f" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", height: "15px" }}
              className="dropdownchatconfig-link"
              onClick={closeNavbar}
            >
              <h3 style={{ width: "85%" }}>Mensajes directos</h3>
              <i
                onClick={handleClick}
                style={{
                  marginLeft: "10px",
                  marginTop: "3px",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
                class="fas fa-times pinkker-button-more"
              ></i>
            </div>
          </div>

          <div className="dropdownmessage-input">
            <i style={{ fontSize: "12px" }} class="fas fa-search" />
            <input className="" type="text" />
          </div>

          <div style={{ height: "175px" }}>
            {messages != null &&
              messages.length > 0 &&
              messages.map((message) => renderMessages(message))}
            {messages === null && (
              <div
                style={{
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScaleLoader width={4} height={20} color="#f36197d7" />
              </div>
            )}

            {messages != null && messages.length === 0 && (
              <div
                style={{
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img style={{ width: "100px" }} src="/images/no-mensajes.png" />
              </div>
            )}
          </div>

          <Link style={{ textDecoration: "none" }} to="/direct/inbox">
            <li style={{ borderTop: "1px solid #4b4b4b8f" }}>
              <div
                style={{ color: "#f36196" }}
                className="dropdownchatconfig-link"
                onClick={closeNavbar}
              >
                Ver más
                <i
                  style={{ marginLeft: "10px", marginTop: "3px" }}
                  class="fas fa-angle-down"
                ></i>
              </div>
            </li>
          </Link>
        </div>
      </ul>
    </>
  );
}

export default DropdownMessage;
