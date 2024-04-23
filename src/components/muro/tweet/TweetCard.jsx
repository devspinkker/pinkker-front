import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Importa useHistory
import "./TweetCard.css";
import { useSelector } from "react-redux";
import CiteTweet from "../popup/CiteTweet";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import DropdownReTweet from "./DropdownReTweet";
import { useNotification } from "../../Notifications/NotificationProvider";
import {
  LikePost,
  DislikePost,
  setToken,
} from "../../../services/backGo/tweet";
import { Grid, Typography, Skeleton } from "@mui/material";
import { FaEllipsis } from "react-icons/fa6";

export default function TweetCard({ tweet }) {
  const [popupTweetView, setPopupTweetView] = useState(false);
  const [popupCiteTweet, setPopupCiteTweet] = useState(false);
  const [showDropdownRetweet, setShowDropdownRetweet] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const history = useHistory();

  const alert = useNotification();

  function togglePopupTweetView() {
    setPopupTweetView(!popupTweetView);
    // Cambia la URL cuando se abre un tweet
    history.push(`/post/${tweet.UserInfo.NameUser}/${tweet._id}`);
  }

  function togglePopupCiteTweet() {
    setPopupCiteTweet(!popupCiteTweet);
  }

  function toggleShowDropdownRetweet() {
    setShowDropdownRetweet(!showDropdownRetweet);
  }

  const handleLike = async () => {
    let token = window.localStorage.getItem("token");
    let idUser = window.localStorage.getItem("_id");
    if (token) {
      setToken(token);
      if (tweet.Likes.includes(idUser)) {
        setIsLiked(!isLiked);
        await DislikePost({ idPost: tweet._id });
      } else {
        setIsLiked(!isLiked);
        await LikePost({ idPost: tweet._id });
      }
    } else {
      alert("logeate");
    }
  };
  useEffect(() => {
    let loggedUser = window.localStorage.getItem("_id");
    tweet.Likes.includes(loggedUser);
    setIsLiked(tweet.Likes.includes(loggedUser));
  }, [tweet]);

  return (
    <div style={{ borderBottom: "1px solid #3a3b3c", padding: "5px" }}>
      <div className="tweetcard-body">
        <div
          onClick={() => togglePopupTweetView()}
          className="tweetcard-container"
        >
          <div className="tweetcard-avatar">
            <img
              style={{
                width: "40px",
                borderRadius: "100px",
                position: "relative",
                left: "-10px",
              }}
              src={tweet.UserInfo.Avatar}
              alt={`${tweet.UserInfo.NameUser} avatar`}
            />
          </div>

          <div className="tweetcard-primary">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Grid
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid
                  style={{
                    width: "80%",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  <h3>{tweet.UserInfo.FullName}</h3>
                  <p
                    style={{
                      color: "lightgray",
                      marginLeft: "5px",
                      fontSize: "15px",
                    }}
                  >
                    @{tweet.UserInfo.NameUser} · 32min
                  </p>
                </Grid>

                <FaEllipsis />
              </Grid>
              {tweet.gallery === true && (
                <p style={{ color: "#f36196", marginLeft: "5px" }}>
                  Contenido de Suscriptores
                </p>
              )}
            </div>

            <div style={{ marginTop: "5px", textAlign: "left" }}>
              <p>{tweet.Status}</p>
            </div>

            {tweet.PostImage !== "" && (
              <div style={{ marginTop: "10px" }}>
                <img
                  style={{ borderRadius: "20px", maxWidth: "350px" }}
                  src={tweet.PostImage}
                  alt="Post image"
                />
              </div>
            )}

            {tweet.gallery === true && (
              <div style={{ marginTop: "10px" }}>
                <img
                  style={{ borderRadius: "20px", maxWidth: "350px" }}
                  src={tweet.PostImage}
                  alt="Gallery image"
                />
              </div>
            )}

            <div className="tweetcard-icons">
              <Tippy
                placement="bottom"
                theme="pinkker"
                content={<h1>Responder</h1>}
              >
                <div className="tweetcard-icon-comment">
                  <i className="far fa-comment" />
                  <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                    {tweet.Comments.length}
                  </p>
                </div>
              </Tippy>

              <Tippy
                placement="bottom"
                theme="pinkker"
                content={<h1>ReTwittear</h1>}
              >
                {tweet.gallery !== true && (
                  <div
                    onClick={() => toggleShowDropdownRetweet()}
                    className="tweetcard-icon-retweet"
                  >
                    <i className="fas fa-retweet" />
                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {/* {tweet.RePosts.length} */}
                    </p>
                  </div>
                )}
              </Tippy>
              {showDropdownRetweet === true && (
                <DropdownReTweet
                  citeTweet={() => setPopupCiteTweet(true)}
                  closePopup={() => toggleShowDropdownRetweet()}
                />
              )}

              <Tippy
                placement="bottom"
                theme="pinkker"
                content={<h1>{isLiked ? "Cancelar Me gusta" : "Me gusta"}</h1>}
              >
                <div
                  style={{ color: isLiked && "red" }}
                  className="tweetcard-icon-like"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                >
                  {isLiked ? (
                    <i className="fas fa-heart" />
                  ) : (
                    <i className="far fa-heart" />
                  )}
                  <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                    {tweet.Likes.length}
                  </p>
                </div>
              </Tippy>

              <Tippy
                placement="bottom"
                theme="pinkker"
                content={<h1>{isLiked ? "Cancelar Me gusta" : "Me gusta"}</h1>}
              >
                <div
                  style={{ color: isLiked && "red" }}
                  className="tweetcard-icon-like"
                  onClick={() => handleLike()}
                >
                  <i class="fas fa-chart-bar" />
                  <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                    {tweet.Likes.length}
                  </p>
                </div>
              </Tippy>
            </div>
          </div>
        </div>

        {/* {popupTweetView === true && (
          <ViewTweet tweet={tweet} closePopup={() => togglePopupTweetView()} />
        )}
        {popupCiteTweet === true && (
          <CiteTweet tweet={tweet} closePopup={() => togglePopupCiteTweet()} />
        )} */}
      </div>
    </div>
  );
}
