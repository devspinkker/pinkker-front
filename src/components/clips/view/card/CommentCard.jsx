import React, { useState, useEffect } from "react";

import "./CommentCard.css";
import { Link } from "react-router-dom";
import {
  DeleteComment,
  LikeCommentClip,
  UnlikeComment,
} from "../../../../services/backGo/clip";
import { IconButton } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";

export default function CommentCard({
  comment,
  OwnerClip = null,
  idCommentDelete,
}) {
  const [isLiked, setIsLiked] = useState(null);

  const [likes, setLikes] = useState(null);
  const [respuesta, setRespuesta] = useState(false);
  let id = window.localStorage.getItem("_id");
  let token = window.localStorage.getItem("token");

  const [commentAnswer, setCommentAnswer] = useState(false);
  const [avatar, SetAvatar] = useState(null);
  const HandleDeleteComment = async () => {
    await DeleteComment(token, comment._id);
    idCommentDelete(comment._id);
  };

  useEffect(() => {
    let avatar = window.localStorage.getItem("avatar");
    if (avatar) {
      SetAvatar(avatar);
    }
    setIsLiked(true);
    if (id) {
      setIsLiked(comment?.isLikedByID);
    }
  }, []);
  const handleLike = async () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        let id = window.localStorage.getItem("_id");
        if (token && id) {
          const res = await UnlikeComment(token, comment._id);
          if (res?.data?.message === "Dislike") {
            comment.likeCount -= 1;
          }
        }
      } else {
        setIsLiked(true);

        if (token && id) {
          const res = await LikeCommentClip(token, comment._id);
          if (res?.data?.message === "Like") {
            comment.likeCount += 1;
          }
        }
      }
    } catch (error) {}
  };

  async function createReply() {
    // const data = await addCommentToComment(token, commentAnswer, comment._id);
    // const date = new Date();
    // setCommentAnswer(null);
    // setRespuesta(false);
    // comment.comments.push({
    //   name: user.name,
    //   avatar: user.avatar,
    //   comment: commentAnswer,
    //   date: date,
    // });
  }

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
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
  }

  return (
    <div style={{ minHeight: "25px" }} className="tweetcard-body">
      <div className="tweetcard-avatar">
        <img
          style={{
            width: "50px",
            borderRadius: "100%",
            position: "relative",
            left: "-10px",
          }}
          src={comment.Avatar}
        />
      </div>

      <div style={{ marginLeft: "5px" }} className="tweetcard-primary">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to={"/" + comment.NameUser}>
            <h4>{comment.NameUser}</h4>
          </Link>
        </div>
        <p style={{ color: "lightgray", marginLeft: "5px", fontSize: "15px" }}>
          {" "}
          {comment.comment}
        </p>

        <div style={{ justifyContent: "left" }} className="tweetcard-icons">
          <div style={{ color: "lightgray" }}>
            <p style={{ fontSize: "13px" }}>{timeSince(comment.createdAt)}</p>
          </div>
          <div className="tweetcard-icon-like">
            <p style={{ marginLeft: "10px", fontSize: "13px" }}>
              {comment.likeCount} Me gustas
            </p>
          </div>
          {/* <div style={{ color: "lightgray", marginLeft: "10px" }}>
            <p
              onClick={() => setRespuesta(!respuesta)}
              style={{ fontSize: "13px" }}
            >
              Responder
            </p>
          </div> */}
        </div>

        {respuesta === true && (
          <div className="comment-answer-input">
            {avatar && (
              <img
                style={{
                  width: "30px",
                  position: "relative",
                  top: "3px",
                  marginRight: "5px",
                }}
                src={avatar}
              />
            )}
            <input
              placeholder="Escribi tu respuesta..."
              type="text"
              onChange={(e) => setCommentAnswer(e.target.value)}
            />
            <button
              onClick={() => createReply()}
              style={{
                width: "75px",
                fontSize: "11px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "5px",
              }}
              className="viewtweet-button-reply"
            >
              Responder
            </button>
          </div>
        )}

        {/* {comment.comments.length >= 1 && respuestaComments === true && (
          <div
            onClick={() => setRespuestaComments(false)}
            style={{ marginTop: "5px" }}
          >
            <div style={{ color: "white" }}>
              <p style={{ fontSize: "13px" }}>Ocultar respuestas</p>
            </div>
          </div>
        )} */}

        {/* {comment.comments.length >= 1 && respuestaComments === false && (
          <div
            onClick={() => setRespuestaComments(true)}
            style={{ marginTop: "5px" }}
          >
            <div style={{ color: "white" }}>
              <p style={{ fontSize: "13px" }}>
                Ver respuestas ({comment.comments.length})
              </p>
            </div>
          </div>
        )} */}

        {/* {respuestaComments === true &&
          comment.comments.map((commentReply) => (
            <div className="comment-answer-input">
              <img
                style={{
                  width: "30px",
                  position: "relative",
                  top: "3px",
                  marginRight: "5px",
                }}
                src={commentReply.avatar}
              />
              <h4>{commentReply.name}</h4>
              <p
                style={{
                  color: "lightgray",
                  marginLeft: "5px",
                  fontSize: "15px",
                }}
              >
                {" "}
                {commentReply.comment}
              </p>
            </div>
          ))} */}
      </div>

      {OwnerClip && OwnerClip === id && (
        <IconButton
          aria-label="delete"
          color="inherit"
          onClick={HandleDeleteComment}
        >
          {" "}
          <FaTrashAlt style={{ color: "white", fontSize: "20px" }} />
        </IconButton>
      )}
      <div style={{ color: isLiked && "red" }} className="tweetcard-icon-like">
        {isLiked ? (
          <i
            onClick={() => handleLike()}
            style={{ fontSize: "14px" }}
            class="fas fa-heart"
          />
        ) : (
          <i
            onClick={() => handleLike()}
            style={{ fontSize: "14px" }}
            class="far fa-heart"
          />
        )}
      </div>
    </div>
  );
}
