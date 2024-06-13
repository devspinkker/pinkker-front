import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNotification } from "../../../Notifications/NotificationProvider";
import { ScaleLoader } from "react-spinners";

import "./AddEmotePopup.css";
import { CreateOrUpdateEmote } from "../../../../services/backGo/Emotes";

export default function AddEmotePopup({ closePopup, emoteType, handleReload }) {
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const token = window.localStorage.getItem("token");

  const [imageSrc, setImageSrc] = useState(null);
  const [emoteName, setEmoteName] = useState("");
  const [loading, setLoading] = useState(false);

  const alert = useNotification();

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) {
        alert({
          type: "ERROR",
          message: "La imagen no puede ser mayor a 1 MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit() {
    try {
      setLoading(true);
      const file = new File([imageSrc], emoteName + ".png", {
        lastModified: 1534584790000,
        type: "image/png",
      });
      let formData = new FormData();
      formData.append("emoteImage", file);
      formData.append("name", emoteName);
      formData.append("typeEmote", emoteType);
      const res = await CreateOrUpdateEmote(formData, token);

      if (res) {
        alert({
          type: "SUCCESS",
          message: res.message || "Emote creado o actualizado exitosamente.",
        });
        handleReload();
        closePopup();
      } else {
        alert({ type: "ERROR", message: res.message || "Ocurrió un error." });
      }
    } catch (err) {
      alert({ type: "ERROR", message: err.message || "Ocurrió un error." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="addemote-popup-body">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className={"addemote-popup-container"}>
          <div className="usersettings-popup-close">
            <button onClick={closePopup}>
              <i style={{ fontSize: "24px" }} className="fas fa-times" />
            </button>
          </div>

          <div className="addmote-popup-content">
            <h3>Agregar un emote a tu canal</h3>

            {imageSrc === null ? (
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  margin: "0 auto",
                  marginTop: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="dashboard-content-emotes-empty"
              >
                <i style={{ fontSize: "35px" }} className="fas fa-plus" />
                <input
                  onChange={onFileChange}
                  className="addmote-popup-file"
                  type="file"
                />
              </div>
            ) : (
              <img
                style={{
                  width: "150px",
                  height: "150px",
                  margin: "0 auto",
                  marginTop: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                src={imageSrc}
                alt="Emote"
              />
            )}

            <p
              style={{ color: "darkgray", marginTop: "20px", fontSize: "14px" }}
            >
              Sube una imagen PNG o GIF cuadrada. La imagen no puede ser mayor a
              1 MB.
            </p>

            <div style={{ marginTop: "20px" }}>
              <h3>Nombre del emoticono</h3>
              <div className="addemote-popup-input">
                <p>{user.name}_</p>
                <input
                  style={{ width: "250px" }}
                  onChange={(e) => setEmoteName(e.target.value)}
                  type="text"
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "right" }}>
              {loading ? (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#303030",
                    width: "160px",
                  }}
                  className="addemote-popup-button"
                >
                  <ScaleLoader
                    width={4}
                    height={20}
                    style={{ marginRight: "10px" }}
                    color="#f36197d7"
                  />{" "}
                  Publicando..
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="addemote-popup-button"
                >
                  Publicar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
