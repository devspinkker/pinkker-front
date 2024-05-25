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

export default function CiteTweet({ closePopup, tweet, isLiked, isRetweet }) {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const alert = useNotification();

  useEffect(() => {
    console.log(tweet);
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

  async function handleSubmit() {
    if (message != "") {
      const formData = new FormData();
      formData.append("status", message);
      formData.append("OriginalPost", tweet?._id);

      //   formData.append("imgPost", file);
      try {
        let token = window.localStorage.getItem("token");
        if (token) {
          setMessage("");
          const res = await CitaPost(formData, token);
          console.log(res);
          alert({ type: "SUCCESS" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

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
        <div className={"citetweet-popup-container"}>
          <div className="usersettings-popup-close">
            <button onClick={closePopup}>
              <i style={{ fontSize: "24px" }} className="fas fa-times" />
            </button>
          </div>

          <div className="citetweet-popup-primary">
            <div className="citetweet-popup-avatar">
              <img
                style={{ width: "50px", borderRadius: "50px" }}
                src={user.avatar}
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

          <div className="citetweet-popup-tweet">
            <TweetCard tweet={tweet} />
          </div>

          <div style={{ marginTop: "20px" }}>
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
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />

          <div style={{ marginTop: "50px", textAlign: "right" }}>
            <button
              onClick={() => handleSubmit()}
              className="muro-send-tweet-button"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
