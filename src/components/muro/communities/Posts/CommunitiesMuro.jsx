import React, { useEffect, useState } from "react";
import { Typography, Avatar, TextField, Grid } from "@mui/material";
import "./CommunitiesMuro.css";
import TweetCard from "../../tweet/TweetCard";
import { FileUploader } from "react-drag-drop-files";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { ScaleLoader } from "react-spinners";
import { PostCreate } from "../../../../services/backGo/tweet";
import { useParams } from "react-router-dom";
import {
  AddModerator,
  BanMember,
  DeletePost,
  GetCommunity,
  GetCommunityPosts,
  GetCommunityWithUserMembership,
} from "../../../../services/backGo/communities";
import CommunityInfo from "../CommunityInfo";

export default function CommunitiesMuro({ isMobile, userName }) {
  const { id } = useParams();
  const token = window.localStorage.getItem("token");
  let avatar = window.localStorage.getItem("avatar");
  let idUser = window.localStorage.getItem("_id");

  const [file, setFile] = useState(null);
  const [onDrag, setOnDrag] = useState(false);
  const [AvatarSearch, SetAvatarSearch] = useState(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [dropdownEmotes, setDropdownEmotes] = useState(false);
  const [Posts, setPosts] = useState(null);
  const [communityInfo, setCommunityInfo] = useState(null);

  const clearImages = () => {
    setImage(null);
    setFile(null);
  };

  const HandleBanMember = async (user_id) => {
    await BanMember({ community: id, user_id, token });
  };

  const HandleDeletePost = async (PostId) => {
    await DeletePost({ CommunityID: id, PostId, token });
  };
  const HandleAddModerator = async (user_id) => {
    await AddModerator({ community_id: id, new_mod_id: user_id, token });
  };
  useEffect(() => {
    if (avatar) {
      SetAvatarSearch(avatar);
    }
  }, []);
  const GetPostsCommunity = async () => {
    if (token) {
      const resGetCommunity = await GetCommunityWithUserMembership({
        community: id,
        token,
      });
      if (resGetCommunity.data) {
        console.log(resGetCommunity.data);
        setCommunityInfo(resGetCommunity.data);
      }
    } else {
      const resGetCommunity = await GetCommunity({ community: id, token });
      if (resGetCommunity.data) {
        setCommunityInfo(resGetCommunity.data);
      }
    }

    const res = await GetCommunityPosts({ community_ids: id, token });

    if (res.posts) {
      setPosts(res.posts);
    }
  };

  useEffect(() => {
    GetPostsCommunity();
  }, []);

  async function handleSubmit() {
    if (message != "") {
      const formData = new FormData();
      formData.append("Status", message);
      formData.append("imgPost", file);
      formData.append("communityID", id);

      try {
        if (token) {
          setMessage("");
          setImage(null);
          const res = await PostCreate(formData, token);
          if (res?.message === "StatusCreated") {
            setPosts([res.post, ...Posts]);
            // alert({ type: "SUCCESS" });
          }
        }
      } catch (error) {}
    }
  }
  const onMouseEnterEmotes = () => {
    if (dropdownEmotes === true) {
      setDropdownEmotes(false);
    } else {
      setDropdownEmotes(true);
    }
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
  const fileTypes = ["JPG", "PNG", "GIF"];
  const handleChange = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setImage(reader.result);
    });
    reader?.readAsDataURL(file);
  };
  return (
    <div className="PostComunidad-conteiner">
      {communityInfo && <CommunityInfo community={communityInfo} />}
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
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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
        {Posts &&
          Posts.map((P) => (
            <div>
              {(communityInfo?.isUserModerator ||
                communityInfo.creator.userID == idUser) && (
                <div className="mod-comunidad-actions-container">
                  <span
                    onClick={() => HandleBanMember(P.UserID)}
                    className="mod-comunidad-actions"
                  >
                    Banear
                  </span>
                  <span
                    onClick={() => HandleDeletePost(P._id)}
                    className="mod-comunidad-actions"
                  >
                    EliminarPost
                  </span>
                  <span
                    onClick={() => HandleAddModerator(P.UserID)}
                    className="mod-comunidad-actions"
                  >
                    mod
                  </span>
                </div>
              )}
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
    </div>
  );
}
