import React, { useEffect, useState } from "react";
import { Typography, TextField, Grid } from "@mui/material";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { FileUploader } from "react-drag-drop-files";
import { FindUserCommunities } from "../../services/backGo/communities"; // Supongo que esta función ya la tienes implementada
import { useParams } from "react-router-dom";

const PostCreator = ({
  AvatarSearch,
  message,
  setMessage,
  file,
  setFile,
  image,
  setImage,
  clearImages,
  dropdownEmotes,
  setDropdownEmotes,
  handleSubmit,
  handleChange2,
  onMouseEnterEmotes,
  onDrag,
  setOnDrag,
  handleCommunityChange,
  onCommunitySelect,
}) => {
  const fileTypes = ["JPG", "PNG", "GIF"];
  const UserId = window.localStorage.getItem("_id");

  const { id } = useParams();

  // Estado para almacenar las comunidades del usuario
  const [userCommunities, setUserCommunities] = useState([]);

  // Obtener las comunidades del usuario
  async function GetCommunityUser() {
    const res = await FindUserCommunities({ UserId });
    setUserCommunities(res.data); // Guardamos las comunidades en el estado
  }

  useEffect(() => {
    console.log(id);

    GetCommunityUser(); // Ejecutamos la función para obtener las comunidades
  }, []);

  const handleChange = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setImage(reader.result);
    });
    reader?.readAsDataURL(file);
  };
  // const handleCommunityChange = (e) => {
  //   console.log(e.target.value);

  //   handleCommunityChange(e.target.value); // Actualizamos el estado local
  // };
  return (
    <div onDragEnterCapture={() => setOnDrag(true)} className="muro-send-tweet">
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
            className="fas fa-times"
          />
          <img style={{ maxWidth: "320px" }} src={image} />
        </div>
      )}

      {onDrag && file === null && (
        <FileUploader
          hoverTitle="Soltar acá"
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
                className="fas fa-photo-video"
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
                className="far fa-smile"
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

          {/* Aquí se puede añadir la selección de comunidad */}
          {!id && (
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
                name="visibility"
                onChange={handleCommunityChange}
              >
                {userCommunities.length > 0 &&
                  userCommunities.map((community) => (
                    <option key={community.id} value={community.id}>
                      {community.communityName}
                    </option>
                  ))}
              </select>
            </Grid>
          )}
        </div>
        <button
          onClick={() => handleSubmit()}
          className="muro-send-tweet-button"
        >
          Postear
        </button>
      </div>
    </div>
  );
};

export default PostCreator;
