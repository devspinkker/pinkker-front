import React, { useState, useEffect, useRef } from "react";
import "./ViewTweetGallery.css";
import { useSelector } from "react-redux";
import { useNotification } from "../../Notifications/NotificationProvider";
import { ScaleLoader } from "react-spinners";
import { Link, useHistory, useLocation } from "react-router-dom";
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
import { Box, Drawer, IconButton, TextField, Typography } from "@mui/material";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";

export default function ViewTweetGallery({
  closePopup,
  isMobile,
  tweet,
  tyExpanded,
}) {
  const [Avatar, setAvatar] = useState("");
  let location = useLocation();

  const alert = useNotification();
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(null);
  const [openTweet, setOpenTweet] = useState(false);
  const token = window.localStorage.getItem("token");
  const [page, setPage] = useState(1);
  const IdPost = tweet?._id;
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenTweet(open);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await GetCommentPost(tweet?._id, page, token);
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

  const intervalRef = useRef(null);
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      if (!intervalRef.current) {
        intervalRef.current = setTimeout(async () => {
          setPage((prevPage) => prevPage + 1);
          await GetCommentsScroll(page + 1);
          intervalRef.current = null;
        }, 1000);
      }
    }
  };

  const GetCommentsScroll = async (pageP) => {
    try {
      const commentsData = await GetCommentPost(IdPost, pageP, token);
      if (commentsData.data.message === "ok") {
        if (commentsData.data?.data) {
          setComments((prevComments) => [
            ...prevComments,
            ...commentsData.data.data,
          ]);
        }
      }
    } catch (error) {
      console.error("Error al obtener los comentarios:", error);
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
      <TweetCard tweet={tweet} isMobile={isMobile} />
      // <div>
      //   <Link to={"/" + tweet?.UserInfo.NameUser}>
      //     <div style={{ display: "flex", marginTop: "10px" }}>
      //       <div
      //         style={{ textAlign: "left", marginTop: "10px" }}
      //         className="gallery-tweetcard-avatar-pop"
      //       >
      //         <img
      //           style={{ width: "45px", borderRadius: "100px" }}
      //           src={tweet?.UserInfo.Avatar}
      //         />
      //       </div>
      //       <div className="gallery-tweetcard-primary-pop">
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
      //     className="gallery-tweetcard-icons"
      //   >
      //     <div className="gallery-tweetcard-icon-comment">
      //       <i style={{ fontSize: "16px" }} className="gallery-far fa-comment" />
      //       <div className="gallery-viewtweet-quantity">
      //         <div className="gallery-viewtweet-quantity-card">
      //           <p style={{ color: "white", paddingLeft: "10px" }}>
      //             {tweet?.Comments?.length}{" "}
      //           </p>
      //         </div>
      //       </div>
      //     </div>
      //     <div
      //       onClick={handleLike}
      //       style={{ color: isLiked && "red" }}
      //       className="gallery-tweetcard-icon-like"
      //     >
      //       {isLiked ? (
      //         <i style={{ fontSize: "16px" }} className="gallery-fas fa-heart" />
      //       ) : (
      //         <i style={{ fontSize: "16px" }} className="gallery-far fa-heart" />
      //       )}

      //       <div className="gallery-viewtweet-quantity">
      //         <div className="gallery-viewtweet-quantity-card">
      //           <p style={{ color: "white", paddingLeft: "10px" }}>
      //             {tweet?.Likes.length}{" "}
      //           </p>
      //         </div>
      //       </div>
      //     </div>
      //     <div className="gallery-tweetcard-icon-share">
      //       <i style={{ fontSize: "16px" }} className="gallery-fas fa-share" />
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
      <div
        onScroll={handleScroll}
        style={{
          overflowY: "scroll",
        }}
        className="gallery-viewtweet-comments-container"
      >
        {comments?.length > 0 &&
          comments?.map((comment) => (
            <TweetCard key={comment._id} tweet={comment} isMobile={isMobile} />
          ))}
      </div>
    );
  }

  let history = useHistory();

  const goBack = () => {
    history.push("/plataform/Comunidades");
  };
  return (
    <div className="gallery-viewtweet-popup-body">
      <div>
        <div className="gallery-viewtweet-popup-container">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
              alignItems: "center",
              padding: "5px",
              cursor: "pointer",
            }}
          >
            <IoArrowBackCircleOutline
              style={{
                color: "white",
                fontSize: "2rem",
                position: "fixed",
                zIndex: "100000",
              }}
              onClick={closePopup}
            />
            <Typography
              style={{ color: "white", fontSize: "1.5rem", marginLeft: "30px" }}
            >
              Volver
            </Typography>
          </div>
          {renderTweet()}
          {!isMobile && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "20px",
                  marginBottom: "10px",
                  borderBottom: "1px solid rgb(42, 46, 56)",
                  paddingBottom: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "100px",
                      }}
                      src={Avatar}
                    />
                  </div>
                  <div className="gallery-muro-send-tweet-input">
                    <textarea
                      className="gallery-muro-send-tweet-input-respuesta"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Postea tu respuesta"
                      type="text"
                    />
                  </div>
                </div>

                <div className="gallery-usersettings-popup-close">
                  <button
                    onClick={createComment}
                    disabled={comment?.length <= 0}
                    className="gallery-viewtweet-button-reply"
                    style={{
                      backgroundColor:
                        comment.length <= 0 ? "gray" : "rgb(255, 105, 196)",
                      cursor: comment.length <= 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    <Typography style={{ fontSize: "14px" }}>
                      Responder
                    </Typography>
                  </button>
                </div>
              </div>
            </>
          )}

          {location.pathname?.includes("/post") &&
            isMobile &&
            token?.length && (
              <IconButton
                style={{
                  color: "#fff",
                  position: "fixed",
                  bottom: "10%",
                  right: "3%",
                  backgroundColor: "#ff69c4",
                  zIndex: 99999999,
                }}
                aria-label="fingerprint"
                color="secondary"
                onClick={() => setOpenTweet(!openTweet)}
              >
                {<HiChatBubbleLeftEllipsis style={{ fontSize: "3.5rem" }} />}
              </IconButton>
            )}
          {
            <Drawer
              anchor="bottom"
              open={openTweet}
              onClose={toggleDrawer(false)}
              transitionDuration={{ enter: 500, exit: 500 }}
              PaperProps={{
                style: { height: "93%", backgroundColor: "#080808" },
              }} // Esto asegura que el Drawer ocupe todo el alto
            >
              <Box
                sx={{
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "2rem",
                }}
                role="presentation"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <IoArrowBackCircleOutline
                    style={{ color: "white", fontSize: "2.5rem" }}
                    onClick={() => setOpenTweet(false)}
                  />
                  <button
                    onClick={() => createComment()}
                    className="gallery-muro-send-tweet-button"
                  >
                    {location.pathname.includes("/post")
                      ? "Responder"
                      : "Postear"}
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div>
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "100%",
                      }}
                      src={Avatar}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <TextField
                      label="Publica tu respuesta"
                      variant="outlined"
                      fullWidth
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      multiline
                      rows={4}
                      InputProps={{
                        style: {
                          color: "white",
                          borderColor: "white",
                        },
                        classes: {
                          notchedOutline: {
                            borderColor: "white",
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "white",
                          },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "white",
                          },
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "white",
                          },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiInputLabel-outlined": {
                          color: "white",
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "white",
                          opacity: 1,
                        },
                      }}
                      // sx={{ flex: 1, marginBottom: 2, color:'white' }}
                    />
                    <Typography
                      variant="subtitle1"
                      style={{
                        marginTop: "10px",
                        color: comment?.length > 100 ? "red" : "white",
                        textAlign: "right",
                      }}
                    >
                      {comment.length}/100
                    </Typography>
                  </div>
                </div>
              </Box>
            </Drawer>
          }

          {renderComments()}
        </div>
      </div>
    </div>
  );
}
