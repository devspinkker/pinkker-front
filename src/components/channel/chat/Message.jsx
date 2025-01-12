import React, { useState, useEffect } from "react";
import "./Message.css";

import reactStringReplace from "react-string-replace";

import { useSelector } from "react-redux";

import Confetti from "react-confetti";

import Emblem from "../../emblem/Emblem";
import Tippy from "@tippyjs/react";
import EmoteDropdown from "./dropdown/emote/EmoteDropdown";

const Message = ({
  colorUser,
  chatData,
  textSize,
  message,
  name,
  room,
  handleClickUser,
  lookImage,
  emotes,
  replyToUser,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [openEmote, setOpenEmote] = useState(false);
  const [emoteOpenImg, setEmoteOpenImg] = useState("");
  const [emoteOpenName, setEmoteOpenName] = useState("");
  const [emoteOpenStreamer, setEmoteOpenStreamer] = useState("");

  function toggleOpenEmote(img, name, streamer) {
    setEmoteOpenImg(img);
    setEmoteOpenName(name);
    setEmoteOpenStreamer(streamer);
    setOpenEmote(!openEmote);
  }

  let isSentByCurrentUser = false;
  let isSentByAdmin = false;

  if (message.user === name) {
    isSentByCurrentUser = true;
  }

  function getPxPerTextSize() {
    if (textSize === 0) {
      return "12px";
    } else if (textSize === 1) {
      return "13px";
    } else if (textSize === 2) {
      return "14px";
    } else if (textSize === 3) {
      return "15px";
    }
  }

  function getIcon() {
    return (
      <a>
        {message.Partner?.active === true && (
          <Emblem
            chat={true}
            name="Pinkker Prime"
            img={
              "https://www.pinkker.tv/uploads/assets/pinkkerprime.png"
            }
          />
        )}
        {message.user === room && (
          <Emblem chat={true} name="Emisor" img={"/images/emblem/emisor.jpg"} />
        )}
        {chatData.mods.includes(message._id) && (
          <Emblem
            chat={true}
            name="Moderador"
            img={"/images/emblem/moderador.jpg"}
          />
        )}
        {chatData.vips.includes(message._id) && (
          <Emblem chat={true} name="VIP" img={"/images/emblem/vip.jpg"} />
        )}
        {chatData.suscribers.filter((e) => e._id === message._id).length >
          0 && (
          <Emblem
            chat={true}
            name="Suscriptor"
            img={"/images/emblem/subscriptor.jpg"}
          />
        )}
      </a>
    );
  }

  function getEmoteByText(text) {
    let replacedText = text;

    if (replacedText.includes("&nbsp;")) {
      replacedText = reactStringReplace(replacedText, `&nbsp;`, (match, i) => (
        <a style={{ marginLeft: "1.5px", marginRight: "1.5px" }} />
      ));
    }

    emotes.forEach((emote) => {
      if (text.includes(`<img src="${emote.image}">`)) {
        replacedText = reactStringReplace(
          replacedText,
          `<img src="${emote.image}">`,
          (match, i) => (
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  {emote.name}
                </h1>
              }
            >
              <img
                onClick={() =>
                  toggleOpenEmote(emote.image, emote.name, emote.streamer)
                }
                style={{ cursor: "pointer" }}
                src={emote.image}
                class="input-emote-div"
              />
            </Tippy>
          )
        );
      }
    });
    return replacedText;
  }

  function getColorFromAmount(amount) {
    if (amount <= 600) {
      return { colorPrimary: "#1F2DA5", colorSecondary: "#162077" };
    }

    if (amount > 600 && amount <= 1200) {
      return { colorPrimary: "#1EACB0", colorSecondary: "#167477" };
    }

    if (amount > 1200 && amount <= 3000) {
      return { colorPrimary: "#A19A1B", colorSecondary: "#7C7717" };
    }

    if (amount > 3000 && amount <= 6000) {
      return { colorPrimary: "#A16E1B", colorSecondary: "#86590F" };
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

  function getBackgroundColorPrime() {
    if (message.color === "#D500FF") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677784906/naming/colaborador_qwwmv6.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }

    if (message.color === "#FF0000") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825934/naming/admin1_mhgt70.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }

    if (message.color === "#82CD00") {
      return {
        background:
          "url(https://res.cloudinary.com/pinkker/image/upload/v1677825961/naming/moderador_hx3n6w.gif) no-repeat",
        backgroundPositionY: "-10px",
        textShadow: "0 0 8px",
      };
    }

    return null;
  }

  function getType() {
    if (message.suscription === true) {
      return (
        <div
          style={{
            backgroundColor: getColorFromAmount(message.amount).colorPrimary,
          }}
          className="message-chat-donation"
        >
          <div style={{ position: "absolute", zIndex: "1000" }}>
            <Confetti
              numberOfPieces={20}
              style={{ position: "relative" }}
              width={"300px"}
              height={"45px"}
            />
          </div>
          <div
            style={{
              fontFamily: "Poppins",
              textShadow: "1px 2px 0px rgba(0,0,0,0.5)",
              zIndex: "1500",
              textAlign: "center",
              width: "100%",
            }}
          >
            {message.text}
          </div>
        </div>
      );
    }

    if (message.donation === true) {
      return (
        <div
          style={{
            backgroundColor: getColorFromAmount(message.amount).colorPrimary,
          }}
          className="message-chat-donation"
        >
          <div>
            <img
              style={{
                width: "40px",
                position: "relative",
                marginRight: "5px",
                borderRadius: "100px",
              }}
              src={lookImage}
            />
          </div>
          <div
            style={{
              fontFamily: "Poppins",
              textShadow: "1px 2px 0px rgba(0,0,0,0.5)",
            }}
          >
            <a
              style={{
                cursor: "pointer",
                fontFamily: "Poppins",
                textShadow: "1px 2px 0px rgba(0,0,0,0.5)",
              }}
              onClick={() => handleClickUser(name)}
            >
              {message.user}
            </a>{" "}
            ha donado {message.amount} PXL!
            <p style={{ color: "#ededed", fontSize: "14px" }}>{message.text}</p>
          </div>
        </div>
      );
    }

    if (message.user === "System") {
      return (
        <div className="chat-message-system">
          <a style={{ color: "darkgray", fontSize: "13px" }}>{message.text}</a>
        </div>
      );
    } else {
      return isSentByCurrentUser ? (
        <div style={{ fontSize: getPxPerTextSize() }} className="chat-message">
          <a>
            <Emblem
              chat={true}
              style={{ marginRight: "2px" }}
              name={findSignName(message.birthDate)}
              img={findSign(message.birthDate)}
            />
            {getIcon()}
            <a
              onClick={() => handleClickUser(name)}
              className="chat-message-user-hover"
              style={{
                ...getBackgroundColorPrime(),
                color: colorUser,
                cursor: "pointer",
                fontWeight: "800",
                letterSpacing: "0.4px",
              }}
            >
              {name}
            </a>
          </a>
          <a
            style={{
              color: "#ededed",
              width: "100%",
              verticalAlign: "baseline",
            }}
          >
            : {getEmoteByText(message.text)}
          </a>

          {openEmote && (
            <EmoteDropdown
              close={() => toggleOpenEmote(null, null, null)}
              chat={true}
              img={emoteOpenImg}
              name={emoteOpenName}
            />
          )}
        </div>
      ) : (
        <div
          style={{ fontSize: getPxPerTextSize() }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="chat-message"
        >
          <Emblem
            chat={true}
            style={{ marginRight: "2px" }}
            name={findSignName(message.birthDate)}
            img={findSign(message.birthDate)}
          />
          <a>
            {getIcon()}
            <a
              onClick={() => handleClickUser(message.user)}
              className="chat-message-user-hover"
              style={{
                ...getBackgroundColorPrime(),
                color: colorUser,
                cursor: "pointer",
                fontWeight: "800",
                letterSpacing: "0.4px",
              }}
            >
              {message.user}
            </a>
          </a>
          <a
            style={{
              color: "#ededed",
              width: "100%",
              verticalAlign: "baseline",
            }}
          >
            : {getEmoteByText(message.text)}
          </a>

          {isHovered && (
            <div className="chat-message-icons-hover">
              <i
                onClick={() => replyToUser(message.user)}
                style={{ fontSize: "16px", cursor: "pointer" }}
                class="fas fa-reply"
              />
            </div>
          )}

          {openEmote && (
            <EmoteDropdown
              close={() => toggleOpenEmote(null, null, null)}
              chat={true}
              streamer={emoteOpenStreamer}
              img={emoteOpenImg}
              name={emoteOpenName}
            />
          )}
        </div>
      );
    }
  }

  return getType();
};

export default Message;
