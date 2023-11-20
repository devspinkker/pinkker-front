import React, { useState, useEffect } from "react";

import "./UserSettings.css";
import { useSelector } from "react-redux";

import axios from "axios";

import UserSettingsPopup from "./popup/UserSettingsPopup";

import Biography from "./biography/Biography";
import Themes from "./themes/Themes";
import Banner from "./banner/Banner";

import useTheme from "../../../theme/useTheme";

import Prime from "./prime/Prime";
import ChannelSettings from "./channel/ChannelSettings";
import Pagos from "./pagos/Pagos";
import SocialNetwork from "./socialnetwork/SocialNetwork";
import { editAvatar, editProfile } from "../../../services/backGo/user";

export default function UserSettings({ isMobile }) {
  const [type, setType] = useState(0);
  const [file, setFile] = useState(null);

  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  const token = useSelector((state) => state.token);

  const [showPopupSettings, shopPopupSettings] = useState(false);

  const theme = useTheme();

  function togglePopupSettings() {
    shopPopupSettings(!showPopupSettings);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append("avatar", file);
      let token = window.localStorage.getItem("token");
      const res = await editAvatar(token, formData);
    } catch (err) {}
  };

  function getType() {
    if (type === 0) {
      return (
        <div>
          <div className="usersettings-settings">
            <div className="usersettings-change-avatar">
              <h2>Imagen de Perfil</h2>
              <div className="usersettings-card">
                <div style={{ width: "20%", textAlign: "center" }}>
                  <img
                    src={user.avatar}
                    style={{ borderRadius: "100px", width: "95px" }}
                    alt=""
                  />
                </div>
                <div style={{ width: "55%" }}>
                  <button
                    onClick={() => togglePopupSettings()}
                    className="button-settings-popup gray-button"
                  >
                    Actualizar imagen de perfil
                  </button>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "darkgray",
                      marginTop: "10px",
                    }}
                  >
                    El formato debe ser JPEG, PNG o GIF y no puede superar los
                    10 MB.
                  </p>
                </div>
              </div>
            </div>

            {/*<Banner/>*/}
            <Biography />
            <SocialNetwork />
          </div>
          {showPopupSettings === true && (
            <UserSettingsPopup closePopup={() => togglePopupSettings()} />
          )}
        </div>
      );
    }

    if (type === 1) {
      return (
        <div>
          <Prime />
        </div>
      );
    }

    if (type === 3) {
      return (
        <div>
          <ChannelSettings />
        </div>
      );
    }

    {
      /*if(type === 4) {
            return (
                <div>
                    <Pagos/>
                </div>
            )
        }*/
    }
  }

  function getLeftForType() {
    if (type === 0) {
      return isMobile ? "18px" : "42px";
    }

    if (type === 1) {
      return isMobile ? "137px" : "162px";
    }

    if (type === 2) {
      return isMobile ? "255px" : "280px";
    }

    if (type === 3) {
      return isMobile ? "255px" : "280px";
    }

    if (type === 4) {
      return "494px";
    }
  }

  return (
    <div className={"usersettings-body-" + theme.theme}>
      <div style={{ height: "50px", opacity: "0" }} />
      <div className="usersettings-navbar">
        <h2>Ajustes de cuenta</h2>

        <div
          style={{
            width: "100%",
            margin: "0 auto",
            borderTop: "0.01em solid #2b2b2b3f",
            marginTop: "20px",
            zIndex: "1000",
          }}
          className="type-set"
        >
          <div
            style={{ zIndex: "1000" }}
            onClick={() => setType(0)}
            className={type === 0 ? "type-card active" : "type-card"}
          >
            <h3 onClick={() => setType(0)}>Cuenta</h3>
          </div>
          <div
            style={{ zIndex: "1000", width: "120px" }}
            onClick={() => setType(1)}
            className={type === 1 ? "type-card active" : "type-card"}
          >
            <h3 onClick={() => setType(1)}>Pinkker Prime</h3>
          </div>
          {/*<div style={{zIndex: "1000"}} className={ type === 3 ? "type-card active" : "type-card"}>
                            <h3><a style={{textDecoration: "none", color: "darkgray"}} href={"/" + user.name + "/dashboard/home"}>Canal</a></h3>
    </div>*/}
          <div
            style={{ zIndex: "1000" }}
            onClick={() => setType(3)}
            className={type === 3 ? "type-card active" : "type-card"}
          >
            <h3 onClick={() => setType(4)}>Seguridad</h3>
          </div>

          <div
            style={{ left: getLeftForType(), zIndex: "1000" }}
            className="type-line"
          ></div>
        </div>
      </div>

      {getType()}
    </div>
  );
}
