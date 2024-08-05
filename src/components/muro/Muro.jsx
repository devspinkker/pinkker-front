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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Tendency from "./TendencyLayout";
import comunidadImg from './imagencomunidad.jpg'
export default function Muro({ isMobile, userName }) {
  const alert = useNotification();
  const [tweets, setTweets] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fileTypes = ["JPG", "PNG", "GIF"];

  const [onDrag, setOnDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const [dropdownEmotes, setDropdownEmotes] = useState(false);
  const [userFollows, setUserFollows] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [AvatarSearch, SetAvatarSearch] = useState(null);

  const [orderCount, setOrderCount] = useState(0);
  const [referenceTweet, setReferenceTweet] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // nuevo estado para manejar la espera
  let token = window.localStorage.getItem("token");

  async function loadMoreTweets() {
    try {
      setIsFetching(true); // marca que se está ejecutando la carga de más tweets
      let token = window.localStorage.getItem("token");
      let data;

      if (token) {
        const ExcludeIDs = tweets.map((tweet) => tweet._id);
        data = await GetTweetsRecommended(token, ExcludeIDs);
      } else {
        // data = await PostGets();
      }

      if (data.data == null) {
        return;
      } else {
        if (data.data.message === "ok" || data.data.data) {
          let currentTweets = [...(tweets || [])];
          let newTweets = data.data.data;

          let uniqueNewTweets = newTweets.filter(
            (tweet, index, self) =>
              index === self.findIndex((t) => t._id === tweet._id)
          );

          if (!referenceTweet && currentTweets.length > 0) {
            setReferenceTweet(currentTweets[0]);
          }

          if (
            referenceTweet &&
            new Date(uniqueNewTweets[0]?.TimeStamp) >
            new Date(referenceTweet.TimeStamp)
          ) {
            let allTweets = [...currentTweets, ...uniqueNewTweets];
            allTweets.sort(
              (a, b) => new Date(b.TimeStamp) - new Date(a.TimeStamp)
            );
            setTweets(allTweets);
            setOrderCount((prevCount) => prevCount + 1);
          } else {
            let updatedTweets = [...currentTweets, ...uniqueNewTweets];
            setTweets(updatedTweets);
          }
        }
      }
    } catch (error) {
      // setTweets(null);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    if (orderCount >= 1) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, [orderCount]);

  const scrollToTop = () => {
    console.log("WTF");
    setOrderCount(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    function handleScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreTweets();

        setIsFetching(true);
        setTimeout(() => {
          setIsFetching(false);
        }, 6000);
      }
    }

    if (!isFetching) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tweets, isFetching]);

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
      } catch (error) { }
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
    reader?.readAsDataURL(file);
  };

  const handleChange2 = (e) => {
    var fileT = e.target.files[0];
    setFile(fileT);
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setImage(reader.result);
    });
    reader?.readAsDataURL(fileT);
  };
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };
  async function handlePost() {
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
          }
        }
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error(error);
      }
    }
  }
  const [valorTab, setValorTab] = useState('parati')
  console.log('valorTab', valorTab)
  function renderMuro() {
    if (true) {
      return (
        <div className="muro-container">
          <div
            style={{
              width: isMobile ? "100%" : "60%",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Tabs value={valorTab} aria-label="basic tabs example">
                <Tab label="Para Ti" style={{ width:'50%',color: 'white', padding: '0 !important', borderBottom: valorTab === 'parati' && '1px solid #f06fc0', fontSize:isMobile ? '22px' : '18px' }} onClick={() => setValorTab('parati')} />
                <Tab label="Grupos" style={{  width:'50%',color: 'white', padding: '0 !important', borderBottom: valorTab === 'grupos' && '1px solid #f06fc0', fontSize: isMobile ? '22px' : '18px' }} onClick={() => setValorTab('grupos')} />
              </Tabs>

            </Box>
            {userName?.NameUser ? (
              <></>

            ) : (
              <Grid style={{ color: "white", width: "67%", margin: "0 auto" }}>
                <h3 style={{ color: "white" }}>Muro de Pinkker</h3>
              </Grid>
            )}

            {isMobile && token?.length && (
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
                onClick={toggleDrawer(true)}
              >
                <AddCircleOutlineIcon style={{ fontSize: "4.5rem" }} />
              </IconButton>
            )}
            {isMobile && token?.length && (
              <Drawer
                anchor="bottom"
                open={open}
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
                      onClick={() => setOpen(false)}
                    />
                    <button
                      onClick={() => handlePost()}
                      className="muro-send-tweet-button"
                    >
                      Postear
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
                        src={AvatarSearch ? AvatarSearch : "/images/search.svg"}
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
                        label="¿Qué está pasando?"
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                          color: message?.length > 100 ? "red" : "white",
                          textAlign: "right",
                        }}
                      >
                        {message.length}/100
                      </Typography>
                    </div>
                  </div>
                </Box>
              </Drawer>
            )}

            {
              valorTab === 'parati' && (
                <>

                  {userName?.NameUser && !isMobile && (
                    <div
                      onDragEnterCapture={() => setOnDrag(true)}
                      className="muro-send-tweet"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          padding: "10px 0px ",
                          width: "90%",
                          margin: "0 auto",
                          gap: "15px",
                        }}
                      >
                        <div className="tweetcard-avatar">
                          <img
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "100%",
                            }}
                            src={AvatarSearch ? AvatarSearch : "/images/search.svg"}
                          />
                        </div>

                        {/* <img
                      src={"/images/search.svg"}
                      style={{
                        fontSize: "16px",
                        color: "rgb(89 89 89)",
                        margin: "8px",
                      }}
                    /> */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <TextField
                            label="¿Qué está pasando?"
                            variant="outlined"
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            multiline
                            rows={1}
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
                              color: message?.length > 100 ? "red" : "white",
                              textAlign: "right",
                            }}
                          >
                            {message.length}/100
                          </Typography>
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
                    {tweets != null &&
                      tweets.map((tweet) => (
                        <TweetCard tweet={tweet} isMobile={isMobile} />
                      ))}
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
                  </div>
                </>
              )
            }

            {
              valorTab === 'grupos' && (
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: !isMobile && 'wrap', padding: 10, alignItems: 'center', width: '100%', gap: '15px' }}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Grid
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '5px',
                        width: isMobile ? '100%' : '20%',
                        margin: isMobile ? '10px 0' : '10px'
                      }}
                    >
                      <img src={comunidadImg} style={{ width: '100%' }} alt={`Comunidad ${index + 1}`} />
                      <Typography style={{ color: 'white', fontSize: isMobile ? '2rem' : '1rem' }}>
                        Comunidad de Pinkker
                      </Typography>
                    </Grid>
                  ))}
                </div>
              )
            }
          </div>

          {!isMobile && <Tendency />}
        </div>
      );
    } else {
      return <Auth typeDefault={0} />;
    }
  }

  return (
    <div
      className="muro-body"
      style={{
        padding: isMobile && "1rem 0px",
        width: isMobile && "97.5%",

      }}
    >
      {showScrollButton && (
        <button onClick={scrollToTop} className="alprincipio">
          Nuevas Publicaciones
        </button>
      )}
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
