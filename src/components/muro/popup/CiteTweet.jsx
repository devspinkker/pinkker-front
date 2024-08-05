import React, { useState, useEffect } from "react";

import "./CiteTweet.css";

import { useSelector, useDispatch } from "react-redux";

import { useNotification } from "../../Notifications/NotificationProvider";

import { ScaleLoader } from "react-spinners";

import {
  addComment,
  getAllCommentsInVideo,
} from "../../../services/commentsTweet";

import TweetCard from "../tweet/TweetCard";

import Tippy from "@tippyjs/react";

import EmojiPicker, { Theme } from "emoji-picker-react";

import { createTweet } from "../../../services/tweet";
import { CitaPost } from "../../../services/backGo/tweet";

export default function CiteTweet({ closePopup, tweet, isLiked, isRetweet, isMobile }) {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const alert = useNotification();
  const [Avatar, setAvatar] = useState(null);

  useEffect(() => {
    let loggedUser = window.localStorage.getItem("avatar");
    setAvatar(loggedUser);
  }, [tweet]);

  const [comments, setComments] = useState(null);
  const [message, setMessage] = useState(null);

  const [likes, setLikes] = useState(null);

  const [dropdownEmotes, setDropdownEmotes] = useState(false);

  const onMouseEnterEmotes = () => {
    setDropdownEmotes(!dropdownEmotes);
  };

  function clickEmoji(e) {
    setMessage(message + e.emoji);
  }
  const handleChange2 = (e) => {
    var fileT = e.target.files[0];
    setFile(fileT);
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setImage(reader.result);
    });
    reader.readAsDataURL(fileT);
  };

  async function handleSubmit() {
    if (message != "") {
      const formData = new FormData();
      formData.append("status", message);
      formData.append("OriginalPost", tweet?._id);

      formData.append("imgPost", file);
      try {
        let token = window.localStorage.getItem("token");
        if (token) {
          setMessage("");
          const res = await CitaPost(formData, token);
          if (res?.message === "StatusCreated") {
            setImage(null);
            alert({ type: "SUCCESS" });
          }
        }
      } catch (error) {}
    }
  }
  const clearImages = () => {
    setImage(null);
    setFile(null);
  };
  return (
    <div className="citetweet-popup-body">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className={"citetweet-popup-container"} style={{width: isMobile && '100% !important'}}>
          <div className="usersettings-popup-close">
            <button onClick={closePopup}>
              <i style={{ fontSize: "24px" }} className="fas fa-times" />
            </button>
          </div>

          <div className="citetweet-popup-primary">
            <div className="citetweet-popup-avatar">
              <img
                style={{ width: "50px", borderRadius: "50px" }}
                src={Avatar}
              />
            </div>
            <div className="muro-send-tweet-input">
              <textarea
                style={{ height: "70px" }}
                id="citetweet-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Añade un comentario"
                type="text"
              />
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex" }}>
            <div
              onClick={() => onMouseEnterEmotes()}
              className="mure-send-tweet-icons-card"
              style={{
                width: "33px",
                height: "33px",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "5px",
              }}
            >
              <i
                style={{
                  padding: "5px",
                  color: "#ff4aa7d2",
                  marginRight: "5px",
                }}
                class="far fa-smile"
              />
            </div>
            <div
              className="mure-send-tweet-icons-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                padding: "0px",
              }}
            >
              <i
                style={{
                  padding: "5px",
                  color: "#ff4aa7d2",
                }}
                class="fas fa-photo-video"
              />
              <input
                onChange={(e) => handleChange2(e)}
                style={{
                  backgroundColor: "red",
                  width: "30px",
                  position: "absolute",

                  opacity: "0",
                }}
                type="file"
              />
            </div>
            {dropdownEmotes && (
              <div
                style={{
                  position: "absolute",
                  zIndex: "1001",
                  marginTop: "20px",
                }}
              >
                <EmojiPicker
                  onEmojiClick={(e) => clickEmoji(e)}
                  autoFocusSearch={false}
                  theme={Theme.DARK}
                  searchDisabled
                  height={"300px"}
                  width="300px"
                  lazyLoadEmojis={true}
                  previewConfig={{
                    showPreview: false,
                  }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "#ffffff1a",
              // marginTop: "10px",
              marginBottom: "10px",
            }}
          />
          {file != null && (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <i
                onClick={() => clearImages()}
                style={{
                  color: "white",
                  cursor: "pointer",
                  height: "20px",
                  width: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50px",
                  position: "relative",
                  left: "35px",
                  top: "10px",
                  padding: "5px",
                  backgroundColor: "#303030",
                }}
                class="fas fa-times"
              />
              <img style={{ maxWidth: "320px" }} src={image} />
            </div>
          )}
          <div style={{ marginTop: "0px", textAlign: "right" }}>
            <button
              onClick={() => handleSubmit()}
              style={{
                margin: "10px 0px",
              }}
              className="muro-send-tweet-button"
            >
              Publicar
            </button>
          </div>
          <div className="citetweet-popup-tweet">
            <TweetCard tweet={tweet} />
          </div>
        </div>
      </div>
    </div>
  );
}
