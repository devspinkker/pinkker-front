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
import { Grid, Typography } from "@mui/material";
import { GrHomeRounded } from "react-icons/gr";
import { TbEdit } from "react-icons/tb";

export default function UserSettings({ isMobile, user }) {
  const [type, setType] = useState(0);
  const [file, setFile] = useState(null);

  console.log("user", user);
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  const [showPopupSettings, shopPopupSettings] = useState(false);

  const theme = useTheme();

  function togglePopupSettings() {
    shopPopupSettings(!showPopupSettings);
  }

  const [avatar, Setavatar] = useState("");
  useEffect(() => {
    let avatar = window.localStorage.getItem("avatar");
    Setavatar(avatar);
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
        <div style={{ padding: "1.1rem 5.3rem" }}>
          <div className="usersettings-settings">
            <div className="usersettings-change-avatar">
              <h3>Foto de Perfil</h3>
              <div className="usersettings-card">
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    justifyContent: "space-between",
                    padding: "15px 15px",
                  }}
                >
                  <Grid
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "0px 15px",
                    }}
                  >
                    <img
                      src={user?.Avatar}
                      style={{
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                      }}
                      alt=""
                    />
                    <Grid
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      {user?.NameUser}
                      <p
                        style={{
                          fontSize: "13px",
                          color: "darkgray",
                        }}
                      >
                        Debe ser un archivo JPEG, PNG o GIF de máximo 10 MB.
                      </p>
                    </Grid>
                  </Grid>

                  <Grid
                    style={{
                      padding: "0px 15px 0px 0px",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  >
                    <TbEdit onClick={() => togglePopupSettings()} />
                  </Grid>
                </div>
              </div>
            </div>

            {/*<Banner/>*/}

            <div className="usersettings-change-avatar">
              <h3>Banner de Perfil</h3>
              <div className="usersettings-card">
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    justifyContent: "space-between",
                    padding: "15px 15px",
                  }}
                >
                  <Grid
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      padding: "0px 15px",
                    }}
                  >
                    <img
                      src={user?.Avatar}
                      style={{
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                      }}
                      alt=""
                    />
                    <Grid
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          color: "darkgray",
                        }}
                      >
                        Formato de archivo: JPEG, PNG, GIF (200 x 480
                        recomendado, 10MB máx)
                      </p>
                    </Grid>
                  </Grid>

                  <Grid
                    style={{
                      padding: "0px 15px 0px 0px",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  >
                    <TbEdit onClick={() => togglePopupSettings()} />
                  </Grid>
                </div>
              </div>
            </div>
            <Biography user={user} />
            {/* <SocialNetwork user={user} /> */}
          </div>
          {showPopupSettings === true && (
            <UserSettingsPopup
              usuario={user}
              closePopup={() => togglePopupSettings()}
            />
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

  // function getLeftForType() {
  //   if (type === 0) {
  //     return isMobile ? "18px" : "42px";
  //   }

  //   if (type === 1) {
  //     return isMobile ? "137px" : "162px";
  //   }

  //   if (type === 2) {
  //     return isMobile ? "255px" : "280px";
  //   }

  //   if (type === 3) {
  //     return isMobile ? "255px" : "280px";
  //   }

  //   if (type === 4) {
  //     return "494px";
  //   }
  // }

  return (
    <div className={"usersettings-body-" + theme.theme}>
      <div className="usersettings-navbar">
        <Grid
          style={{
            borderBottom: "1px solid rgb(42, 46, 56)",
            padding: "0px 5.3rem 1.45%",
          }}
        >
          <h3 style={{ color: "white", fontSize: "30px" }}>Configuración</h3>
        </Grid>
        <Grid
          style={{
            borderBottom: "1px solid rgb(42, 46, 56)",
            padding: ".75% 5.3rem",
          }}
        >
          <Grid
            style={{
              display: "flex",
              padding: "5px 5px",
              backgroundColor: "#2a2e38",
              borderRadius: "5px",
              gap: "15px",
              width: "44%",
            }}
          >
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
              }}
              className={type === 0 ? "item-config-active" : "item-config"}
              onClick={() => setType(0)}
            >
              <GrHomeRounded />
              <Typography>Cuenta</Typography>
            </Grid>

            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
              }}
              className="item-config"
            >
              <GrHomeRounded />
              <Typography>Verificar</Typography>
            </Grid>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
              }}
              className={type === 4 ? "item-config-active" : "item-config"}
              onClick={() => setType(4)}
            >
              <GrHomeRounded />
              <Typography>Seguridad</Typography>
            </Grid>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
              }}
              className="item-config"
            >
              <GrHomeRounded />
              <Typography>Sesiones</Typography>
            </Grid>
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
              }}
              className={type === 1 ? "item-config-active" : "item-config"}
              onClick={() => setType(1)}
            >
              <GrHomeRounded />
              <Typography>Pinkker Prime</Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>

      {getType()}
    </div>
  );
}
