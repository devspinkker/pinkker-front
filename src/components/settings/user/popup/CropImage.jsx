import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./canvasUtils";
import { editAvatar, editBanner } from "../../../../services/backGo/user";
import { useNotification } from "../../../Notifications/NotificationProvider";

export default function CropImage({ closePopup, image,imageSrc, changeType }) {
  const [cropper, setCropper] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const alert = useNotification();

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const changeImage = async (e) => {
    e.preventDefault();
    try {
      // const fileCropped = await getCroppedImg(
      //   image,
      //   croppedAreaPixels,
      //   rotation
      // );

      // const file = new File([fileCropped], `${changeType}.png`, {
      //   lastModified: new Date().getTime(),
      //   type: "image/png",
      // });
      let formData = new FormData();
      formData.append(changeType, image);

      const token = window.localStorage.getItem("token");
      const res =
        changeType === "avatar"
          ? await editAvatar(token, formData)
          : await editBanner(token, formData);

      if (res.message === "StatusOK") {
        window.localStorage.setItem(changeType, res[changeType]);
        alert({ type: "SUCCESS", message: res.message });
        closePopup();
      } else {
        alert({ type: "ERROR", message: res });
      }
    } catch (err) {
      alert({ type: "ERROR", message: "Error al procesar la imagen" });
    }
  };

  return (
    <div
      style={{ textAlign: "left", width: "25%" }}
      className={"usersettings-popup-container"}
    >
      <div className="usersettings-popup-close">
        <button onClick={closePopup}>
          <i className="fas fa-times" />
        </button>
      </div>

      <div className={"usersettings-crop-container"}>
        <Cropper
          image={imageSrc}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={changeType === "avatar" ? 1 / 1 : 4 / 1}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      {/* <div className="usersettings-crop-input-container">
        <i
          style={{ color: "darkgray", marginRight: "10px" }}
          className="fas fa-search-minus"
        ></i>
        <input
          value={zoom}
          type="range"
          min={1}
          max={3}
          step={0.1}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
        />
        <i
          style={{ color: "darkgray", marginLeft: "10px" }}
          className="fas fa-search-plus"
        ></i>
      </div> */}
{/* 
      <div className="usersettings-crop-input-container">
        <i
          style={{ color: "darkgray", marginRight: "10px" }}
          className="fas fa-undo"
        ></i>
        <input
          value={rotation}
          type="range"
          min={0}
          max={360}
          step={1}
          onChange={(e) => setRotation(parseFloat(e.target.value))}
        />
      </div> */}

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button onClick={closePopup} className="usersettings-popup-cancel">
          Cancelar
        </button>
        <button onClick={changeImage} className="usersettings-popup-save">
          Guardar
        </button>
      </div>
    </div>
  );
}
