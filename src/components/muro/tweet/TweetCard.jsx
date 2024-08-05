import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
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
import { Grid, Typography, Skeleton, Drawer, Box, Button, Dialog } from "@mui/material";
import { FaChartSimple, FaEllipsis, FaFacebook, FaHeart, FaLinkedin, FaRegComment, FaRegCopy, FaRetweet, FaTwitter } from "react-icons/fa6";
import CitaCard from "./CitaCard";
import PostComment from "./PostComment";
import { TbLocationShare } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoMdCloseCircleOutline } from "react-icons/io";


export default function TweetCard({ tweet, isMobile }) {
  const location = useLocation();

  const [popupTweetView, setPopupTweetView] = useState(false);
  const [popupCiteTweet, setPopupCiteTweet] = useState(false);
  const [showDropdownRetweet, setShowDropdownRetweet] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweet, setIsRetweet] = useState(false);
  const history = useHistory();

  const alert = useNotification();

  function togglePopupTweetView() {
    setPopupTweetView(!popupTweetView);
    let id;
    if (tweet?.Type === "RePost") {
      id = tweet?.OriginalPostData?._id;
    } else {
      id = tweet?._id;
    }
    history.push(`/post/${tweet?.UserInfo?.NameUser}/${id}`);
  }

  function togglePopupCiteTweet() {
    setPopupCiteTweet(!popupCiteTweet);
  }

  function calculateTimeDifference(postDate) {
    const currentDate = new Date();
    const tweetDate = new Date(postDate);
    const difference = Math.abs(currentDate - tweetDate);
    const minutesDifference = Math.floor(difference / (1000 * 60));

    if (minutesDifference < 60) {
      return `${minutesDifference} ${minutesDifference === 1 ? "minuto" : "minutos"
        } `;
    }

    const hoursDifference = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
      return `${hoursDifference} ${hoursDifference === 1 ? "hora" : "horas"} `;
    }

    const daysDifference = Math.floor(hoursDifference / 24);
    if (daysDifference < 30) {
      return `${daysDifference} ${daysDifference === 1 ? "día" : "días"} `;
    }

    const monthsDifference = Math.floor(daysDifference / 30);
    const remainingDays = daysDifference % 30;
    if (monthsDifference < 12) {
      return `${monthsDifference} ${monthsDifference === 1 ? "mes" : "meses"
        } y ${remainingDays} ${remainingDays === 1 ? "día" : "días"} `;
    }

    const options = { year: "numeric", month: "long", day: "numeric" };
    return tweetDate.toLocaleDateString(undefined, options);
  }

  const timeDifference = calculateTimeDifference(tweet?.TimeStamp);

  async function toggleShowDropdownRetweet() {
    setShowDropdownRetweet(!showDropdownRetweet);
  }

  const handleRePost = async () => {
    let token = window.localStorage.getItem("token");
    if (token) {
      let id;
      if (tweet.Type === "RePost") {
        id = tweet.OriginalPostData._id;
      } else {
        id = tweet._id;
      }
      const res = await RePost(id, token);
      setShowDropdownRetweet(false);
    }
  };

  const handleCiteTweet = () => {
    setPopupCiteTweet(true);
    setShowDropdownRetweet(false);
  };

  const handleLike = async () => {
    let token = window.localStorage.getItem("token");
    let idUser = window.localStorage.getItem("_id");
    let id;
    let repost = false;

    if (tweet.Type === "RePost") {
      id = tweet.OriginalPostData._id;
      repost = true;
    } else {
      id = tweet._id;
    }

    if (token) {
      setToken(token);

      if (!repost && tweet.isLikedByID) {
        setIsLiked(false);
        tweet.likeCount -= 1; // Corrección aquí
        await DislikePost({ idPost: id });
      } else if (repost && tweet.OriginalPostData.isLikedByID) {
        tweet.OriginalPostData.likeCount -= 1;
        setIsLiked(false);
        await DislikePost({ idPost: id });
      } else {
        if (!repost) {
          tweet.likeCount += 1;
        } else {
          tweet.OriginalPostData.likeCount += 1;
        }
        setIsLiked(true);
        await LikePost({ idPost: id });
      }
    } else {
      alert("logeate");
    }
  };

  useEffect(() => {
    let repost = tweet.Type === "RePost" ? true : false;
    if (!repost) {
      setIsLiked(tweet.isLikedByID);
    } else {
      setIsLiked(tweet.OriginalPostData?.isLikedByID);
    }
  }, [tweet]);

  const [copied, setCopied] = useState(false);
  const [share, setShare] = useState(false);
  const url = window.location.href;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setShare(open);
  };

  const handleShare = (platform, tweet) => {

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=www.pinkker.tv/post/${tweet?.UserInfo?.NameUser}/${tweet?._id}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=www.pinkker.tv/post/${tweet?.UserInfo?.NameUser}/${tweet?._id}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=www.pinkker.tv/post/${tweet?.UserInfo?.NameUser}/${tweet?._id}`;
        break;
      default:
        break;
    }
    window.open(shareUrl, '_blank');
  };



  const [openImg, setOpenImg] = useState(false);


  const handleClickOpenImg = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenImg(true);

  };
  const handleCloseImg = () => {
    setOpenImg(false);
  };

  return (
    <div
      style={{
        borderBottom: "1px solid #2a2e38",
        padding: "5px",
        height: isMobile && "fit-content",
      }}
    >
      {tweet.Type === "RePost" && (
        <div
          style={{ display: "flex", alignItems: "center", color: "aliceblue" }}
        >
          <i className="fas fa-retweet" />
          <h3 style={{ padding: " 0px 10px" }}>
            {" "}
            {tweet.UserInfo.NameUser} Reposteo{" "}
          </h3>
        </div>
      )}
      {tweet.Type === "PostComment" &&
        (location.pathname !== "/plataform/muro" ||
          tweet?.OriginalPostData?.Type === "Post" ||
          tweet?.OriginalPostData?.Type === "RePost") && (
          <PostComment tweet={tweet?.OriginalPostData} isMobile={isMobile} />
        )}
      <div className="tweetcard-body">
        <div
          onClick={() => togglePopupTweetView()}
          className="tweetcard-container"
        >
          <div className="tweetcard-avatar">
            <Link
              to={"/" + tweet.UserInfo.NameUser}
              className="hoverLink"
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                width: "60px",
                height: "60px",
                padding: '0 !important',
              }}
            >
              <img
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "100%",
                  position: "relative",
                  left: "-10px",
                }}
                src={tweet.UserInfo.Avatar}
                alt={`${tweet.UserInfo.NameUser} avatar`}
              />
            </Link>

            {isMobile && (
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
                      <Link
                        to={"/" + tweet.UserInfo.NameUser}
                        className="hoverLink"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}

                      >
                        <h3 style={{ fontSize: '18px' }}>{tweet.UserInfo.FullName}</h3>
                      </Link>

                      <p
                        style={{
                          color: "lightgray",
                          marginLeft: "5px",
                          fontSize: "15px",
                        }}
                      >
                        <Link
                          to={"/" + tweet.UserInfo.NameUser}
                          className="hoverLink"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          style={{ fontSize: '18px' }}
                        >
                          @{tweet.UserInfo.NameUser}
                        </Link>
                        · {timeDifference}
                      </p>
                    </Grid>
                    <FaEllipsis />
                  </Grid>
                </div>
                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "left",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  <p style={{ fontSize: isMobile && "22px" }}>{tweet.Status}</p>
                </div>
                {tweet.PostImage !== "" && (
                  <div style={{ marginTop: "10px" }} onClick={(e) => {
                    e.stopPropagation();
                    handleClickOpenImg()(e);
                  }}>
                    <img
                      style={{
                        borderRadius: "20px",
                        maxWidth: !isMobile && "350px",
                        width: isMobile && "100%",
                      }}
                      src={tweet.PostImage}
                      alt="Post image"
                      onAnimationEndnClick={(e) => {
                        e.stopPropagation();
                        handleClickOpenImg()(e);
                      }}
                    />
                    {isMobile && (
                      <Drawer
                        anchor="bottom"
                        open={openImg}
                        onClose={handleClickOpenImg(false)}
                        
                        transitionDuration={{ enter: 500, exit: 500 }}
                        PaperProps={{
                          style: { height: "99%", backgroundColor: "rgba(53, 49, 51, 0.33)" },
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
                          style={{ margin: '0 auto', height: '100%' }}
                          role="presentation"
                        >
                          <div style={{ display: 'flex', flexDirection:'column',alignItems: 'center', gap: '10px', justifyContent: 'center', height: '100%' }}>
                            <IoMdCloseCircleOutline onClick={handleClickOpenImg(false)} style={{float:'right', color:'white', fontSize:'32px', width:'100%'}} />
                            <img
                              style={{ width: '100%', height: '60%', objectFit: 'cover' }}
                              src={tweet.PostImage}
                              alt="Expanded post image"
                            />

                            <div className="tweetcard-icons" style={{backgroundColor:'#0000'}}>
                              <Tippy
                                placement="bottom"
                                theme="pinkker"
                                content={<h1>Responder</h1>}
                              >
                                <div className="tweetcard-icon-comment">
                                  <FaRegComment style={{ fontSize: '22px' }} />
                                  <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                                    {tweet.Type == "RePost" ? (
                                      <p>{tweet?.OriginalPostData?.Comments?.length}</p>
                                    ) : (
                                      <p>{tweet?.Comments?.length}</p>
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
                                    <FaRetweet style={{ fontSize: '22px' }} />
                                    {tweet.Type === "RePost" ? (
                                      <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                                        {tweet.OriginalPostData?.RePosts?.length}
                                      </p>
                                    ) : (
                                      <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                                        {tweet?.RePosts?.length}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </Tippy>
                              {showDropdownRetweet && (
                                <div
                                  className="DropdownReTweet-main"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <DropdownReTweet
                                    reTweet={handleRePost}
                                    citeTweet={handleCiteTweet}
                                    closePopup={() => setShowDropdownRetweet(false)}
                                  />
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
                                    <FaHeart style={{ fontSize: '22px' }} />
                                  ) : (
                                    <CiHeart style={{ fontSize: '22px' }} />
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
                              >
                                <div className="tweetcard-icon-like" >
                                  <FaChartSimple style={{ fontSize: '22px' }} />
                                  {tweet.Type === "RePost" ? (
                                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                                      {tweet.OriginalPostData?.Views}
                                    </p>
                                  ) : (
                                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                                      {" "}
                                      {tweet?.Views}
                                    </p>
                                  )}
                                </div>
                              </Tippy>

                              <Tippy
                                placement="bottom"
                                theme="pinkker"

                              >
                                <div className="tweetcard-icon-like" onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDrawer(true)(e)
                                }} >
                                  <TbLocationShare style={{ fontSize: '22px' }} onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDrawer(true)(e)
                                  }} />
                                </div>

                              </Tippy>
                            </div>

                          </div>

                        </Box>
                      </Drawer>
                    )}
                  </div>
                )}
                {tweet.gallery === true && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      style={{
                        borderRadius: "20px",
                        maxWidth: !isMobile && "350px",
                        width: isMobile && "100%",
                      }}
                      src={tweet.PostImage}
                      alt="Gallery image"
                    />
                  </div>
                )}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {tweet.Type === "CitaPost" && (
                    <CitaCard tweet={tweet?.OriginalPostData} isMobile={isMobile} />
                  )}
                </div>
              </div>
            )}
          </div>

          {!isMobile && (
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
                    <Link
                      to={"/" + tweet.UserInfo.NameUser}
                      className="hoverLink"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <h3>{tweet.UserInfo.FullName}</h3>
                    </Link>

                    <p
                      style={{
                        color: "lightgray",
                        marginLeft: "5px",
                        fontSize: "15px",
                      }}
                    >
                      <Link
                        to={"/" + tweet.UserInfo.NameUser}
                        className="hoverLink"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        @{tweet.UserInfo.NameUser}
                      </Link>
                      · {timeDifference}
                    </p>
                  </Grid>
                  <FaEllipsis />
                </Grid>
              </div>
              <div
                style={{
                  marginTop: "5px",
                  textAlign: "left",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                <p style={{ fontSize: isMobile && "20px" }}>{tweet.Status}</p>
              </div>
              {tweet.PostImage !== "" && (
                <div style={{ marginTop: "10px" }} onClick={(e) => {
                  e.stopPropagation();
                  handleClickOpenImg()(e);
                }}>
                  <img
                    style={{ borderRadius: "20px", maxWidth: "350px" }}
                    src={tweet.PostImage}

                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpenImg()(e);
                    }}
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
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {tweet.Type === "CitaPost" && (
                  <CitaCard tweet={tweet?.OriginalPostData} isMobile={isMobile} />
                )}
              </div>
              {!isMobile && (
                <div className="tweetcard-icons">
                  <Tippy
                    placement="bottom"
                    theme="pinkker"
                    content={<h1>Responder</h1>}
                  >
                    <div className="tweetcard-icon-comment">
                      <FaRegComment style={{ fontSize: '22px' }} />
                      <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                        {tweet.Type == "RePost" ? (
                          <p>{tweet?.OriginalPostData?.Comments?.length}</p>
                        ) : (
                          <p>{tweet?.Comments?.length}</p>
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
                        <FaRetweet style={{ fontSize: '22px' }} />

                        {tweet.Type === "RePost" ? (
                          <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                            {tweet.OriginalPostData?.RePosts?.length}
                          </p>
                        ) : (
                          <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                            {tweet?.RePosts?.length}
                          </p>
                        )}
                      </div>
                    )}
                  </Tippy>
                  {showDropdownRetweet && (
                    <div
                      className="DropdownReTweet-main"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <DropdownReTweet
                        reTweet={handleRePost}
                        citeTweet={handleCiteTweet}
                        closePopup={() => setShowDropdownRetweet(false)}
                      />
                    </div>
                  )}

                  <Tippy
                    placement="bottom"
                    theme="pinkker"
                    content={
                      <h1>{isLiked ? "Cancelar Me gusta" : "Me gusta"}</h1>
                    }
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
                        <FaHeart style={{ fontSize: '22px' }} />
                      ) : (
                        <CiHeart style={{ fontSize: '22px' }} />
                      )}
                      {tweet.Type === "RePost" ? (
                        <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                          {tweet.OriginalPostData?.likeCount}
                        </p>
                      ) : (
                        <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                          {" "}
                          {tweet?.likeCount}
                        </p>
                      )}
                    </div>
                  </Tippy>

                  <Tippy
                    placement="bottom"
                    theme="pinkker"
                    content={
                      <h1>{isLiked ? "Cancelar Me gusta" : "Me gusta"}</h1>
                    }
                  >
                    <div className="tweetcard-icon-like">
                      <FaChartSimple style={{ fontSize: '22px' }} />

                      {tweet.Type === "RePost" ? (
                        <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                          {tweet.OriginalPostData?.Views}
                        </p>
                      ) : (
                        <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                          {" "}
                          {tweet?.Views}
                        </p>
                      )}
                    </div>
                  </Tippy>
                  <Tippy
                    placement="bottom"
                    theme="pinkker"

                  >
                    <div className="tweetcard-icon-like" onClick={(e) => {
                      e.stopPropagation();
                      toggleDrawer(true)(e)
                    }} >
                      <TbLocationShare style={{ fontSize: '22px' }} onClick={(e) => {
                        e.stopPropagation();
                        toggleDrawer(true)(e)
                      }} />
                    </div>

                  </Tippy>
                </div>
              )}
            </div>
          )}
          {isMobile && (
            <div className="tweetcard-icons">
              <Tippy
                placement="bottom"
                theme="pinkker"
                content={<h1>Responder</h1>}
              >
                <div className="tweetcard-icon-comment">
                  <FaRegComment style={{ fontSize: '22px' }} />
                  <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                    {tweet.Type == "RePost" ? (
                      <p>{tweet?.OriginalPostData?.Comments?.length}</p>
                    ) : (
                      <p>{tweet?.Comments?.length}</p>
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
                    <FaRetweet style={{ fontSize: '22px' }} />
                    {tweet.Type === "RePost" ? (
                      <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                        {tweet.OriginalPostData?.RePosts?.length}
                      </p>
                    ) : (
                      <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                        {tweet?.RePosts?.length}
                      </p>
                    )}
                  </div>
                )}
              </Tippy>
              {showDropdownRetweet && (
                <div
                  className="DropdownReTweet-main"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DropdownReTweet
                    reTweet={handleRePost}
                    citeTweet={handleCiteTweet}
                    closePopup={() => setShowDropdownRetweet(false)}
                  />
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
                    <FaHeart style={{ fontSize: '22px' }} />
                  ) : (
                    <CiHeart style={{ fontSize: '22px' }} />
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
              >
                <div className="tweetcard-icon-like" >
                  <FaChartSimple style={{ fontSize: '22px' }} />
                  {tweet.Type === "RePost" ? (
                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {tweet.OriginalPostData?.Views}
                    </p>
                  ) : (
                    <p style={{ marginLeft: "5px", fontSize: "14px" }}>
                      {" "}
                      {tweet?.Views}
                    </p>
                  )}
                </div>
              </Tippy>

              <Tippy
                placement="bottom"
                theme="pinkker"

              >
                <div className="tweetcard-icon-like" onClick={(e) => {
                  e.stopPropagation();
                  toggleDrawer(true)(e)
                }} >
                  <TbLocationShare style={{ fontSize: '22px' }} onClick={(e) => {
                    e.stopPropagation();
                    toggleDrawer(true)(e)
                  }} />
                </div>

              </Tippy>
            </div>
          )}
        </div>

        {popupCiteTweet && (
          <CiteTweet
            closePopup={() => setPopupCiteTweet(false)}
            tweet={tweet}
            isMobile={isMobile}
            isLiked={isLiked}
            isRetweet={isRetweet}
          />
        )}

        {(
          <Drawer
            anchor="bottom"
            open={share}
            onClose={toggleDrawer(false)}
            transitionDuration={{ enter: 500, exit: 500 }}
            PaperProps={{
              style: { height: "8%", backgroundColor: "#080808" },
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
              style={{ margin: '0 auto' }}
              role="presentation"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CopyToClipboard text={`www.pinkker.tv/post/${tweet?.UserInfo?.NameUser}/${tweet?._id}`} onCopy={() => setCopied(true)}>
                  <button style={{ padding: '10px', cursor: 'pointer' }} startIcon={<FaRegCopy />}>
                    {copied ? 'Copiado!' : 'Copiar enlace'}
                  </button>
                </CopyToClipboard>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShare('facebook', tweet)}
                  startIcon={<FaFacebook />}
                >
                  Facebook
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShare('twitter', tweet)}
                  startIcon={<FaTwitter />}
                >
                  Twitter
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShare('linkedin', tweet)}
                  startIcon={<FaLinkedin />}
                >
                  LinkedIn
                </Button>
              </div>

            </Box>
          </Drawer>
        )}
      </div>
    </div>
  );
}
