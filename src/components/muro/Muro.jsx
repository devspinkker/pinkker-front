import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Muro.css";
import TweetCard from "./tweet/TweetCard";
import {
  PostCreate,
  setToken,
  PostGets,
  GetTweetsRecommended,
  GetPostCommunitiesFromUser,
  GetRandomPostcommunities,
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
import Communities from "./communities/Communities";
import PostCreator from "./PostCreator";
import { FindUserCommunities } from "../../services/backGo/communities";
import ListCommunities from "./communities/ListCommunities";
export default function Muro({ isMobile, userName }) {
  const alert = useNotification();
  const [selectedCommunityID, setSelectedCommunityID] = useState("");

  const UserId = window.localStorage.getItem("_id");
  const [UserCommunities, setUserCommunities] = useState([]);
  async function GetCommunityUser() {
    const res = await FindUserCommunities({ UserId });
    if(res){
      setUserCommunities(res.data); // Guardamos las comunidades en el estado

    }
  }

  useEffect(() => {
    GetCommunityUser(); // Ejecutamos la función para obtener las comunidades
  }, []);

  const [Posts, setPosts] = useState(null);
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
  let location = useLocation();
  const handleCommunityChange = (e) => {
    console.log(e.target.value);

    setSelectedCommunityID(e.target.value); // Actualizamos el estado local
  };
  async function loadMoreTweets() {
    try {
      setIsFetching(true); // marca que se está ejecutando la carga de más Posts
      let token = window.localStorage.getItem("token");
      let data;

      if (token) {
        const ExcludeIDs = Posts.map((tweet) => tweet._id);


        data = await GetPostCommunitiesFromUser(token, ExcludeIDs);
      } else {
        // data = await PostGets();
      }

      if (data.data == null) {
        return;
      } else {
        if (data.data.message === "ok" || data.data.data) {
          let currentTweets = [...(Posts || [])];
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
            setPosts(allTweets);
            setOrderCount((prevCount) => prevCount + 1);
          } else {
            let updatedTweets = [...currentTweets, ...uniqueNewTweets];
            setPosts(updatedTweets);
          }
        }
      }
    } catch (error) {
      // setPosts(null);
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

    setOrderCount(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    function handleScroll() {
      if (valorTab !== "parati") return;
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
  }, [Posts, isFetching]);

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
    let token = window.localStorage.getItem("token");
    if (token) {
      const ExcludeIDs = [];
      if (valorTab !== "parati") return;
      const data = await GetPostCommunitiesFromUser(token, ExcludeIDs);

      if (data.data == null) {
        const resRandomPost = await GetRandomPostcommunities(token, ExcludeIDs);
        if (resRandomPost?.data) {
          setPosts(resRandomPost.data);
        } else {
          setPosts(null);
        }
      } else {
        if (data.data.message === "ok") {
          setPosts(data.data.data);
        }
      }
    } else {
      const data = await PostGets();
      if (data.data == null) {
        setPosts(null);
      } else {
        setPosts(data.data);
      }
    }
  }

  useEffect(() => {
    let token = window.localStorage.getItem("token");
    if (!token) {
      setValorTab("grupos")
      
    }
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
      formData.append("communityID", selectedCommunityID);
      try {
        let loggedUser = window.localStorage.getItem("token");
        if (loggedUser) {
          setToken(loggedUser);
          setMessage("");
          setImage(null);
          const res = await PostCreate(formData, loggedUser);
          if (res?.message === "StatusCreated") {
            setPosts([res.post, ...Posts]);
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
            setPosts([res.post, ...Posts]);
          }
        }
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error(error);
      }
    }
  }
  const [valorTab, setValorTab] = useState("parati");
  function renderMuro() {
    if (true) {
      return (
        <div className="muro-container">
          <div
            style={{
              width: isMobile ? "100%" : "75%",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Tabs value={valorTab} aria-label="basic tabs example">
                {
                  token && (
                    <Tab
                      label="Mis comunidades"
                      style={{
                        width: "50%",
                        color: "white",
                        padding: "0 !important",
                        borderBottom: valorTab === "parati" && "1px solid #f06fc0",
                        fontSize: isMobile ? "22px" : "18px",
                      }}
                      onClick={() => setValorTab("parati")}
                    />

                    )
                }
                <Tab
                  label="Descubrir"
                  style={{
                    width: "50%",
                    color: "white",
                    padding: "0 !important",
                    borderBottom: valorTab === "grupos" && "1px solid #f06fc0",
                    fontSize: isMobile ? "22px" : "18px",
                  }}
                  onClick={() => setValorTab("grupos")}
                />
              </Tabs>
            </Box>
            {userName?.NameUser ? (
              <></>
            ) : (
              <></>
            )}

            {isMobile &&
              token?.length &&
              !location.pathname.includes("/post") && (
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

            {valorTab === "parati" ? (
              <>
                {/* <PostCreator
                  userCommunities={UserCommunities}
                  AvatarSearch={AvatarSearch}
                  message={message}
                  setMessage={setMessage}
                  file={file}
                  setFile={setFile}
                  image={image}
                  setImage={setImage}
                  clearImages={clearImages}
                  dropdownEmotes={dropdownEmotes}
                  setDropdownEmotes={setDropdownEmotes}
                  handleSubmit={handleSubmit}
                  handleChange2={handleChange2}
                  onMouseEnterEmotes={() => setDropdownEmotes(!dropdownEmotes)}
                  onDrag={onDrag}
                  setOnDrag={setOnDrag}
                  handleCommunityChange={handleCommunityChange}
                /> */}
                <div>
                  <ListCommunities communities={UserCommunities} />
                </div>
                <div className="muro-tweet-container">
                  {Posts &&
                    Posts.length > 0 &&
                    Posts.map((P) => (
                      <div>
                        {/* <div className="communitiesRedirect-post">
                          <Link
                            to={
                              "/plataform/communities/" + P.CommunityInfo?._id
                            }
                          >
                            <i className="fas fa-user"></i>
                            <span className="muro-post-container-CommunityName">
                              {P.CommunityInfo?.CommunityName}
                            </span>
                          </Link>
                        </div> */}
                        <TweetCard tweet={P} isMobile={isMobile} />
                      </div>
                    ))}

                  {!Posts && (
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
            ) : (
              <Communities isMobile={isMobile} />
            )}
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
