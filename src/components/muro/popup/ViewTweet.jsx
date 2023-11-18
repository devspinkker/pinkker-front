import React, { useState, useEffect } from "react";

import "./ViewTweet.css";

import { useSelector, useDispatch } from "react-redux";

import { useNotification } from "../../Notifications/NotificationProvider";

import { ScaleLoader } from "react-spinners";

import {
  CommentPost,
  setToken,
  GetCommentPost,
} from "../../../services/backGo/tweet";

import TweetCard from "../tweet/TweetCard";

export default function ViewTweet({ closePopup, tweet, isLiked, isRetweet }) {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const alert = useNotification();

  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState(null);

  const [likes, setLikes] = useState(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   const data = await getAllCommentsInVideo(tweet._id);
    //   if (data != null && data != undefined) {
    //     setComments(data);
    //   }
    // };
    // fetchData();
  }, []);

  function timeSince(date) {
    const date2 = new Date(date).getTime();

    var seconds = Math.floor((new Date().getTime() - date2) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + " años";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " meses";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " días";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " horas";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutos";
    }
    return Math.floor(seconds) + " segundos";
  }

  const handleLike = async () => {};

  async function createComment() {
    if (comment.trim() != "") {
      let token = window.localStorage.getItem("token");
      setToken(token);
      try {
        CommentPost({ status: comment, OriginalPost: tweet._id });
        setComment("");
        alert({ type: "SUCCESS" });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleRetweet() {}

  function handleUpdate() {
    // const fetchData = async () => {
    //   const data = await getAllCommentsInVideo(tweet._id);
    //   if (data != null && data != undefined) {
    //     setComments(data);
    //   }
    // };
    // fetchData();
  }

  function renderTweet() {
    if (tweet.gallery === true) {
      return (
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ textAlign: "left" }} className="tweetcard-avatar">
              <img
                style={{ width: "45px", borderRadius: "100px" }}
                src={tweet.avatar}
              />
            </div>

            <div
              style={{ position: "relative", left: "-10px" }}
              className="tweetcard-primary"
            >
              <h3>{tweet.UserInfo.NameUser}</h3>
              <p style={{ color: "lightgray", fontSize: "15px" }}>
                @{tweet.UserInfo.NameUser}
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "left",
              marginBottom: "10px",
            }}
          >
            <p style={{ fontSize: "24px", color: "white" }}>{tweet.Status}</p>
          </div>
          <div style={{ marginTop: "10px" }}>
            <img
              style={{ borderRadius: "20px" }}
              src={tweet.PostImage}
              alt=""
            />
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "left",
              marginBottom: "10px",
            }}
          >
            <p style={{ color: "#f36196" }}>Contenido de Suscriptores</p>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "left",
              marginBottom: "10px",
            }}
          >
            <p style={{ fontSize: "14px", color: "darkgray" }}>
              1:59 p. m. · 10 nov. 2022
            </p>
          </div>

          <div
            style={{
              width: "100%",
              margin: "10px auto",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          />

          <div className="viewtweet-quantity">
            <div className="viewtweet-quantity-card">
              <p style={{ color: "white" }}>
                {tweet.Likes.length}{" "}
                <a style={{ color: "darkgray" }}>Me gusta</a>
              </p>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              margin: "10px auto",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          />

          <div
            style={{ width: "70%", margin: "0 auto", textAlign: "center" }}
            className="tweetcard-icons"
          >
            <div className="tweetcard-icon-comment">
              <i style={{ fontSize: "16px" }} class="far fa-comment" />
            </div>

            <div
              onClick={() => handleLike()}
              style={{ color: isLiked && "red" }}
              className="tweetcard-icon-like"
            >
              {isLiked ? (
                <i style={{ fontSize: "16px" }} class="fas fa-heart" />
              ) : (
                <i style={{ fontSize: "16px" }} class="far fa-heart" />
              )}
            </div>

            <div className="tweetcard-icon-share">
              <i style={{ fontSize: "16px" }} class="fas fa-share" />
            </div>
          </div>

          <div
            style={{
              width: "100%",
              margin: "10px auto",
              height: "1px",
              backgroundColor: "#ffffff1a",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ textAlign: "left" }} className="tweetcard-avatar">
            <img
              style={{ width: "45px", borderRadius: "100px" }}
              src={tweet.UserInfo.Avatar}
            />
          </div>

          <div
            style={{ position: "relative", left: "-10px" }}
            className="tweetcard-primary"
          >
            <h3>{tweet.UserInfo.nameUse}</h3>
            <p style={{ color: "lightgray", fontSize: "15px" }}>
              @{tweet.UserInfo.FullName}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "left",
            marginBottom: "10px",
          }}
        >
          <p style={{ fontSize: "24px", color: "white" }}>{tweet.Status}</p>
        </div>
        {tweet.image != null && (
          <div style={{ marginTop: "10px" }}>
            <img
              style={{
                borderRadius: "20px",
                minWidth: "250px",
                maxWidth: "250px",
              }}
              src={tweet.PostImage}
              alt=""
            />
          </div>
        )}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "left",
            marginBottom: "10px",
          }}
        >
          <p style={{ fontSize: "14px", color: "darkgray" }}>
            1:59 p. m. · 10 nov. 2022
          </p>
        </div>

        <div
          style={{
            width: "100%",
            margin: "10px auto",
            height: "1px",
            backgroundColor: "#ffffff1a",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        />

        <div className="viewtweet-quantity">
          <div className="viewtweet-quantity-card">
            <p style={{ color: "white" }}>
              {tweet.totalRetweets}{" "}
              <a style={{ color: "darkgray" }}>Retweets</a>
            </p>
          </div>
          <div className="viewtweet-quantity-card">
            <p style={{ color: "white" }}>
              {tweet.Likes.length} <a style={{ color: "darkgray" }}>Me gusta</a>
            </p>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            margin: "10px auto",
            height: "1px",
            backgroundColor: "#ffffff1a",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        />

        <div
          style={{ width: "70%", margin: "0 auto", textAlign: "center" }}
          className="tweetcard-icons"
        >
          <div className="tweetcard-icon-comment">
            <i style={{ fontSize: "16px" }} class="far fa-comment" />
          </div>

          <div
            onClick={() => handleRetweet()}
            style={{ color: isRetweet && "rgb(46, 255, 60)" }}
            className="tweetcard-icon-retweet"
          >
            <i style={{ fontSize: "16px" }} class="fas fa-retweet" />
          </div>

          <div
            onClick={() => handleLike()}
            style={{ color: isLiked && "red" }}
            className="tweetcard-icon-like"
          >
            {isLiked ? (
              <i style={{ fontSize: "16px" }} class="fas fa-heart" />
            ) : (
              <i style={{ fontSize: "16px" }} class="far fa-heart" />
            )}
          </div>

          <div className="tweetcard-icon-share">
            <i style={{ fontSize: "16px" }} class="fas fa-share" />
          </div>
        </div>

        <div
          style={{
            width: "100%",
            margin: "10px auto",
            height: "1px",
            backgroundColor: "#ffffff1a",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        />
      </div>
    );
  }
  useEffect(() => {
    GetComments();
  }, [tweet._id]);

  async function GetComments() {
    try {
      const token = window.localStorage.getItem("token");
      setToken(token);

      const res = await GetCommentPost({ IdPost: tweet._id });
      setComments(res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  // Resto del código...

  function renderComments() {
    return (
      <div className="viewtweet-comments-container">
        {!comments ? (
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
        ) : Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <TweetCard key={comment._id} tweet={comment} />
          ))
        ) : (
          <p>No hay comentarios</p>
        )}
      </div>
    );
  }

  return (
    <div className="viewtweet-popup-body">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className={"viewtweet-popup-container"}>
          <div className="usersettings-popup-close">
            <button
              onClick={() => createComment()}
              className="viewtweet-button-reply"
              style={{ "background-color": "#770443" }}
            >
              Responder
            </button>
            <button onClick={closePopup}>
              <i style={{ fontSize: "24px" }} className="fas fa-times" />
            </button>
          </div>
          {renderTweet()}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            <div>
              <img
                style={{ width: "45px", borderRadius: "100px" }}
                src={user.avatar}
              />
            </div>

            <div
              style={{ marginLeft: "10px", height: "50px" }}
              className="muro-send-tweet-input"
            >
              <textarea
                className="muro-send-tweet-input-respuesta"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Twittea tu respuesta"
                type="text"
              />
            </div>
          </div>
          {renderComments()}
        </div>
      </div>
    </div>
  );
}
