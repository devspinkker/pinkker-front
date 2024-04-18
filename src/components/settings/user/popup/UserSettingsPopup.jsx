import React, { useState, useEffect } from "react";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { dispatchLogin } from "../../../../redux/actions/authAction";
import { Link, useHistory, useLocation } from "react-router-dom";

import "./UserSettingsPopup.css";
import CropImage from "./CropImage";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";
import { getOrientation } from "get-orientation/browser";

import { updateCustomAvatar } from "../../../../services/user";
import { Grid } from "@mui/material";

export default function UserSettingsPopup({ closePopup, usuario }) {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [showPopupCrop, setShowpopupCrop] = useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);

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

      // apply rotation if needed
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

        <Grid style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'15px'}}>

          <h2 style={{ textAlign: 'center' }}>Editar foto de perfil</h2>

          <img src={usuario.Avatar} style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto', display: 'flex' }} />
          <div  className="usersettingspopup-card">

            <div style={{ cursor: "pointer" }}>
              {/* <i style={{ fontSize: "24px" }} class="fas fa-upload"></i> */}
              <h4>Cambiar foto de perfil</h4>

              <input
                className="usersettings-loadfile"
                type="file"
                onChange={onFileChange}
                accept="image/*"
              />
            </div>
          </div>
        </Grid>


        {/* <div onClick={onEditAvatar} className="usersettingspopup-card">
          <div>
            <i style={{ fontSize: "24px" }} class="fas fa-edit"></i>
            <h4>Editar foto</h4>
          </div>
        </div> */}

        {/*<div onClick={() => handleCustomAvatar()} className="usersettingspopup-card">
                    <div>
                      <img style={{width: "50px"}} src={user.lookImage} />
                      <h4>Seleccionar tu avatar</h4>
                    </div>
    </div>*/}
      </div>
      {showPopupCrop === true && (
        <CropImage image={imageSrc} closePopup={() => togglePopupCrop()} />
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
