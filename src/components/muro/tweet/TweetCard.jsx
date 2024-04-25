import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
  RePost,
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
    let id;
    if (tweet.Type === "RePost") {
      id = tweet.OriginalPostData._id;
    } else {
      id = tweet._id;
    }
    history.push(`/post/${tweet.UserInfo.NameUser}/${id}`);
  }

  function togglePopupCiteTweet() {
    setPopupCiteTweet(!popupCiteTweet);
  }

  async function toggleShowDropdownRetweet() {
    let token = window.localStorage.getItem("token");
    if (token) {
      let id;
      if (tweet.Type === "RePost") {
        id = tweet.OriginalPostData._id;
      } else {
        id = tweet._id;
      }
      const res = await RePost(id, token);
      console.log(res);
      setShowDropdownRetweet(!showDropdownRetweet);
    }
  }

  const handleLike = async () => {
    let token = window.localStorage.getItem("token");
    let idUser = window.localStorage.getItem("_id");
    let id;
    var repost;
    if (tweet.Type === "RePost") {
      id = tweet.OriginalPostData._id;
      repost = true;
    } else {
      id = tweet._id;
      repost = false;
    }
    if (token) {
      setToken(token);

      if (!repost && tweet.Likes.includes(idUser)) {
        setIsLiked(false);
        const index = tweet.Likes?.Likes?.indexOf(idUser);
        if (index !== -1) {
          tweet?.Likes?.splice(index, 1);
        }
        await DislikePost({ idPost: id });
      } else if (repost && tweet.OriginalPostData?.Likes?.includes(idUser)) {
        const index = tweet.OriginalPostData?.Likes?.indexOf(idUser);
        if (index !== -1) {
          tweet.OriginalPostData?.Likes?.splice(index, 1);
        }
        setIsLiked(false);
        await DislikePost({ idPost: id });
      } else {
        if (!repost) {
          tweet?.Likes?.push(idUser);
        } else {
          tweet.OriginalPostData?.Likes?.push(idUser);
        }
        setIsLiked(true);
        await LikePost({ idPost: id });
      }
    } else {
      alert("logeate");
    }
  };

  useEffect(() => {
    let loggedUser = window.localStorage.getItem("_id");
    let repost = tweet.Type === "RePost" ? true : false;
    if (!repost) {
      tweet.Likes?.includes(loggedUser);
      setIsLiked(tweet.Likes?.includes(loggedUser));
    } else {
      tweet.OriginalPostData?.Likes?.includes(loggedUser);
      setIsLiked(tweet.OriginalPostData?.Likes?.includes(loggedUser));
    }
  }, [tweet]);

  return (
    <div style={{ borderBottom: "1px solid #3a3b3c", padding: "5px" }}>
      {tweet.Type === "RePost" && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className="fas fa-retweet" />
          <h3 style={{ padding: " 0px 10px" }}> {tweet.UserInfo.NameUser} </h3>
        </div>
      )}
      <div className="tweetcard-body">
        <div
          onClick={() => togglePopupTweetView()}
          className="tweetcard-container"
        >
          <div className="tweetcard-avatar">
            {tweet.Type === "RePost" ? (
              <img
                style={{
                  width: "40px",
                  borderRadius: "100px",
                  position: "relative",
                  left: "-10px",
                }}
                src={tweet.OriginalPostData.UserInfo.Avatar}
                alt={`${tweet.OriginalPostData.UserInfo.NameUser} avatar`}
              />
            ) : (
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
            )}
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
                  {tweet.Type === "RePost" ? (
                    <h3>{tweet.OriginalPostData.UserInfo.FullName} </h3>
                  ) : (
                    <h3> {tweet.UserInfo.FullName} </h3>
                  )}
                  <p
                    style={{
                      color: "lightgray",
                      marginLeft: "5px",
                      fontSize: "15px",
                    }}
                  >
                    {tweet.Type === "RePost" ? (
                      <p>@{tweet.OriginalPostData.UserInfo.NameUser} · 32min</p>
                    ) : (
                      <p> @{tweet.UserInfo.NameUser} · 32min</p>
                    )}
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
              {tweet.Type === "RePost" ? (
                <p>{tweet.OriginalPostData.Status}</p>
              ) : (
                <p>{tweet.Status}</p>
              )}
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
                    {tweet.Type === "RePost" ? (
                      <p>{tweet.OriginalPostData?.Comments?.length}</p>
                    ) : (
                      <p>{tweet.Comments?.length}</p>
                    )}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShowDropdownRetweet(tweet?._id);
                    }}
                    className="tweetcard-icon-retweet"
                  >
                    <i className="fas fa-retweet" />
                    {tweet.Type === "RePost" ? (
                      <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                        {tweet.OriginalPostData?.RePosts?.length}
                      </p>
                    ) : (
                      <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                        {" "}
                        {tweet?.RePosts?.length}
                      </p>
                    )}
                  </div>
                )}
              </Tippy>
              {showDropdownRetweet === true && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {/* <DropdownReTweet
                    reTweet={() => toggleShowDropdownRetweet(tweet?._id)}
                    citeTweet={() => setPopupCiteTweet(true)}
                    closePopup={() => toggleShowDropdownRetweet()}
                  /> */}
                </div>
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
                  {tweet.Type === "RePost" ? (
                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {tweet.OriginalPostData?.Likes?.length}
                    </p>
                  ) : (
                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {" "}
                      {tweet?.Likes?.length}
                    </p>
                  )}
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
                  {tweet.Type === "RePost" ? (
                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {tweet.OriginalPostData?.Likes?.length}
                    </p>
                  ) : (
                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {" "}
                      {/* {tweet?.Likes?.length} */}
                    </p>
                  )}
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
