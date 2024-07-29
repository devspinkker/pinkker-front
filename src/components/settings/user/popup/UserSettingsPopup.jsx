import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./UserSettingsPopup.css";
import CropImage from "./CropImage";
import { getRotatedImage } from "./canvasUtils";
import { getOrientation } from "get-orientation/browser";
import { updateCustomAvatar } from "../../../../services/user";
import { Grid } from "@mui/material";

export default function UserSettingsPopup({ closePopup, usuario, changeType }) {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const token = useSelector((state) => state.token);

  const [showPopupCrop, setShowpopupCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  function togglePopupCrop() {
    setShowpopupCrop(!showPopupCrop);
  }

  const ORIENTATION_TO_ANGLE = {
    3: 180,
    6: 90,
    8: -90,
  };

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      // Apply rotation if needed
      const orientation = await getOrientation(file);
      const rotation = ORIENTATION_TO_ANGLE[orientation];
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
      }

      setImageSrc(imageDataUrl);
      togglePopupCrop();
    }
  };

  const onEditAvatar = async () => {
    setImageSrc(user.avatar);
    togglePopupCrop();
  };

  async function handleCustomAvatar() {
    await updateCustomAvatar(token);
    closePopup();
  }

  return (
    <div className="usersettings-popup-body">
      <div
        style={{ textAlign: "left", width: "25%" }}
        className={"usersettings-popup-container"}
      >
        <div className="usersettings-popup-close">
          <button onClick={closePopup}>
            <i className="fas fa-times" />
          </button>
        </div>

        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            {changeType === "avatar"
              ? "Editar foto de perfil"
              : "Editar banner"}
          </h2>

          <img
            src={changeType === "avatar" ? usuario.Avatar : usuario.Banner}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: changeType === "avatar" ? "50%" : "0",
              margin: "0 auto",
              display: "flex",
            }}
          />
          <div className="usersettingspopup-card">
            <div style={{ cursor: "pointer" }}>
              <h4>
                {changeType === "avatar"
                  ? "Cambiar foto de perfil"
                  : "Cambiar banner"}
              </h4>
              <input
                className="usersettings-loadfile"
                type="file"
                onChange={onFileChange}
                accept="image/*"
              />
            </div>
          </div>
        </Grid>
      </div>
      {showPopupCrop && (
        <CropImage
          image={imageSrc}
          closePopup={() => togglePopupCrop()}
          changeType={changeType}
        />
      )}
    </div>
  );

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }
}
