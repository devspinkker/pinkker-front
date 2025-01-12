import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Input.css";

import DropdownChatConfig from "./dropdown/config/DropdownChatConfig";
import DropdownEmotes from "./dropdown/emotes/DropdownEmotes";

import { useNotification } from "../../Notifications/NotificationProvider";

import { getAllEmotes } from "../../../services/emotes";

import { useSelector } from "react-redux";
import DropdownCommands from "./dropdown/commands/DropdownCommands";
import DropdownRules from "./dropdown/rules/DropdownRules";
import DropdownPoints from "./dropdown/points/DropdownPoints";
import DropdownChatIdentity from "./dropdown/identity/DropdownChatIdentity";
import Loader from "react-loader-spinner";
import reactStringReplace from "react-string-replace";

import Auth from "../../auth/Auth";
import Tippy from "@tippyjs/react";
import Emote from "../../emote/Emote";

import Emblem from "../../emblem/Emblem";

import BetDropdown from "./dropdown/bet/BetDropdown";

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

const Input = ({
  isMobile,
  betRanking,
  bets,
  dropdownBet,
  setDropdownBet,
  childFunc,
  replyUser,
  socketMain,
  handleAnnounce,
  streamer,
  chatData,
  userMod,
  userVip,
  userBan,
  reply,
  message,
  setMessage,
  sendMessage,
  changeTextSize,
  setChatOff,
  chatOff,
  callback,
  changeColor,
  reloadBets,
}) => {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [lastMessage, setLastMessage] = useState(null);

  const rules = localStorage.getItem("rules");

  const [dropdownChatConfig, setDropdownChatConfig] = useState(false);
  const [dropdownEmotes, setDropdownEmotes] = useState(false);
  const [dropdownCommands, setDropdownCommands] = useState(false);
  const [dropdownRules, setDropdownRules] = useState(false);
  const [dropdownPoints, setDropdownPoints] = useState(false);
  const [dropdownChatIdentity, setDropdownChatIdentity] = useState(false);

  const [showPopupAuth, setShowPopupAuth] = useState(false);

  const [onHoverInput, setHoverInput] = useState(false);

  const [delay, setDelay] = useState(0);
  const [delayError, setDelayError] = useState(false);
  const [lastMessageError, setLastMessageError] = useState(false);

  const [clickSlow, setClickSlow] = useState(false);

  const alert = useNotification();

  const [emotes, setEmotes] = useState(null);

  const [sumatoria, setSumatoria] = useState(0);

  const [indexHover, setIndexHover] = useState(0);

  const [incrementPoints, setIncrementPoints] = useState(false);
  const [incrementPoints2, setIncrementPoints2] = useState(false);

  const [points, setPoints] = useState(0);

  const [mouseEnterInput, setMouseEnterInput] = useState(false);
  const [divHeight, setDivHeight] = useState(20);
  const [textLength, setTextLength] = useState(140);

  const [buttonEnabled, setButtonEnabled] = useState(true);

  const [uniqueChat, setUniqueChat] = useState(null);
  const [onlyEmotes, setOnlyEmotes] = useState(null);
  const [onlySuscriber, setOnlySuscriber] = useState(null);
  const [onlyFollowers, setOnlyFollowers] = useState(null);

  const [width, setWidth] = useState(100);
  const moderatorMessage = localStorage.getItem("moderatorMessage");
  const [intervalID, setIntervalID] = useState(null);

  const [inputWithEmote, setInputWithEmote] = useState(false);

  function togglePopupAuth() {
    setShowPopupAuth(!showPopupAuth);
  }

  function toggleReply(e) {
    document.getElementById("chat-input").textContent =
      "@" + replyUser + " " + message;
    setMessage("@" + replyUser + " " + message);
  }

  React.useEffect(() => {
    childFunc.current = toggleReply;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllEmotes(token);
      if (data != null && data != undefined) {
        setEmotes(data);
      }
    };
    fetchData();

    document
      .querySelector("[contenteditable]")
      .addEventListener("paste", function (e) {
        e.preventDefault();
        var text = "";
        if (e.clipboardData && e.clipboardData.getData) {
          text = e.clipboardData.getData("text/plain");
        } else if (window.clipboardData && window.clipboardData.getData) {
          text = window.clipboardData.getData("Text");
        }
        alert(text);

        document.execCommand("insertHTML", false, text);
      });
  }, [token]);

  useEffect(() => {
    if (userMod === true) {
      if (width === 0) {
        localStorage.setItem("moderatorMessage", "true");
      }
    }
  }, [userMod, width]);

  const handleStartTimer = () => {
    const id = setInterval(() => {
      setWidth((prev) => {
        if (prev <= 100) {
          return prev - 0.5;
        }
        clearInterval(id);
        return prev;
      });
    }, 20);

    setIntervalID(id);
  };

  useEffect(() => {
    if (userMod === true) {
      if (moderatorMessage != "true") {
        handleStartTimer();
      }
    }
  }, [userMod]);

  useEffect(() => {
    if (chatData != null) {
      setUniqueChat(chatData.uniqueChat);
      setOnlyEmotes(chatData.onlyEmotes);
      setOnlySuscriber(chatData.onlySuscriber);
      setOnlyFollowers(chatData.onlyFollowers);
    }
  }, [chatData]);

  useEffect(() => {
    if (delay != 0) {
      const interval = setInterval(() => {
        setDelay(delay - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [delay]);

  const onMouseEnterChatConfig = () => {
    if (dropdownChatConfig === true) {
      setDropdownChatConfig(false);
    } else {
      setDropdownChatConfig(true);
    }
  };

  const onMouseEnterEmotes = () => {
    if (dropdownEmotes === true) {
      setDropdownEmotes(false);
    } else {
      setDropdownEmotes(true);
    }
  };

  const onMouseEnterCommands = () => {
    if (dropdownCommands === true) {
      setDropdownCommands(false);
    } else {
      setDropdownCommands(true);
    }
  };

  const onMouseEnterRules = () => {
    if (dropdownRules === true) {
      setDropdownRules(false);
    } else {
      setDropdownRules(true);
    }
  };

  const onMouseEnterPoints = () => {
    if (dropdownPoints === true) {
      setDropdownPoints(false);
    } else {
      setDropdownPoints(true);
    }
  };

  const onMouseEnterChatIdentity = () => {
    if (dropdownChatIdentity === true) {
      setDropdownChatIdentity(false);
    } else {
      setDropdownChatIdentity(true);
    }
  };

  const divRef = useRef();
  const handler = useCallback(() => setHoverInput(false), []);
  useOnClickOutside(divRef, handler);

  function getBackgroundColorPrime() {
    if (user.color === "#D500FF") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677784906/naming/colaborador_qwwmv6.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }

    if (user.color === "#FF0000") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825934/naming/admin1_mhgt70.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }

    if (user.color === "#82CD00") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825961/naming/moderador_hx3n6w.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }
  }

  function addIncrementPoints(newpoints) {
    setTimeout(() => {
      setIncrementPoints(true);
      handleAnnounce();

      let start = 0;

      const end = parseInt(newpoints);
      if (start === end) return;

      let totalMilSecDur = parseInt(2);
      let incrementTime = (totalMilSecDur / end) * 1000;

      let timer = setInterval(() => {
        start += 1;
        user.coins += 1;
        if (start === end) clearInterval(timer);
      }, incrementTime);

      setPoints(newpoints);

      setTimeout(() => {
        setIncrementPoints(false);
        setIncrementPoints2(true);

        setTimeout(() => {
          setIncrementPoints2(false);
        }, 3000);
      }, 3000);
    }, 11000);
  }

  const isHTML = (str) =>
    !(str || "")
      .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, "")
      .replace(/(<([^>]+)>)/gi, "")
      .trim();

  function handleSendMessage() {
    if (message === "") {
      alert({ type: "ERROR", message: "Completa el mensaje" });
      return;
    }

    if (textLength <= 0) {
      alert({
        type: "ERROR",
        message: "Te excendiste del límite de caracteres.",
      });
      return;
    }

    if (!isLogged) {
      togglePopupAuth();
      return;
    }

    if (onlyEmotes && !message.startsWith("/")) {
      if (!isHTML(message)) {
        return;
      }
    }

    if (onlyFollowers) {
      if (user.name != streamer) {
        if (!user.following.filter((e) => e.name === streamer).length > 0) {
          return;
        }
      }
    }

    /*var area = document.getElementById("chat-input");
      while (area.firstChild) {
          area.removeChild(area.firstChild);
      }*/

    if (delay === 0) {
      if (message.includes("/")) {
        setLastMessage(message);
        sendMessage();
        setTextLength(140);
        var area = document.getElementById("chat-input");
        while (area.firstChild) {
          area.removeChild(area.firstChild);
        }
        return;
      }

      if (uniqueChat === true) {
        if (lastMessage === message) {
          setLastMessageError(true);
          setDelay(30);

          setTimeout(() => {
            setDelay(0);
            setDelayError(false);
            setLastMessageError(false);
          }, 30000);

          return;
        }
      }

      setLastMessage(message);
      sendMessage();
      setTextLength(140);

      var area = document.getElementById("chat-input");
      while (area.firstChild) {
        area.removeChild(area.firstChild);
      }

      if (!message.includes("/")) {
        setDelay(chatData.slow);
      }

      setTimeout(() => {
        setDelay(0);
        setDelayError(false);
      }, chatData.slow * 1000);
    } else {
      if (lastMessageError != true) {
        setDelayError(true);
      }
    }
  }

  function handleChangeColor(color) {
    if (!isLogged) {
      togglePopupAuth();
      return;
    }

    if (delay === 0) {
      setLastMessage(message);
      changeColor(color);
      if (!message.includes("/")) {
        setDelay(chatData.slow);
      }

      setTimeout(() => {
        setDelay(0);
        setDelayError(false);
      }, chatData.slow * 1000);
    }
  }

  const onChangeInput = (event) => {
    /*if(rules != 'true') {
      return;
    }*/

    const el = document.getElementById("chat-input");
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.addRange(range);
    el.focus();

    /*var clientHeight = document.getElementById('chat-input').clientHeight;
    setDivHeight(clientHeight);
    */
    let text = event.target.innerHTML;
    setTextLength(140 - text.length);

    if (textLength <= 0) {
      setButtonEnabled(false);
    }
    if (textLength > 0) {
      setButtonEnabled(true);
    }

    if (onlyEmotes) {
      if (!isHTML(text)) {
        setButtonEnabled(false);
      } else {
        setButtonEnabled(true);
      }
    }

    text = text.replace(/<div>/g, "");
    text = text.replace(/<\/div>/g, "");
    text = text.replace(/<br>/g, "");

    if (text.includes("&lt;")) {
      while (text.includes("&lt;")) {
        text = text.replace("&lt;", "<");
      }
    }

    if (text.includes("&gt;")) {
      while (text.includes("&gt;")) {
        text = text.replace("&gt;", ">");
      }
    }

    if (text.includes("&amp;")) {
      while (text.includes("&amp;")) {
        text = text.replace("&amp;", "&");
      }
    }

    if (text.includes("&quot;")) {
      while (text.includes("&quot;")) {
        text = text.replace("&quot;", '"');
      }
    }

    if (text.includes("&apos;")) {
      while (text.includes("&apos;")) {
        text = text.replace("&apos;", "'");
      }
    }

    if (text.startsWith("/") && !text.includes(" ")) {
      setDropdownCommands(true);
    } else {
      setDropdownCommands(false);
    }

    if (text.includes("pixels")) {
      const textNumber = parseInt(text.replace(/^\D+/g, ""));
      user.coins -= textNumber;
    }

    setMessage(text);
  };

  function getErrorMessage() {
    if (moderatorMessage != "true" && userMod === true) {
      return (
        <div
          style={{
            cursor: "pointer",
            height: clickSlow ? "40px" : "90px",
            top: clickSlow ? "-62px" : "-112px",
            backgroundColor: "#f36196",
            borderRadius: "3px",
          }}
          className="chat-delay-error"
        >
          <div>
            <div
              style={{
                position: "relative",
                top: clickSlow ? "0px" : "10px",
                justifyContent: "left",
                marginLeft: "25px",
              }}
              className="chat-delay-error-title"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "white",
                    borderRadius: "50px",
                    marginRight: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    style={{
                      backgroundColor: "lightgreen",
                      padding: "3px",
                      borderRadius: "3px",
                    }}
                    class="fas fa-bolt"
                  ></i>
                </div>

                <h4 style={{ fontSize: "13px" }}>
                  {streamer} te ha añadido como <br /> moderador del canal
                </h4>
              </div>
            </div>

            <div className="chat-moderator-bar">
              <div
                style={{ width: width + "%" }}
                className="chat-moderator-bar-content"
              ></div>
            </div>
          </div>
        </div>
      );
    }

    if (chatData === null) {
      return (
        <div style={{ cursor: "pointer" }} className="chat-delay-error">
          <div className="chat-delay-error-title">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Loader
                type="TailSpin"
                color="#ff60b2"
                height={15}
                width={15}
                timeout={3000}
              />
              <h4 style={{ fontSize: "13px", marginLeft: "10px" }}>
                Conectandose al chat!
              </h4>
            </div>
          </div>
        </div>
      );
    }

    if (onlyEmotes) {
      return (
        <div
          style={{
            cursor: "pointer",
            height: clickSlow ? "40px" : "30px",
            top: clickSlow ? "-62px" : "-52px",
          }}
          className="chat-delay-error"
        >
          <div>
            <div
              style={{
                position: "relative",
                top: clickSlow ? "0px" : "10px",
                justifyContent: "left",
                marginLeft: "25px",
              }}
              className="chat-delay-error-title"
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  style={{
                    color: "darkgray",
                    marginRight: "10px",
                    fontSize: "13px",
                  }}
                  class="fas fa-info-circle"
                />
                <h4 style={{ fontSize: "13px" }}>Chat solo emoticonos</h4>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (onlySuscriber) {
      return (
        <div
          style={{
            cursor: "pointer",
            height: clickSlow ? "40px" : "30px",
            top: clickSlow ? "-62px" : "-52px",
          }}
          className="chat-delay-error"
        >
          <div>
            <div
              style={{
                position: "relative",
                top: clickSlow ? "0px" : "10px",
                justifyContent: "left",
                marginLeft: "25px",
              }}
              className="chat-delay-error-title"
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  style={{
                    color: "darkgray",
                    marginRight: "10px",
                    fontSize: "13px",
                  }}
                  class="fas fa-info-circle"
                />
                <h4 style={{ fontSize: "13px" }}>Chat solo suscriptores</h4>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (onlyFollowers) {
      return (
        <div
          style={{
            cursor: "pointer",
            height: clickSlow ? "40px" : "30px",
            top: clickSlow ? "-62px" : "-52px",
          }}
          className="chat-delay-error"
        >
          <div>
            <div
              style={{
                position: "relative",
                top: clickSlow ? "0px" : "10px",
                justifyContent: "left",
                marginLeft: "25px",
              }}
              className="chat-delay-error-title"
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  style={{
                    color: "darkgray",
                    marginRight: "10px",
                    fontSize: "13px",
                  }}
                  class="fas fa-info-circle"
                />
                <h4 style={{ fontSize: "13px" }}>Chat solo seguidores</h4>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (delayError === true) {
      return (
        <div
          style={{
            cursor: "pointer",
            height: clickSlow ? "40px" : "30px",
            top: clickSlow ? "-62px" : "-52px",
          }}
          className="chat-delay-error"
        >
          <div style={{ height: clickSlow ? "30px" : "30px" }}>
            <div
              style={{ position: "relative", top: clickSlow ? "0px" : "10px" }}
              className="chat-delay-error-title"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "85%",
                  textAlign: "center",
                }}
              >
                <i
                  style={{
                    color: "yellow",
                    marginRight: "10px",
                    fontSize: "13px",
                  }}
                  class="fas fa-exclamation-triangle"
                />
                <h4 style={{ fontSize: "13px" }}>Mensaje no enviado!</h4>
              </div>
              <i
                onClick={() => setDelayError(false)}
                style={{
                  color: "#ededed",
                  cursor: "pointer",
                  height: "20px",
                  width: "15px",
                }}
                class="fas fa-times pinkker-button-more"
              />
            </div>
            {clickSlow === true && (
              <p
                style={{
                  color: "darkgray",
                  marginTop: "5px",
                  fontSize: "11.5px",
                }}
              >
                Estás enviando mensajes demasiado rápido.
              </p>
            )}
          </div>
        </div>
      );
    }

    if (lastMessageError === true) {
      return (
        <div
          style={{
            cursor: "pointer",
            height: clickSlow ? "40px" : "30px",
            top: clickSlow ? "-62px" : "-52px",
          }}
          className="chat-delay-error"
        >
          <div style={{ height: clickSlow ? "30px" : "30px" }}>
            <div
              style={{ position: "relative", top: clickSlow ? "0px" : "10px" }}
              className="chat-delay-error-title"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "85%",
                  textAlign: "center",
                }}
              >
                <i
                  style={{
                    color: "yellow",
                    marginRight: "10px",
                    fontSize: "13px",
                  }}
                  class="fas fa-exclamation-triangle"
                />
                <h4 style={{ fontSize: "13px" }}>Mensaje no enviado!</h4>
              </div>
              <i
                onClick={() => setLastMessageError(false)}
                style={{
                  color: "#ededed",
                  cursor: "pointer",
                  height: "20px",
                  width: "15px",
                }}
                class="fas fa-times pinkker-button-more"
              />
            </div>
            {clickSlow === true && (
              <p
                style={{
                  color: "darkgray",
                  marginTop: "5px",
                  fontSize: "11.5px",
                }}
              >
                Este mensaje es identico al mensaje anterior.
              </p>
            )}
          </div>
        </div>
      );
    }

    if (chatData.slow != 2) {
      return (
        <div
          onClick={() => setClickSlow(!clickSlow)}
          style={{ cursor: "pointer" }}
          className="chat-delay-error"
        >
          <div className="chat-delay-error-title">
            <div style={{ display: "flex", alignItems: "center" }}>
              <i
                style={{
                  color: "darkgray",
                  marginRight: "10px",
                  fontSize: "13px",
                }}
                class="fas fa-info-circle"
              />
              <h4 style={{ fontSize: "13px" }}>Modo lento</h4>
            </div>
          </div>
          {clickSlow === true && (
            <p
              style={{ color: "darkgray", marginTop: "5px", fontSize: "12px" }}
            >
              Los usuarios pueden enviar mensajes cada {chatData.slow} segundos.
            </p>
          )}
        </div>
      );
    }
  }

  function getDelayForNewMessage() {
    if (delay != 0) {
      return (
        <button className="button-none">
          <p>Puedes chatear en {delay} s</p>
        </button>
      );
    }
  }

  const onKeyPressInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (dropdownCommands) {
        return;
      }

      if (textLength <= 0) {
        alert({
          type: "ERROR",
          message: "Te excendiste del límite de caracteres.",
        });
        return;
      }

      handleSendMessage();
    }
  };

  const commands = [
    {
      name: "/clear",
      description: "Borrar el historial del chat para todos los espectadores",
      moderator: true,
      streamer: true,
      user: false,
    },
    {
      name: "/mod [username]",
      description: "Asignar estado de moderador a un usuario",
      moderator: false,
      streamer: true,
      user: false,
    },
    {
      name: "/unmod [username]",
      description: "Anular el estado de moderador de un usuario",
      moderator: false,
      streamer: true,
      user: false,
    },
    {
      name: "/ban [username] [reason]",
      description: "Vetar permanentemente a un usuario del chat",
      moderator: true,
      streamer: true,
      user: false,
    },
    {
      name: "/unban [username]",
      description:
        "Anular la expulsión temporal o el veto permanente a un usuario",
      moderator: true,
      streamer: true,
      user: false,
    },
    {
      name: "/vip [username]",
      description: "Asignar estado de VIP a un usuario",
      moderator: false,
      streamer: true,
      user: false,
    },
    {
      name: "/unvip [username]",
      description: "Anular el estado de VIP de un usuario",
      moderator: false,
      streamer: true,
      user: false,
    },
    {
      name: "/slow [segundos]",
      description:
        "Limitar la frecuencia que los usuarios pueden enviar mensajes",
      moderator: true,
      streamer: true,
      user: false,
    },
    {
      name: "/slowoff",
      description: "Desactivar el modo lento",
      moderator: true,
      streamer: true,
      user: false,
    },
    {
      name: "/host [username]",
      description: "Alojar otro stream en tu canal",
      moderator: false,
      streamer: true,
      user: false,
    },
    {
      name: "/color [color]",
      description: "Cambiar tu color de usuario (red, blue, green)",
      moderator: true,
      streamer: true,
      user: true,
    },
    {
      name: "/announcement",
      description: "Enviar a todos los usuarios un anuncio",
      moderator: false,
      streamer: true,
      user: false,
    },
    {
      name: "/emoteonly",
      description: "Restringir los mensajes de chat a solo emoticonos",
      moderator: true,
      streamer: true,
      user: false,
    },
    {
      name: "/emoteonlyoff",
      description: "Desactivar el modo solo emoticonos.",
      moderator: true,
      streamer: true,
      user: false,
    },

    {
      name: "/subscribers",
      description: "Restringir chat a suscriptores.",
      moderator: true,
      streamer: true,
      user: false,
    },

    {
      name: "/subscribersoff",
      description: "Desactivar el modo solo suscriptores.",
      moderator: true,
      streamer: true,
      user: false,
    },

    {
      name: "/uniquechat",
      description:
        "Impedir que los usuarios envien mensajes duplicados en el chat.",
      moderator: true,
      streamer: true,
      user: false,
    },

    {
      name: "/uniquechatoff",
      description: "Desactivar el modo chat unico",
      moderator: true,
      streamer: true,
      user: false,
    },

    {
      name: "/user [username]",
      description: "Mostrar la información del perfil de un usuario del canal",
      moderator: true,
      streamer: true,
      user: false,
    },

    {
      name: "/followers [duration]",
      description:
        "Restringir el chat a seguidores en funcion del tiempo que lleven siéndolo",
      moderator: true,
      streamer: true,
      user: false,
    },

    {
      name: "/followersoff",
      description: "Desactivar el modo solo seguidores.",
      moderator: true,
      streamer: true,
      user: false,
    },
    {
      name: "/bet",
      description: "Crear una apuesta.",
      moderator: false,
      streamer: true,
      user: false,
    },
  ];
  const commandsFilterPerMessage = commands.filter((command) => {
    return command.name.includes(message);
  });

  const onKeyDownInput = (e) => {
    var keyCode = e.keyCode || e.which;

    if (e.key === "Enter") {
      if (dropdownCommands === true) {
        setTimeout(() => {
          e.preventDefault();

          setMessage(commandsFilterPerMessage[indexHover].name);
          document.getElementById("chat-input").textContent =
            commandsFilterPerMessage[indexHover].name;
          const command = commandsFilterPerMessage[indexHover].name;
          const args = command.split(" ");

          const commandName = args[0];

          /*e.target.focus();
          e.target.setSelectionRange(commandName.length + 1, e.target.innerText.length);*/

          const el = document.getElementById("chat-input");
          const selection = window.getSelection();
          const range = document.createRange();
          selection.removeAllRanges();
          range.selectNodeContents(el);
          range.collapse(false);
          selection.addRange(range);
          el.focus();

          setDropdownCommands(false);
        }, 300);
      }
    }

    if (keyCode == "40") {
      if (indexHover < commands.length - 1) {
        e.preventDefault();
        var elem = document.getElementById("dropdowncommands-scroll");
        elem.scrollTop = elem.scrollTop + 40;
        setIndexHover(indexHover + 1);
      } else {
        e.preventDefault();
        var elem = document.getElementById("dropdowncommands-scroll");
        elem.scrollTop = 0;
        setIndexHover(0);
      }

      return false;
    }
    if (keyCode == "38") {
      if (indexHover > 0) {
        e.preventDefault();
        var elem = document.getElementById("dropdowncommands-scroll");
        elem.scrollTop = elem.scrollTop - 40;

        setIndexHover(indexHover - 1);
      } else {
        e.preventDefault();
        var elem = document.getElementById("dropdowncommands-scroll");
        elem.scrollTop = elem.scrollHeight;
        setIndexHover(commands.length - 1);
      }

      return false;
    }
  };

  function getMarginTop() {
    if (
      delayError === false &&
      chatData != null &&
      lastMessageError === false
    ) {
      return "36px";
    }

    if (delayError === true) {
      return "-10px";
    }

    if (lastMessageError === true) {
      return "10px";
    }

    if (clickSlow) {
      return "-19px";
    }

    if (chatData === null) {
      return "8px";
    }
  }

  function surroundSelection(textBefore, textAfter) {
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        var startNode = range.startContainer,
          startOffset = range.startOffset;
        var boundaryRange = range.cloneRange();
        var startTextNode = document.createTextNode(textBefore);
        var endTextNode = document.createTextNode(textAfter);
        boundaryRange.collapse(false);
        boundaryRange.insertNode(endTextNode);
        boundaryRange.setStart(startNode, startOffset);
        boundaryRange.collapse(true);
        boundaryRange.insertNode(startTextNode);

        // Reselect the original text
        range.setStartAfter(startTextNode);
        range.setEndBefore(endTextNode);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  function handleClickSendMessage(e) {
    setMessage(e.name);
    document.getElementById("chat-input").textContent = e.name;

    const command = e.name;
    const args = command.split(" ");
    const commandName = args[0];

    const el = document.getElementById("chat-input");
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.addRange(range);
    el.focus();

    //document.getElementById("chat-input").focus();
    //surroundSelection("test", "/test")

    setDropdownCommands(false);
  }

  function handleClickInput() {
    if (rules != "true") {
      setDropdownRules(true);
    }

    setMouseEnterInput(true);
    setHoverInput(true);
  }

  function onClickEmoticon(emote) {
    var img = new Image();
    img.src = emote.image;
    img.className = "input-emote-div";

    let imgToString = `<img src="${emote.image}" class="input-emote-div">`;

    img.onload = function () {
      if (inputWithEmote === false) {
        setInputWithEmote(true);
      }

      document.querySelector("[contenteditable]").appendChild(img);

      let element = document.getElementById("chat-input");
      element.dispatchEvent(new Event("input", { bubbles: true }));

      setTextLength(textLength + (imgToString.length - 1));

      if (message === "") {
        setMessage(message + `<img src="${emote.image}">`);
      }

      if (message.includes("<img ")) {
        setMessage(message + `<img src="${emote.image}">`);
      }
    };
  }

  function getHeightFromDiv() {
    if (divHeight === 20) {
      return "-20px";
    }
    if (divHeight === 37) {
      return "47px";
    }

    if (divHeight === 43) {
      return "45px";
    }

    return "50px";
  }

  function getColorFromLength() {
    if (textLength >= 120) {
      return "lightgreen";
    }

    if (textLength < 120 && textLength >= 80) {
      return "green";
    }

    if (textLength < 80 && textLength >= 40) {
      return "orange";
    }

    if (textLength < 120 && textLength >= 15) {
      return "red";
    }

    return "red";
  }

  function getIdentityEmblem() {
    return (
      <a>
        {user.Partner.active === true && (
          <Emblem
            chat={true}
            name="Pinkker Prime"
            img={
              "https://www.pinkker.tv/uploads/assets/pinkkerprime.png"
            }
          />
        )}
        {user.name === streamer && (
          <Emblem chat={true} name="Emisor" img={"/images/emblem/emisor.jpg"} />
        )}
        {userMod && (
          <Emblem
            chat={true}
            name="Moderador"
            img={"/images/emblem/moderador.jpg"}
          />
        )}
        {userVip && (
          <Emblem chat={true} name="VIP" img={"/images/emblem/vip.jpg"} />
        )}
        {chatData.suscribers.filter((e) => e._id === user._id).length > 0 && (
          <Emblem
            chat={true}
            name="Suscriptor"
            img={"/images/emblem/subscriptor.jpg"}
          />
        )}
      </a>
    );

    if (user.name === streamer) {
      return <Emblem name="Emisor" img={"/images/emblem/emisor.jpg"} />;
    }

    if (userMod) {
      return <Emblem name="Moderador" img={"/images/emblem/moderador.jpg"} />;
    }

    if (userVip) {
      return <Emblem name="VIP" img={"/images/emblem/vip.jpg"} />;
    }

    if (chatData.suscribers.filter((e) => e._id === user._id).length > 0) {
      return (
        <Emblem name="Suscriptor" img={"/images/emblem/subscriptor.jpg"} />
      );
    }
  }

  const findSign = (dateS) => {
    const date = new Date(dateS);
    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = [
      "/images/signos/aquario.jpg",
      "/images/signos/piscis.jpg",
      "/images/signos/aries.jpg",
      "/images/signos/tauro.jpg",
      "/images/signos/geminis.jpg",
      "/images/signos/cancer.jpg",
      "/images/signos/leo.jpg",
      "/images/signos/virgo.jpg",
      "/images/signos/libra.jpg",
      "/images/signos/escorpio.jpg",
      "/images/signos/sagitario.jpg",
      "/images/signos/capricornio.jpg",
    ];
    let month = date.getMonth();
    let day = date.getDate();
    if (month == 0 && day <= 20) {
      month = 11;
    } else if (day < days[month]) {
      month--;
    }
    return signs[month];
  };

  const findSignName = (dateS) => {
    const date = new Date(dateS);
    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = [
      "Aquario",
      "Piscis",
      "Aries",
      "Tauro",
      "Geminis",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Escorpio",
      "Sagitario",
      "Capricornio",
    ];
    let month = date.getMonth();
    let day = date.getDate();
    if (month == 0 && day <= 20) {
      month = 11;
    } else if (day < days[month]) {
      month--;
    }
    return signs[month];
  };

  function getType() {
    if (userBan === true) {
      return (
        <div ref={divRef} className="chat-input">
          {dropdownChatConfig && (
            <DropdownChatConfig
              chatOff={() => setChatOff()}
              changeTextSize={(e) => changeTextSize(e)}
            />
          )}
          {dropdownEmotes && (
            <DropdownEmotes clickEmoticon={(e) => onClickEmoticon(e)} />
          )}
          {dropdownCommands && (
            <DropdownCommands
              streamer={streamer}
              userMod={userMod}
              userVip={userVip}
              closeNavbar={() => setDropdownCommands(false)}
              message={message}
              handleClickMessage={(e) => handleClickSendMessage(e)}
              indexHover={indexHover}
            />
          )}
          {dropdownRules && (
            <DropdownRules closeNavbar={() => setDropdownRules(false)} />
          )}
          {dropdownPoints && (
            <DropdownPoints
              socketMain={socketMain}
              callback={(amount, text, donation) =>
                callback(amount, text, donation)
              }
              streamer={streamer}
              clickDonation={(e) => onChangeInput(message + " " + e)}
              closeNavbar={() => setDropdownPoints(false)}
            />
          )}
          {dropdownChatIdentity && (
            <DropdownChatIdentity
              changeColor={(color) => handleChangeColor(color)}
            />
          )}

          <div
            style={{ top: getHeightFromDiv() }}
            className="chat-input-v2-container"
          >
            {getErrorMessage()}
            <div className="chat-input-v2-content">
              <p
                style={{ color: getColorFromLength() }}
                className="chat-input-v2-text"
              >
                {textLength}
              </p>

              <div style={{ width: "16%", marginRight: "10px" }}>
                <div
                  onClick={onMouseEnterChatIdentity}
                  style={{
                    width: "45px",
                    position: "relative",
                    left: "10px",
                    marginRight: "10px",
                  }}
                  className="navbar-image-avatar-container"
                >
                  <div
                    style={{
                      width: dropdownChatIdentity ? "42px" : "40px",
                      height: dropdownChatIdentity ? "42px" : "40px",
                      backgroundColor: dropdownChatIdentity && "#f36196",
                    }}
                    className="navbar-image-avatar"
                  >
                    <img
                      style={{ backgroundColor: user.color }}
                      src={user.customAvatar ? user.avatar : user.lookImage}
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div style={{ width: "80%" }}>
                <h4 style={{ fontSize: "14px", color: user.color }}>
                  {" "}
                  <Emblem
                    style={{ marginRight: "2px" }}
                    name={findSignName(user.birthDate)}
                    img={findSign(user.birthDate)}
                  />{" "}
                  {chatData != null && getIdentityEmblem()}{" "}
                  <a
                    style={{ ...getBackgroundColorPrime() }}
                    onClick={onMouseEnterChatIdentity}
                  >
                    {user.name}
                  </a>{" "}
                </h4>
                <div
                  contenteditable="true"
                  data-placeholder="Edit me"
                  role="textbox"
                  id="chat-input"
                  spellcheck="true"
                  className="chat-send-input"
                  style={{
                    borderBottom: onHoverInput
                      ? "2px solid #f36196"
                      : "2px solid #353535",
                  }}
                  autoComplete="off"
                ></div>
              </div>
            </div>

            <div className="chat-input-v2-bottom">
              <div
                style={{
                  width: "15%",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              ></div>
              <div
                style={{
                  width: "85%",
                  textAlign: "right",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "right",
                }}
              >
                <button className="send-button-disabled">Enviar</button>
              </div>
            </div>
          </div>

          {showPopupAuth === true && (
            <Auth typeDefault={0} closePopup={() => togglePopupAuth()} />
          )}
        </div>
      );
    }

    if (chatOff === true) {
      return <div></div>;
    }

    return (
      <div className="chat-input">
        {dropdownChatConfig && (
          <DropdownChatConfig
            chatOff={() => setChatOff()}
            changeTextSize={(e) => changeTextSize(e)}
          />
        )}
        {dropdownEmotes && (
          <DropdownEmotes clickEmoticon={(e) => onClickEmoticon(e)} />
        )}
        {dropdownCommands && (
          <DropdownCommands
            streamer={streamer}
            userMod={userMod}
            userVip={userVip}
            closeNavbar={() => setDropdownCommands(false)}
            message={message}
            handleClickMessage={(e) => handleClickSendMessage(e)}
            indexHover={indexHover}
          />
        )}
        {/*dropdownRules && <DropdownRules closeNavbar={() => setDropdownRules(false)} />*/}
        {dropdownPoints && (
          <DropdownPoints
            socketMain={socketMain}
            callback={(amount, text, donation) =>
              callback(amount, text, donation)
            }
            streamer={streamer}
            clickDonation={(e) => onChangeInput(message + " " + e)}
            closeNavbar={() => setDropdownPoints(false)}
          />
        )}
        {dropdownChatIdentity && (
          <DropdownChatIdentity
            userMod={userMod}
            userVip={userVip}
            chatData={chatData}
            closeNavbar={() => setDropdownChatIdentity(false)}
            changeColor={(color) => handleChangeColor(color)}
          />
        )}
        {dropdownBet && (
          <BetDropdown
            handleReload={() => reloadBets()}
            betRanking={betRanking}
            bets={bets}
            streamer={streamer}
            closeNavbar={() => setDropdownBet(false)}
          />
        )}

        <div
          style={{ top: getHeightFromDiv() }}
          className="chat-input-v2-container"
        >
          {getErrorMessage()}
          <div className="chat-input-v2-content">
            <div style={{ width: "100%", marginLeft: "10px" }}>
              <div style={{ maxWidth: "100%", minWidth: "100%" }}>
                <p
                  className="input-chat-name"
                  style={{
                    fontSize: isMobile ? "20px" : "14px",
                    color: user.color,
                    padding: "3px",
                    borderRadius: "3px",
                    fontWeight: "800",
                  }}
                >
                  <Emblem
                    style={{ marginRight: "-1px" }}
                    name={findSignName(user.birthDate)}
                    img={findSign(user.birthDate)}
                  />{" "}
                  {chatData != null && getIdentityEmblem()}{" "}
                  <a
                    style={{ ...getBackgroundColorPrime() }}
                    onClick={onMouseEnterChatIdentity}
                    className="input-user-hover"
                  >
                    {user.name}
                  </a>
                </p>
              </div>
              <div
                ref={divRef}
                contenteditable="true"
                data-placeholder="Di algo.."
                role="textbox"
                id="chat-input"
                spellcheck="true"
                onClick={() => handleClickInput()}
                className="chat-send-input"
                style={{
                  borderBottom: onHoverInput
                    ? "2px solid #f36196"
                    : "2px solid #353535",
                }}
                onInput={(event) => onChangeInput(event)}
                onKeyPress={(event) => onKeyPressInput(event)}
                onKeyDown={(event) => onKeyDownInput(event)}
                autoComplete="off"
              ></div>
            </div>
          </div>

          <div className="chat-input-v2-bottom">
            <div
              style={{
                width: "15%",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                marginLeft: "1px",
              }}
            >
              <Tippy
                placement="right-start"
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    {user.coins} pixeles
                  </h1>
                }
              >
                <button
                  onClick={() => onMouseEnterPoints()}
                  className="button-points gray-button"
                >
                  <img
                    style={{ width: isMobile ? "30px" : "16px" }}
                    src="/images/pixel.png"
                    alt=""
                  />
                  <h3
                    style={{
                      fontFamily: "Poppins",
                      minWidth: "15px",
                      marginLeft: "3px",
                      fontSize: isMobile ? "24px" : "13px",
                    }}
                  >
                    {user.coins}
                  </h3>
                  {incrementPoints === true && (
                    <p className="text-points-increment">+{points}</p>
                  )}
                  {incrementPoints2 === true && (
                    <Tippy
                      placement="bottom"
                      theme="pinkker"
                      content={
                        <h1
                          style={{ fontSize: "12px", fontFamily: "Montserrat" }}
                        >
                          Has ganado {points} pixels
                        </h1>
                      }
                    >
                      <p className="text-points-increment2">+{points}</p>
                    </Tippy>
                  )}
                </button>
              </Tippy>
            </div>
            <div
              style={{
                width: "85%",
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "right",
              }}
            >
              {userMod === true && (
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      Vista moderador
                    </h1>
                  }
                >
                  <button
                    style={{ width: "25px", marginRight: "3px" }}
                    className="config-button"
                  >
                    <i class="fas fa-bolt" />
                  </button>
                </Tippy>
              )}

              {userVip === true && (
                <Tippy
                  theme="pinkker"
                  content={
                    <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                      VIP
                    </h1>
                  }
                >
                  <button className="config-button">
                    <i class="fas fa-gem" />
                  </button>
                </Tippy>
              )}

              {/*getDelayForNewMessage()*/}

              {/* {emotes && ( */}
              <Tippy
                theme="pinkker"
                content={
                  <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                    Emoticonos
                  </h1>
                }
              >
                <button
                  style={{ marginRight: "3px" }}
                  onClick={() => onMouseEnterEmotes()}
                  className="config-button"
                >
                  <i
                    style={{ fontSize: isMobile && "24px" }}
                    class="fas fa-laugh"
                  />
                </button>
              </Tippy>
              {/* )} */}

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

              {buttonEnabled === true && chatData != null && (
                <button
                  className={
                    delay === 0 ? "send-button" : "send-button-disabled"
                  }
                  onClick={() => delay === 0 && handleSendMessage()}
                >
                  Enviar
                </button>
              )}
              {buttonEnabled === false && (
                <button className="send-button-disabled">Enviar</button>
              )}
              {chatData === null && (
                <button className="send-button-disabled">Enviar</button>
              )}
            </div>
          </div>
        </div>

        {showPopupAuth === true && (
          <Auth typeDefault={0} closePopup={() => togglePopupAuth()} />
        )}
      </div>
    );
  }

  return getType();
};

export default Input;
