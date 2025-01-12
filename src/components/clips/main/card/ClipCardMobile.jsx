import React, { useState, useEffect, useRef } from "react";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import ScaleLoader from "react-spinners/ScaleLoader";
import ShareDropdown from "../../../channel/dropdown/ShareDropdown";
import CommentCard from "../../../clips/view/card/CommentCard";
import {
  CommentClip,
  DislikeClip,
  GetClipComments,
  GetClipCommentsLoguedo,
  likeClip,
  MoreViewOfTheClip,
} from "../../../../services/backGo/clip";
import VideoClipsExplorar from "../../../../player/VideoClipsExplorar";
import "./ClipCardMobile.css";
import { IoMdSend } from "react-icons/io";
import { useNotification } from "../../../Notifications/NotificationProvider";
import { Link } from "react-router-dom";

const ClipCardMobile = ({ clip, isActive = 0, isMobile   ,HandleShowComments}) => {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const playerRef = useRef();
  const [videoHover, setVideoHover] = useState(false);
  const [showComment, SetshowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingComments, setLoadingComments] = useState(false);
  const intervalRef = useRef(null);
  const token = window.localStorage.getItem("token");
  const alert = useNotification();
  const getCommentsClipScroll = async (page = 1) => {
    if (!token) {
      const response = await GetClipComments(page, clip?.id);
      if (response?.data?.message === "ok") {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    } else {
      const response = await GetClipCommentsLoguedo(
        page,
        clip?.id,
        token
      );
      if (response?.data?.message === "ok" && response.data.data) {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    }
  };
  const getCommentsClip = async (page = 1) => {
    if (!token) {
      const response = await GetClipComments(page, clip?.id);
      if (response?.data?.message === "ok") {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    } else {
      const response = await GetClipCommentsLoguedo(
        page,
        clip?.id,
        token
      );
      if (response?.data?.message === "ok" && response.data.data) {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    }
  };
  const handleLike = async () => {
    if (!isLiked) {
      await likeClip(token,clip.id);
      setIsLiked(true);
    } else {
      await DislikeClip(token,clip.id);
      setIsLiked(false);
    }
  };
  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !loadingComments) {
      setLoadingComments(true);

      intervalRef.current = setInterval(async () => {
        setPage((prevPage) => prevPage + 1);
        await getCommentsClipScroll(page + 1);
      }, 2000);
    }
  };
  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      await CommentClip(clip.id, comment);
      const updatedComments = await GetClipCommentsLoguedo(  page,
        clip?.id,
        token);
      setComments(updatedComments);
      setComment("");
    }
  };
  const handleMute = () => {
    playerRef.current.muted = !muted;
    setMuted(!muted);
  };

  const createComment = () => {
    const token = window.localStorage.getItem("token");
    if (comment.trim() != "") {
      CommentClip(token, clip?.id, comment).then((res) => {
        if (res.data != null && res.data != undefined && res.data.data._id) {
          if (comments) {
            setComments([res.data.data, ...comments]);
          } else {
            setComments([res.data.data]);
          }
          setComment("");
          alert({ type: "SUCCESS" });
        }
      });
    }
  };
  async function getCommentsClipAndShow() {
    let token = window.localStorage.getItem("token");
    if (showComment) {
      SetshowComment(false)
      return
    }

    if (!token ) {
      const response = await GetClipComments(1, clip?.id);
      SetshowComment(!showComment);
      if (response?.data?.message === "ok") {
        setComments(response.data.data);
      }
    } else {
      const response = await GetClipCommentsLoguedo(1, clip?.id, token);
      SetshowComment(!showComment);
      if (response?.data?.message === "ok") {
        setComments(response.data.data);
      }
    }
  }
  useEffect(() => {
    setIsLiked(clip.isLikedByID)
    const player = playerRef.current;

    if (!player) return;

    if (isActive === 2) {
      player.pause();
      player.muted = true;
      setMuted(true);

      setTimeout(() => {
        player
          .play()
          .then(() => {
            setTimeout(() => {
              player.muted = false;
              setMuted(false);
            }, 200);
          })
          .catch((error) => {
            console.error("Error playing video:", error);
          });
      }, 200);
    } else if (isActive === 1) {
      player.pause();
      setTimeout(() => {
        player.muted = true;
        setMuted(true);
      }, 200);
    } else {
      player
        .play()
        .then(() => {
          setPlaying(false);
          setTimeout(() => {
            player.muted = false;
            setMuted(false);
          }, 200);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
        });
    }
  }, [isActive]);
  const handlePlay = () => {
    if (playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setPlaying(!playing);
  };
useEffect(() => {
  const player = playerRef.current;

  if (!player) return;

  const handlePause = () => {
    setPlaying(false);
  };

  player.addEventListener("pause", handlePause);

  return () => {
    player.removeEventListener("pause", handlePause);
  };
}, []);

  return (
    <div   className={`clip-card-mobile ${loading ? "loading" : ""}`}>
      {/* Video */}
      <VideoClipsExplorar
        videoRef={playerRef}
        src={clip.url}
        streamThumbnail={clip.streamThumbnail}
        isMuted={muted}
        volume={0.5}
        onTimeUpdate={(e) => setProgress(e.target.currentTime)}
        onClick={handlePlay}
        onLoadStart={() => setLoading(true)}
        onLoadedData={() => setLoading(false)}
        height="100%"
        width="100%"
        preferredQuality={720}
      />

      {/* Información del video */}
      <Box className="video-info-mobile">
        <Box className="text-info">
          <Grid container alignItems="center" style={{ gap: "5px" }}>
          <img
                style={{ width: "30px", borderRadius: "50%", height: "30px" }}
                src={clip.Avatar}
                alt=""
              />
            <Typography variant="h6" component="h3">
              <Link to={`/${clip.NameUser}`}>
              {clip.NameUser} ●
              
              </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Clipeado por {clip.nameUserCreator}
            </Typography>
          </Grid>
          <Typography variant="subtitle1">{clip.clipTitle}</Typography>
        </Box>
      </Box>

      {/* Iconos de interacción */}
      <Box className="video-actions-mobile">
      {!playing  && (
              <div className="clipcard-muted-mobile">
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
            <div>
              {playing ? (

                <i
                  style={{ opacity: "0" }}
                  className="fas fa-pause button-more-player"
                />
              ) : (
                // <h2>AAAA</h2>
                <i
                  style={{ opacity: "0" }}
                  className="fas fa-play button-more-player"
                />
              )}
            </div>

      <div className="clipsmain-top-buttons-mobile">

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
        <IconButton className="action-icon" onClick={handleLike}>
          <FaHeart size={24} color={isLiked ? "red" : "white"} />
          <Typography variant="body2">{clip.likeCount}</Typography>
        </IconButton>
        <IconButton
          onClick={() =>{getCommentsClipAndShow();HandleShowComments(showComment)}}

          className="action-icon"
        >
          <FaComment size={24}  />
          <Typography variant="body2">{clip.CommentsCount}</Typography>
        </IconButton>
        <Tippy
          content={<ShareDropdown clip={clip} />}
          interactive
          trigger="click"
        >
          <IconButton className="action-icon">
            <FaShare size={24} />
            <Typography variant="body2">Compartir</Typography>
          </IconButton>
        </Tippy>
      </Box>

      {/* Sección de comentarios */}

      {showComment && (
        <div className="clipmain-comments-container-mobile">
          <div
            style={{
              width: "375px",
              backgroundColor: "#151515",
              padding: "20px",
            }}
            className="clipcard-comments-container"
            onScroll={handleScroll}
          >
            <div
              style={{ position: "relative", top: "-20px" }}
              className="embleminfo-close"
            >
              <i 
                onClick={() => {SetshowComment(false);HandleShowComments(true)}}
                style={{
                  cursor: "pointer",
                  color: "#ededed",
                  fontSize: "16px",
                }}
                className="fas fa-times"
              />
            </div>

            {comments != null ? (
              <div>
                {comments?.map((comment) => {
                  return (
                    <div key={comment._id}>
                      <CommentCard comment={comment} />
                    </div>
                  );
                })}
                {loadingComments && (
                  <div className="loader-comments">
                    <ScaleLoader color="#ffffff" />
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  minHeight: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h4 style={{ color: "white" }}>No hay comentarios!</h4>
                {/* <ScaleLoader width={4} height={20} color="#f36197d7" /> */}
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
              justifyContent: "space-between",
            }}
            className="clipcard-send-comment"
          >
            <div>
              <img
                style={{ width: "30px", borderRadius: "50%", height: "30px" }}
                src={clip.Avatar}
                alt=""
              />
            </div>

            <div className="-input">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  fontSize: "16px",
                }}
                placeholder="Comenta el clip..."
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    createComment();
                  }
                }}
              />
            </div>

            <div>
              <button
                onClick={() => createComment()}
                className="viewtweet-button-reply"
              >
                <IoMdSend />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader */}
      {/* {loading && (
        <div className="loading-spinner">
          <ScaleLoader color="#36d7b7" />
        </div>
      )} */}
    </div>
  );
};

export default ClipCardMobile;
