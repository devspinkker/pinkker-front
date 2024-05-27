import React, { useState, useEffect } from "react";

import "./ClipView.css";

import { useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import {
  getClipById,
  getClipByIdWithToken,
  likeClip,
} from "../../../services/vods";

import { addView } from "../../../services/views";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import Player from "../player/Player";

import CommentCard from "./card/CommentCard";

import {
  addComment,
  getAllCommentsInVideoWithAuth,
} from "../../../services/commentsClip";
import { ScaleLoader } from "react-spinners";
import { useNotification } from "../../Notifications/NotificationProvider";

import ShareDropdown from "../../channel/dropdown/ShareDropdown";

export default function ClipView() {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState(null);
  const [comments, setComments] = useState(null);

  const alert = useNotification();

  const { clipId } = useParams();

  const [clip, setClip] = useState(null);

  const [dropdownShare, setDropdownShare] = useState(false);

  useEffect(() => {
    if (token != null && token != undefined && token != "") {
      const fetchData = async () => {
        const clipData = await getClipByIdWithToken(token, clipId);
        if (clipData != null && clipData != undefined) {
          setClip(clipData);
          setIsLiked(clipData.likedByMe);
        }

        const data = await getAllCommentsInVideoWithAuth(token, clipId);
        if (data != null && data != undefined) {
          setComments(data);
        }

        await addView(token, clipId, 0);
      };
      fetchData();
    }
  }, [token]);

  async function handleLike() {
    if (isLiked) {
      setIsLiked(false);
      clip.totalLikes = clip.totalLikes - 1;
    } else {
      setIsLiked(true);
      clip.totalLikes = clip.totalLikes + 1;
    }
    await likeClip(token, clip._id);
  }

  const onMouseEnterShare = () => {
    if (dropdownShare === true) {
      setDropdownShare(false);
    } else {
      setDropdownShare(true);
    }
  };

  function handleUpdate() {
    const fetchData = async () => {
      const data = await getAllCommentsInVideoWithAuth(token, clipId);
      if (data != null && data != undefined) {
        setComments(data);
      }
    };
    fetchData();
  }

  function Primary() {
    if (clip != null) {
      return (
        <div className="clipview-primary">
          <Player style={{ width: "95%" }} url={clip.url} />
        </div>
      );
    } else {
      return (
        <div
          style={{
            minHeight: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ScaleLoader width={4} height={20} color="#f36197d7" />
        </div>
      );
    }
  }

  function createComment() {
    if (comment.trim() != "") {
      addComment(token, comment, clipId, 1).then((res) => {
        if (res.data != null && res.data != undefined) {
          alert({ type: "SUCCESS", message: res.data.msg });
          setComment("");
          handleUpdate();
        }
      });
    }
  }

  //const comments = {name: "asd123", avatar: "https://res.cloudinary.com/pinkker/image/upload/v1643142453/avatar/jpmm4oh2gmimzce1ls2a.jpg", text: "Esto es una prueba", totalLikes: 5}

  function Secondary() {
    if (clip != null) {
      return (
        <div className="clipview-secondary">
          <div className="clipview-content">
            <div className="clipview-primary-title">
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  style={{ width: "35px", marginRight: "5px" }}
                  src={user.avatar}
                />
                <div>
                  <h3>{user.name}</h3>
                  <p style={{ color: "darkgray", fontSize: "14px" }}>
                    @{user.name} · 29/11
                  </p>
                </div>
              </div>
              <p
                style={{
                  marginTop: "20px",
                  textTransform: "uppercase",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {clip.clipName}
              </p>
              <p style={{ color: "lightgray" }}>
                <a>{clip.stream.stream_category}</a> · Clip de{" "}
                <a>{clip.name}</a>
              </p>

              <div className="clipcard-icons-container">
                <div
                  onClick={() => handleLike()}
                  style={{
                    color: isLiked && "red",
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="clipcard-icon-like"
                >
                  {isLiked ? (
                    <i
                      style={{
                        backgroundColor: "#303030",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                      class="fas fa-heart"
                    />
                  ) : (
                    <i
                      style={{
                        backgroundColor: "#303030",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                      class="far fa-heart"
                    />
                  )}
                  <h3 style={{ fontSize: "16px", marginLeft: "5px" }}>
                    {clip.totalLikes}
                  </h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                  className="clipcard-icon-comment"
                >
                  <i
                    style={{
                      backgroundColor: "#303030",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                    class="fas fa-comment"
                  />
                  <h3 style={{ fontSize: "16px", marginLeft: "5px" }}>
                    {clip.totalComments}
                  </h3>
                </div>

                <div
                  onClick={() => onMouseEnterShare()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                  className="clipcard-icon-share"
                >
                  <i
                    style={{
                      backgroundColor: "#303030",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                    }}
                    class="fas fa-share"
                  />
                  {dropdownShare && (
                    <ShareDropdown
                      clip={true}
                      clipId={clip._id}
                      title={clip.stream.stream_title}
                      streamer={clip.streamer}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="clipcard-comments-container">
              {comments != null ? (
                comments.map((comment) => <CommentCard comment={comment} />)
              ) : (
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
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
                marginBottom: "10px",
              }}
              className="clipcard-send-comment"
            >
              <div>
                <img
                  style={{ width: "50px", borderRadius: "100px" }}
                  src={user.avatar}
                />
              </div>

              <div
                style={{ marginLeft: "10px", height: "50px" }}
                className="muro-send-tweet-input"
              >
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    borderBottom: "1px solid white",
                    height: "30px",
                    width: "90%",
                  }}
                  placeholder="Comenta el clip.."
                  type="text"
                />
              </div>

              <div>
                <button
                  onClick={() => createComment()}
                  className="viewtweet-button-reply"
                >
                  Responder
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="clipview-body">
      <div className="clipview-container">
        {Primary()}
        {Secondary()}
      </div>
    </div>
  );
}
