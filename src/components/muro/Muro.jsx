import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Muro.css";

import TweetCard from "./tweet/TweetCard";

import {
  PostCreate,
  setToken,
  PostGets,
  GetTweetsRecommended,
} from "../../services/backGo/tweet";

import { useNotification } from "../Notifications/NotificationProvider";

import { useSelector } from "react-redux";
import { ScaleLoader, BarLoader } from "react-spinners";

import { FileUploader } from "react-drag-drop-files";

import axios from "axios";

import DropdownEmotes from "../channel/chat/dropdown/emotes/DropdownEmotes";

import Auth from "../auth/Auth";
import { render } from "react-dom";

import { follow, unfollow } from "../../services/follow";
import FollowCard from "./FollowCard";

import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Tendency from "./TendencyLayout";

export default function Muro({ isMobile, userName }) {
  const alert = useNotification();
  const [tweets, setTweets] = useState(null);
  const [message, setMessage] = useState("");

  const fileTypes = ["JPG", "PNG", "GIF"];

  const [onDrag, setOnDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const [dropdownEmotes, setDropdownEmotes] = useState(false);
  const [userFollows, setUserFollows] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [AvatarSearch, SetAvatarSearch] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let avatar = window.localStorage.getItem("avatar");
    if (avatar) {
      SetAvatarSearch(avatar);
    }
  }, []);
  async function PostGetsf() {
    try {
      let token = window.localStorage.getItem("token");
      if (token) {
        const ExcludeIDs = [];
        const data = await GetTweetsRecommended(token, ExcludeIDs);
        if (data.data == null) {
          setTweets(null);
        } else {
          if (data.data.message === "ok") {
            setTweets(data.data.data);
          }
        }
      } else {
        const data = await PostGets();
        if (data.data == null) {
          setTweets(null);
        } else {
          setTweets(data.data);
        }
      }
    } catch (error) {
      setTweets(null);
    }
  }
  useEffect(() => {
    PostGetsf();
  }, []);

  const onMouseEnterEmotes = () => {
    if (dropdownEmotes === true) {
      setDropdownEmotes(false);
    } else {
      setDropdownEmotes(true);
    }
  };

  async function handleSubmit() {
    if (message != "") {
      const formData = new FormData();
      formData.append("Status", message);
      formData.append("imgPost", file);
      try {
        let loggedUser = window.localStorage.getItem("token");
        if (loggedUser) {
          setToken(loggedUser);
          setMessage("");
          setImage(null);
          const res = await PostCreate(formData);
          if (res?.message === "StatusCreated") {
            setTweets([res.post, ...tweets]);
            alert({ type: "SUCCESS" });
          }
        }
      } catch (error) {}
    }
  }
  const clearImages = () => {
    setImage(null);
    setFile(null);
  };
  const handleChange = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setImage(reader.result);
    });
    reader.readAsDataURL(file);
  };

  const handleChange2 = (e) => {
    var fileT = e.target.files[0];
    setFile(fileT);
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setImage(reader.result);
    });
    reader.readAsDataURL(fileT);
  };

  function renderMuro() {
    if (true) {
      return (
        <div className="muro-container">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {userName?.NameUser ? (
              <></>
            ) : (
              <Grid style={{ color: "white", width: "67%", margin: "0 auto" }}>
                <h3 style={{ color: "white" }}>Muro de Pinkker</h3>
              </Grid>
            )}

            {userName?.NameUser && (
              <div
                onDragEnterCapture={() => setOnDrag(true)}
                /*onDragLeave={() => setOnDrag(false)}*/ className="muro-send-tweet"
              >
                {/*<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                              <div onClick={() => handleNewTweets()} className="muro-new-messages">
                                  <h3 style={{fontSize: "15px"}}>Nuevos posteos</h3>
                                  <i style={{marginLeft: "5px", fontSize: "12px"}} class="fas fa-sync-alt"/>
                              </div>
              </div>*/}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 0px ",
                    width: "90%",
                    margin: "0 auto",
                  }}
                >
                  <div className="tweetcard-avatar">
                    <img
                      style={{
                        width: "50px",
                        borderRadius: "100%",
                        // padding: "10px",
                      }}
                      src={AvatarSearch ? AvatarSearch : "/images/search.svg"}
                    />
                  </div>

                  {/* <div className="muro-send-tweet-input">

                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Búsqueda"
                    />
                     <textarea
                      id="muro-textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Qué estás pensando?"
                      type="text"
                    /> 
                  </div> */}
                  <div
                    style={{
                      backgroundColor: "black",
                      display: "flex",
                      alignItems: "center",
                      height: "40px",
                      margin: "0px 10px",
                      borderRadius: "5px",
                      width: "90%",
                    }}
                  >
                    <img
                      src={"/images/search.svg"}
                      style={{
                        fontSize: "16px",
                        color: "rgb(89 89 89)",
                        margin: "8px",
                      }}
                    />
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Que esta pasando?"
                    />
                  </div>
                </div>

                {file != null && (
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      onClick={() => clearImages()}
                      style={{
                        color: "white",
                        cursor: "pointer",
                        height: "20px",
                        width: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50px",
                        position: "relative",
                        left: "35px",
                        top: "10px",
                        padding: "5px",
                        backgroundColor: "#303030",
                      }}
                      class="fas fa-times"
                    />
                    <img style={{ maxWidth: "320px" }} src={image} />
                  </div>
                )}

                {onDrag && file === null && (
                  <FileUploader
                    hoverTitle="Soltar aca"
                    label="Subir archivo a tu publicación"
                    multiple={false}
                    classes="muro-drag-input"
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "90%",
                    margin: "0 auto",
                    padding: "15px 0px",
                    borderTop: "1px solid #2a2e38",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "80%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid
                      style={{
                        display: "flex",
                        width: "80%",
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        className="mure-send-tweet-icons-card"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "5px",
                          padding: "0px",
                        }}
                      >
                        <i
                          style={{
                            padding: "5px",
                            color: "#ff4aa7d2",
                          }}
                          class="fas fa-photo-video"
                        />
                        <input
                          onChange={(e) => handleChange2(e)}
                          style={{
                            backgroundColor: "red",
                            width: "30px",
                            position: "absolute",

                            opacity: "0",
                          }}
                          type="file"
                        />
                      </div>

                      <div
                        onClick={() => onMouseEnterEmotes()}
                        className="mure-send-tweet-icons-card"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          style={{
                            padding: "5px",
                            color: "#ff4aa7d2",
                            marginRight: "5px",
                          }}
                          class="far fa-smile"
                        />
                        {dropdownEmotes && (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: "1001",
                              marginTop: "60px",
                            }}
                          >
                            <EmojiPicker
                              onEmojiClick={(e) => console.log("clickEmoji(e)")}
                              autoFocusSearch={false}
                              theme={Theme.DARK}
                              searchDisabled
                              height={"300px"}
                              width="300px"
                              lazyLoadEmojis={true}
                              previewConfig={{
                                showPreview: false,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </Grid>
                    {/*dropdownEmotes && <DropdownEmotes muro={true} clickEmoticon />*/}

                    <Grid
                      style={{
                        backgroundColor: "#2a2e38",
                        borderRadius: "5px",
                        width: "25%",
                      }}
                    >
                      <select
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#2a2e38",
                          borderRadius: "5px",
                          color: "white",
                        }}
                        name="cars"
                        id="cars"
                      >
                        <option value="Publico"> Público</option>
                        <option value="Privado"> Privado</option>
                      </select>
                    </Grid>
                  </div>
                  <button
                    onClick={() => handleSubmit()}
                    className="muro-send-tweet-button"
                  >
                    Postear
                  </button>
                </div>
              </div>
            )}
            <div className="muro-tweet-container">
              {/*<div style={{height: "60px", cursor: "pointer", width: "100%", borderTop: "1px solid #ffffff1a", borderBottom: "1px solid #ffffff1a", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                  <p style={{color: "#ff60b2"}}>10 nuevos posteos</p>
                              </div>*/}

              {tweets != null &&
                tweets.map((tweet) => <TweetCard tweet={tweet} />)}
              {!tweets && (
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
              {/* {hasMore === false && loading === false && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <i
                    style={{ color: "white", fontSize: "44px" }}
                    class="fas fa-check-circle"
                  />
                  <h3 style={{ color: "white", marginTop: "10px" }}>
                    ¡Parece que estas al día!
                  </h3>
                </div>
              )} */}
            </div>
          </div>

          {!isMobile && <Tendency />}
        </div>
      );
    } else {
      return <Auth typeDefault={0} />;
    }
  }

  return (
    <div className="muro-body">
      {isLoading === false && renderMuro()}
      {isLoading && (
        <div
          style={{
            height: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarLoader color="#36d7b7" />
        </div>
      )}
      {/*<div style={{height: "800px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img style={{width: "200px"}} src="https://res.cloudinary.com/pinkker/image/upload/v1679518300/pinkker-trabajando_ky0e2t.png"/>
                    <h1 style={{color: "white"}}>Estamos trabajando en esto... estará pronto!</h1>
                </div>
    </div>*/}
    </div>
  );
}
