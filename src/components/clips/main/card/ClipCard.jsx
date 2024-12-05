import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
// import "@tippyjs/react/dist/tippy.css";
import ScaleLoader from "react-spinners/ScaleLoader";
import CommentCard from "../../../clips/view/card/CommentCard";

import "./ClipCard.css";
import {
  CommentClip,
  DislikeClip,
  GetClipComments,
  GetClipCommentsLoguedo,
  likeClip,
  MoreViewOfTheClip,
} from "../../../../services/backGo/clip";
import { Grid, Typography } from "@mui/material";
import { retweet } from "../../../../services/tweet";
import { IoMdSend } from "react-icons/io";
import ShareDropdown from "../../../channel/dropdown/ShareDropdown";
import { useNotification } from "../../../Notifications/NotificationProvider";
import VideoClipsExplorar from "../../../../player/VideoClipsExplorar";

export default function ClipCard({ clip, isActive = 0, isMobile ,HandleShowComments}) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const playerRef = useRef();
  const [videoHover, setVideoHover] = useState(false);
  let token = window.localStorage.getItem("token");

  const [showComment, SetshowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [videoPlaying, setVideoPlaying] = useState(false);
  const canvasRef = useRef(null);
  const [page, setPage] = useState(1);
  const [loadingComments, setLoadingComments] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current;
    const canvas = canvasRef.current;

    return () => {
      if (player) {
        player.pause();
        URL.revokeObjectURL(player.src); // Limpiar el Blob
        player.src = "";
      }

      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Clear any running intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
  const getCommentsClipScroll = async (pageNumber = 1) => {
    if (!token) {
      const response = await GetClipComments(pageNumber, clip?.id);
      if (response?.data?.message === "ok") {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    } else {
      const response = await GetClipCommentsLoguedo(
        pageNumber,
        clip?.id,
        token
      );
      if (response?.data?.message === "ok" && response.data.data) {
        setComments((prevComments) => [...prevComments, ...response.data.data]);
      }
    }
  };

  useEffect(() => {
    const video = playerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      const width = video.offsetWidth || video.videoWidth;
      const height = video.offsetHeight || video.videoHeight;

      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const drawAmbilight = () => {
      const width = canvas.width;
      const height = canvas.height;

      if (width === 0 || height === 0) return; // Evita dibujar si el canvas no tiene tamaño

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);

      // Ajustar el blur dependiendo del tamaño de la pantalla
      const blurValue = window.innerWidth <= 768 ? "20px" : "50px";

      ctx.globalAlpha = 0.5;
      ctx.filter = `blur(${blurValue})`;
      ctx.drawImage(canvas, -25, -25, width + 50, height + 50);
      ctx.filter = "none";
      ctx.globalAlpha = 1.0;
    };

    const handleResize = () => {
      setCanvasSize();
      drawAmbilight();
    };

    if (video) {
      video.addEventListener("loadedmetadata", () => {
        setCanvasSize();
        drawAmbilight();
      });
    }

    window.addEventListener("resize", handleResize);
    const interval = setInterval(drawAmbilight, 30);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [videoHover]);

  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  const [dropdownShare, setDropdownShare] = useState(false);
  const alert = useNotification();
  useEffect(() => {
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

  const onMouseEnterShare = () => {
    if (dropdownShare === true) {
      setDropdownShare(false);
    } else {
      setDropdownShare(true);
    }
  };
  async function getCommentsClipAndShow() {
    if (showComment) {
      SetshowComment(false)
      return
    }

    let token = window.localStorage.getItem("token");
    if (!token ) {
      const response = await GetClipComments(1, clip?.id);
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
    let id = window.localStorage.getItem("_id");
    if (id) {
      setIsLiked(clip?.isLikedByID);
    }
  }, [clip]);

  const handleLoadedData = () => {
    setLoading(false);
  };
  const handlePlay = () => {
    if (playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setPlaying(!playing);
  };

  const hasTriggered = useRef(false);

  const handleAddviewClip = async () => {
    const videoElement = playerRef.current;
    if (videoElement) {
      const percentageWatched =
        videoElement.currentTime / videoElement.duration;
      if (percentageWatched >= 0.5 && !hasTriggered.current) {
        hasTriggered.current = true;
        const res = await MoreViewOfTheClip(clip?.id, token);
      }
    }
  };
  const handleProgress = (e) => {
    const { duration, currentTime } = e.target;
    setProgress((currentTime / duration) * 100);
    handleAddviewClip();
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
            clip.likeCount -= 1;
          }
        }
      } else {
        setIsLiked(true);
        let token = window.localStorage.getItem("token");
        let id = window.localStorage.getItem("_id");

        if (token && id) {
          const res = await likeClip(token, clip.id);
          if (res?.data?.message === "Like") {
            clip.likeCount += 1;
          }
        }
      }
    } catch (error) {}
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
  return (
    <div className="clipmain-card-main">
      <div
        className="clipsmain-container"
        style={{ margin: showComment ?? "0 auto" }}
      >
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignItems: "flex-start",
          }}
        >
          <Grid className="CardInfoUserClip">
            <Link to={`/${clip.NameUser}`}>
              <Grid
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <img
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "100px",
                  }}
                  src={clip.Avatar}
                />

                <Grid
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography style={{ color: "white", fontWeight: "bolder" }}>
                    @{clip.NameUser}
                  </Typography>
                  {/* <Typography style={{ color: "white" }}>
                    {clip.nameUserCreator}
                  </Typography> */}
                </Grid>
              </Grid>
            </Link>

            {/* <button
              // onClick={() => followUser()}
              style={{ marginLeft: "5px" }}
              className="channel-bottom-v2-button-follow"
            >
              Seguir
            </button> */}
          </Grid>

          <div
            onMouseEnter={() => setVideoHover(true)}
            onMouseLeave={() => setVideoHover(false)}
            className="clipsmain-video"
            style={{ width: isMobile && "75%", margin: isMobile && "0 auto" }}
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

            <div className="conetent-player-clip">
              {!videoPlaying ? (
                <div className="video-placeholder-loading">
                  <img src={clip.streamThumbnail} alt="" />
                </div>
              ) : null}
              <canvas ref={canvasRef} width="400" height="300" id="ambilight" />

              <div
                style={{
                  display: videoPlaying ? "" : "none",
                }}
              >
                <VideoClipsExplorar
                  videoRef={playerRef}
                  src={clip.url}
                  streamThumbnail={clip.streamThumbnail}
                  isMuted={muted}
                  volume={0.5}
                  onTimeUpdate={handleProgress} // Actualiza el progreso del video
                  onClick={handlePlay} // Maneja la reproducción al hacer click
                  onPlay={handleVideoPlay} // Llama al handler cuando el video comienza
                  onLoadStart={() => setLoading(true)}
                  height="100%"
                  width="100%"
                  preferredQuality={720}
                />
              </div>
            </div>
            {getButtonDuration()}
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
              <div className="channel-v2-info">
                <div
                  className="channel-v2-primary"
                  style={{
                    height: "38px",
                  }}
                >
                  <div className="channel-v2-categorie">
                    <Link to={`/${clip.NameUser}`}>
                      <Tippy
                        theme="pinkker"
                        content={
                          <>
                            <h1
                              style={{
                                fontSize: "12px",
                                fontFamily: "Montserrat",
                              }}
                            >
                              {clip.clipTitle}
                            </h1>
                          </>
                        }
                      >
                        {/* <img
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "100px",
                          }}
                          src={clip?.Avatar}
                        /> */}
                      </Tippy>
                    </Link>
                    <Grid
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "column",
                      }}
                    >
                      <h4
                        style={{
                          color: "#ededed",
                          padding: 10,
                          fontSize: "24px",
                        }}
                      >
                        {clip.clipTitle}
                      </h4>
                    </Grid>
                  </div>

                  <div className="channel-v2-content">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginRight: "0px",
                        }}
                        z
                      >
                        <Grid style={{ display: "flex", alignItems: "center" }}>
                          <i
                            style={{
                              marginRight: "7px",
                              color: "darkgray",
                              fontSize: "12px",
                            }}
                            class="fas fa-chart-bar"
                          />
                          <p
                            style={{
                              color: "darkgray",
                              fontSize: "15px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {clip.views} Vistas
                          </p>
                        </Grid>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>

        <div
          style={{
            width: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            left: showComment && "-55px",
            opacity: "1",
            top: "-134px",
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
                {clip?.likeCount}
              </h3>
            </div>
            {dropdownShare && (
              <div
                style={{
                  position: "relative",
                  right: "364px",
                }}
              >
                <ShareDropdown
                  title={clip.clipTitle}
                  streamer={"clips/getId/?videoUrl=" + clip.id}
                />
              </div>
            )}
            <div
              onClick={() => {getCommentsClipAndShow();HandleShowComments(showComment)}}
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
                {clip.CommentsCount}
              </h3>
            </div>

            <div className="clipcard-icon-share">
              <i
                onClick={() => onMouseEnterShare()}
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
    </div>
  );
}
