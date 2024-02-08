import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
// import "@tippyjs/react/dist/tippy.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import CommentCard from "../../../clips/view/card/CommentCard";

import "./ClipCard.css";
import { DislikeClip, likeClip } from "../../../../services/backGo/clip";

export default function ClipCard({ clip }) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const playerRef = useRef();
  const [videoHover, setVideoHover] = useState(false);

  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const id = window.localStorage.getItem("_id");
    if (id && clip.likes.includes(id)) {
      setIsLiked(true);
    }
  }, [clip]);
  const handlePlay = () => {
    if (playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleProgress = (e) => {
    const { duration, currentTime } = e.target;
    setProgress((currentTime / duration) * 100);
  };

  const handleMute = () => {
    playerRef.current.muted = !muted;
    setMuted(!muted);
  };

  function parseDuration(duration) {
    let fullDuration = parseInt(duration);
    let minutes = Math.floor(fullDuration / 60);
    let seconds = fullDuration - minutes * 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
  }

  function getButtonDuration() {
    if (playerRef.current != null && playerRef.current != undefined) {
      return (
        <div className="clipcard-progress-body">
          <p
            style={{ width: "97%", position: "relative", top: "-10px" }}
            className="controlsTime"
          >
            {parseDuration(playerRef.current.currentTime)}/
            {parseDuration(playerRef.current.duration)}
          </p>
          <div
            style={{
              width: "100%",
              borderRadius: "0",
              height: videoHover ? "5px" : "2px",
            }}
            className="time_progressbarContainer"
          >
            <div
              style={{ width: `${progress}%` }}
              className="time_progressBar"
            ></div>
          </div>
        </div>
      );
    }
  }

  const handleLike = async () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        let token = window.localStorage.getItem("token");
        let id = window.localStorage.getItem("_id");
        if (token && id) {
          const res = await DislikeClip(token, clip.id);
          if (res?.data?.message === "Dislike") {
            clip.likes = clip.likes.filter((userId) => userId !== id);
          }
        }
      } else {
        setIsLiked(true);
        let token = window.localStorage.getItem("token");
        let id = window.localStorage.getItem("_id");

        if (token && id) {
          const res = await likeClip(token, clip.id);
          if (res?.data?.message === "Like") {
            clip.likes.push(id);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createComment = () => {
    if (comment.trim() !== "") {
    }
  };

  return (
    <div className="clipmain-card-main">
      <div className="clipsmain-container">
        <div
          onMouseEnter={() => setVideoHover(true)}
          onMouseLeave={() => setVideoHover(false)}
          className="clipsmain-video"
        >
          <div className="clipsmain-top-buttons">
            {playing ? (
              <i
                style={{ opacity: "0" }}
                className="fas fa-pause button-more-player"
              />
            ) : (
              <i
                style={{ opacity: "0" }}
                className="fas fa-play button-more-player"
              />
            )}
            <Tippy
              theme="pinkker"
              content={
                <h1 style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
                  Volumen
                </h1>
              }
            >
              <i
                onClick={handleMute}
                className={`fas ${
                  muted ? "fa-volume-mute" : "fa-volume-up"
                } button-more-player`}
              />
            </Tippy>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <video
              onTimeUpdate={handleProgress}
              onClick={handlePlay}
              ref={playerRef}
              loop={true}
              autoPlay={true}
              muted={muted}
              controls={true}
              src={clip.url}
            />
            {getButtonDuration()}
          </div>

          {playing === false && (
            <div className="clipcard-muted">
              <i
                onClick={handlePlay}
                style={{
                  cursor: "pointer",
                  fontSize: "44px",
                  color: "lightgray",
                }}
                className="fas fa-play button-more-player"
              />
            </div>
          )}

          <div className="clipsmain-bottom-buttons">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <div>
                  <Link to={`/${clip.streamerId}`}>
                    <img
                      style={{
                        width: "30px",
                        borderRadius: "50px",
                        marginRight: "5px",
                      }}
                      src={clip.Avatar}
                      alt=""
                    />
                  </Link>
                </div>
                <Link to={`/${clip.streamerId}`}>
                  <h3
                    style={{
                      color: "white",
                    }}
                  >
                    {clip.streamerId}
                  </h3>
                </Link>
                {/* <button
                  style={{
                    marginTop: "0px",
                    marginLeft: "10px",
                    padding: "3px",
                    fontSize: "11px",
                    width: "55px",
                  }}
                  className="channel-bottom-v2-button-follow"
                >
                  Seguir
                </button> */}
              </div>
            </div>
            <div style={{ position: "relative", top: "10px" }}>
              <p style={{ fontWeight: "400", color: "#ededed" }}>
                {clip.clipTitle}
              </p>
              <div style={{ display: "flex" }}>
                {/* {clip.stream.stream_tag.map((tag) => (
                  <p
                    style={{ textAlign: "left", fontWeight: "600" }}
                    className="channel-title-tag"
                  >
                    #{tag}
                  </p>
                ))} */}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            left: "30px",
            opacity: showComment && "0",
          }}
          className="clipsmain-right-buttons"
        >
          <div>
            <div
              onClick={() => handleLike()}
              style={{ color: isLiked && "#f36196" }}
              className="clipcard-icon-like"
            >
              {isLiked ? (
                <i
                  style={{
                    backgroundColor: "#303030",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                  className="fas fa-heart"
                />
              ) : (
                <i
                  style={{
                    backgroundColor: "#303030",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                  className="far fa-heart"
                />
              )}
              <h3 style={{ fontSize: "15px", marginTop: "5px" }}>
                {clip.likes.length}
              </h3>
            </div>

            <div
              onClick={() => setShowComment(true)}
              className="clipcard-icon-comment"
            >
              <i
                style={{
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
                className="fas fa-comment"
              />
              <h3 style={{ fontSize: "15px", marginTop: "5px" }}>
                {clip.totalComments}
              </h3>
            </div>

            <div className="clipcard-icon-share">
              <i
                style={{
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
                className="fas fa-share"
              />
            </div>

            <div className="clipcard-icon-share">
              <i
                style={{
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
                className="fas fa-ellipsis-v"
              />
            </div>
          </div>
        </div>
      </div>

      {showComment && (
        <div className="clipmain-comments-container">
          <div
            style={{
              width: "375px",
              backgroundColor: "#151515",
              padding: "20px",
            }}
            className="clipcard-comments-container"
          >
            <div
              style={{ position: "relative", top: "-20px" }}
              className="embleminfo-close"
            >
              <i
                onClick={() => setShowComment(false)}
                style={{
                  cursor: "pointer",
                  color: "#ededed",
                  fontSize: "16px",
                }}
                className="fas fa-times"
              />
            </div>
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
              marginTop: "5px",
              marginBottom: "10px",
              backgroundColor: "#151515",
            }}
            className="clipcard-send-comment"
          >
            <div>
              <img
                style={{ width: "30px", borderRadius: "100px" }}
                src={clip.avatar}
                alt=""
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
                  fontSize: "16px",
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
      )}
    </div>
  );
}
