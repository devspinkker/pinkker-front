import React, { useState, useEffect } from "react";
import "./ViewTweet.css";
import { useSelector } from "react-redux";
import { useNotification } from "../../Notifications/NotificationProvider";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import {
  CommentPost,
  setToken,
  LikePost,
  DislikePost,
  getTweetId,
  GetCommentPost,
} from "../../../services/backGo/tweet";
import { useParams } from "react-router-dom";
import TweetCard from "../tweet/TweetCard";

export default function ViewTweet({ closePopup, isMobile }) {
  const [Avatar, setAvatar] = useState("");

  const alert = useNotification();
  const [tweet, setTweet] = useState(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(null);

  const { IdPost } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await GetCommentPost(IdPost);
        if (commentsData.data.message === "ok") {
          if (commentsData.data?.data) {
            setComments(commentsData.data?.data);
          } else {
            setComments([]);
          }
        } else {
          setComments([]);
        }
      } catch (error) {
        setComments([]);
        console.error("Error al obtener los comentarios:", error);
      }
    };

    fetchComments();
  }, [IdPost]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTweet = async () => {
      try {
        const res = await getTweetId(IdPost);
        setTweet(res.data);
      } catch (error) {
        console.error("Error al obtener el tweet:", error);
      }
    };

    fetchTweet();
  }, [IdPost]);

  useEffect(() => {
    // Verifica si el usuario actual ha dado like al tweet
    const loggedUser = window.localStorage.getItem("_id");
    setIsLiked(tweet && tweet?.Likes?.includes(loggedUser));
    const Avatar = window.localStorage.getItem("avatar");

    setAvatar(Avatar);
  }, [tweet]);

  const handleLike = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setToken(token);
      try {
        if (isLiked) {
          await DislikePost({ idPost: tweet?._id });
        } else {
          await LikePost({ idPost: tweet?._id });
        }
        setIsLiked(!isLiked);
      } catch (error) {}
    } else {
      alert("Inicia sesión para dar like");
    }
  };

  async function createComment() {
    if (comment.trim() !== "") {
      const token = window.localStorage.getItem("token");
      setToken(token);
      try {
        const res = await CommentPost({
          status: comment,
          OriginalPost: tweet?._id,
        });
        if (res?.message == "StatusCreated") {
          setComments([res?.post, ...comments]);
          alert({ type: "SUCCESS" });
          setComment("");
        }
      } catch (error) {}
    }
  }

  function renderTweet() {
    if (!tweet) {
      return <ScaleLoader color={"#36D7B7"} loading={true} />;
    }

    return (
      <TweetCard tweet={tweet} />
      // <div>
      //   <Link to={"/" + tweet?.UserInfo.NameUser}>
      //     <div style={{ display: "flex", marginTop: "10px" }}>
      //       <div
      //         style={{ textAlign: "left", marginTop: "10px" }}
      //         className="tweetcard-avatar-pop"
      //       >
      //         <img
      //           style={{ width: "45px", borderRadius: "100px" }}
      //           src={tweet?.UserInfo.Avatar}
      //         />
      //       </div>
      //       <div className="tweetcard-primary-pop">
      //         <h3>{tweet?.UserInfo.NameUser}</h3>
      //         <p style={{ color: "lightgray", fontSize: "15px" }}>
      //           @{tweet?.UserInfo.NameUser}
      //         </p>
      //       </div>
      //     </div>
      //   </Link>

      //   <div
      //     style={{
      //       marginTop: "10px",
      //       display: "flex",
      //       justifyContent: "left",
      //       marginBottom: "10px",
      //     }}
      //   >
      //     <p style={{ fontSize: "24px", color: "white" }}>{tweet?.Status}</p>
      //   </div>
      //   {tweet?.PostImage !== "" && (
      //     <div style={{ marginTop: "10px", display: "flex" }}>
      //       <img
      //         style={{ borderRadius: "20px", width: "100%" }}
      //         src={tweet?.PostImage}
      //         alt=""
      //       />
      //     </div>
      //   )}

      //   <div
      //     style={{
      //       width: "100%",
      //       margin: "10px auto",
      //       height: "1px",
      //       backgroundColor: "#ffffff1a",
      //       marginTop: "15px",
      //       marginBottom: "15px",
      //     }}
      //   />
      //   <div
      //     style={{ width: "70%", margin: "0 auto", textAlign: "center" }}
      //     className="tweetcard-icons"
      //   >
      //     <div className="tweetcard-icon-comment">
      //       <i style={{ fontSize: "16px" }} className="far fa-comment" />
      //       <div className="viewtweet-quantity">
      //         <div className="viewtweet-quantity-card">
      //           <p style={{ color: "white", paddingLeft: "10px" }}>
      //             {tweet?.Comments?.length}{" "}
      //           </p>
      //         </div>
      //       </div>
      //     </div>
      //     <div
      //       onClick={handleLike}
      //       style={{ color: isLiked && "red" }}
      //       className="tweetcard-icon-like"
      //     >
      //       {isLiked ? (
      //         <i style={{ fontSize: "16px" }} className="fas fa-heart" />
      //       ) : (
      //         <i style={{ fontSize: "16px" }} className="far fa-heart" />
      //       )}

      //       <div className="viewtweet-quantity">
      //         <div className="viewtweet-quantity-card">
      //           <p style={{ color: "white", paddingLeft: "10px" }}>
      //             {tweet?.Likes.length}{" "}
      //           </p>
      //         </div>
      //       </div>
      //     </div>
      //     <div className="tweetcard-icon-share">
      //       <i style={{ fontSize: "16px" }} className="fas fa-share" />
      //     </div>
      //   </div>
      //   <div
      //     style={{
      //       width: "100%",
      //       margin: "10px auto",
      //       height: "1px",
      //       backgroundColor: "#ffffff1a",
      //       marginTop: "10px",
      //       marginBottom: "10px",
      //     }}
      //   />
      // </div>
    );
  }
  function renderComments() {
    return (
      <div className="viewtweet-comments-container">
        {comments?.length > 0 &&
          comments?.map((comment) => (
            <TweetCard key={comment._id} tweet={comment} />
          ))}
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
        <div className={"viewtweet-popup-container"} >
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
                src={Avatar}
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
                placeholder="Postea tu respuesta"
                type="text"
              />
            </div>
          </div>
          <div className="usersettings-popup-close">
            <button
              onClick={createComment}
              className="viewtweet-button-reply"
              style={{ backgroundColor: "#770443" }}
            >
              Responder
            </button>
          </div>
          {renderComments()}
        </div>
      </div>
    </div>
  );
}
