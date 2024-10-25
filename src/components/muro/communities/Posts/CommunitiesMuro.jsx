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
  FindUserCommunities,
  GetCommunity,
  GetCommunityPosts,
  GetCommunityWithUserMembership,
} from "../../../../services/backGo/communities";
import CommunityInfo from "../CommunityInfo";
import PostCreator from "../../PostCreator";

export default function CommunitiesMuro({ isMobile, userName }) {
  const { id } = useParams();
  const token = window.localStorage.getItem("token");
  let avatar = window.localStorage.getItem("avatar");
  let idUser = window.localStorage.getItem("_id");
  const [UserCommunities, setUserCommunities] = useState([]);
  async function GetCommunityUser() {
    // const res = await FindUserCommunities({ UserId: idUser });
    // setUserCommunities(res.data); // Guardamos las comunidades en el estado
  }

  useEffect(() => {
    GetCommunityUser(); // Ejecutamos la función para obtener las comunidades
  }, []);
  const [file, setFile] = useState(null);
  const [onDrag, setOnDrag] = useState(false);
  const [AvatarSearch, SetAvatarSearch] = useState(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [dropdownEmotes, setDropdownEmotes] = useState(false);
  const [Posts, setPosts] = useState(null);
  const [communityInfo, setCommunityInfo] = useState(null);
  const [selectedCommunityID, setSelectedCommunityID] = useState(id); // Estado para manejar la comunidad seleccionada

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
    console.log(res);

    if (res.posts) {
      console.log(res.posts);

      setPosts(res.posts);
    }
  };

  useEffect(() => {
    GetPostsCommunity();
  }, []);

  async function handleSubmit() {
    if (message !== "") {
      const formData = new FormData();
      formData.append("Status", message);
      if (file) {
        formData.append("imgPost", file);
      }
      formData.append("communityID", selectedCommunityID);

      try {
        if (token) {
          setMessage("");
          setImage(null);
          const res = await PostCreate(formData, token);
          if (res?.message === "StatusCreated") {
            setPosts([res.post, ...Posts]);
          }
        }
      } catch (error) {
        console.error("Error al crear el post", error);
      }
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

      {/* esto */}
      <PostCreator
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
      />

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
