import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import "./PopupClipCreator.css";

import { createUserClip } from "../../../services/vods";

import { useNotification } from "../../Notifications/NotificationProvider";
import Loader from "react-loader-spinner";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

import MultiRangeSlider from "./slider/MultiRangeSlider";

import { ScaleLoader } from "react-spinners";
import { getMetadata, getThumbnails } from "video-metadata-thumbnails";

import axios from "axios";

import { createImage } from "../../settings/user/popup/canvasUtils";

export default function PopupClipCreator({ closePopup, video, streamer }) {
  const auth = useSelector((state) => state.auth);
  const { user, isAdmin } = auth;
  const token = useSelector((state) => state.token);

  const alert = useNotification();

  const [videoRef, setVideoRef] = useState(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [cutStartTime, setCutStartTime] = useState(0);
  const [cutEndTime, setCutEndTime] = useState(30);

  const [clipName, setClipName] = useState(null);

  const [loading, setLoading] = useState(false);

  const [covers, setCovers] = useState([]);

  const [selectedCover, setSelectedCover] = useState(null);

  const [textClip, setTextClip] = useState(null);

  let thumbnails = [];

  useEffect(() => {
    const fetchData = async () => {
      if (video != null) {
        const cover = await getThumbnails(video, { interval: 10, scale: 1 });
        await cover.map((image) =>
          thumbnails.push(URL.createObjectURL(image.blob))
        );
        setCovers(thumbnails);
      }
    };
    fetchData();
  }, [video]);

  function setBlobImages(photo) {
    if (photo === undefined) {
      return undefined;
    } else {
      var binaryData = [];
      binaryData.push(photo);
      return URL.createObjectURL(new Blob(binaryData));
    }
  }

  const handleLoadedMetadata = (e) => {
    const video = e.target;
    const duration = video.duration;
    const current = video.currentTime;

    setVideoRef(video);
    setDuration(duration);
    setCurrentTime(current);
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    const current = video.currentTime;

    if (currentTime >= cutEndTime) {
      video.currentTime = cutStartTime;
    }

    setCurrentTime(current);
  };

  const handlePlay = (e) => {
    const video = e.target;
    video.play();
    video.currentTime = cutStartTime;
  };

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setSelectedCover(imageDataUrl);
    }
  };

  const renderClipCut = () => {
    if (videoRef != null && videoRef != undefined) {
      return (
        <div>
          <div
            style={{ width: "90%", textAlign: "center", margin: "20px auto" }}
          >
            <MultiRangeSlider
              min={0}
              max={duration}
              onChange={({ min, max }) => {
                setCutStartTime(min);
                setCutEndTime(max);
              }}
            />
          </div>

          <div
            style={{
              width: "90%",
              textAlign: "left",
              marginTop: "10px",
              margin: "0 auto",
              color: "#ededed",
            }}
          >
            <input
              maxLength={32}
              placeholder="Coloca el titulo de tu clip..."
              className="popupclipcreator-input pinkker-input"
              type="text"
              onChange={(e) => setClipName(e.target.value)}
            />
          </div>

          <div
            style={{
              width: "90%",
              textAlign: "left",
              marginTop: "5px",
              margin: "0 auto",
              color: "#ededed",
            }}
          >
            <input
              maxLength={28}
              placeholder="Coloca un texto para tu clip..."
              className="popupclipcreator-input pinkker-input"
              type="text"
              onChange={(e) => setTextClip(e.target.value)}
            />
          </div>

          <h3 style={{ color: "white", width: "90%", margin: "0 auto" }}>
            Selecciona una portada
          </h3>
          <div
            style={{
              height: "75px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
              margin: "0 auto",
              marginBottom: "20px",
            }}
          >
            {covers.map((image, index) => (
              <div className="clip-create-cover-card">
                <img
                  onClick={() => setSelectedCover(image)}
                  style={{ width: "100px" }}
                  src={image}
                />
              </div>
            ))}
            <div
              style={{
                backgroundColor: "#303030",
                color: "white",
                height: "60px",
              }}
              className="clip-create-cover-card"
            >
              <i class="fas fa-plus" />
              <input
                onChange={onFileChange}
                className="clip-create-cover-input"
                accept="image/*"
                type="file"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "90%",
              margin: "0 auto",
            }}
          >
            <p style={{ fontSize: "14px", color: "#ededed" }}>
              te quedan{" "}
              <a style={{ color: "#ff60b2" }}>
                {clipName === null ? 32 : 32 - clipName.length} caracteres.
              </a>
            </p>
            <div
              style={{ width: "78.1%", textAlign: "right", margin: "0 auto" }}
            >
              <button
                className="button-create-clip pink-button"
                onClick={handleSubmit}
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const handleSubmit = async () => {
    if (videoRef != null && videoRef != undefined) {
      if (clipName === null || clipName === undefined || clipName === "") {
        return alert({
          message: "You must enter a name for the clip",
          type: "ERROR",
        });
      }
      if (cutStartTime === undefined || cutStartTime === null) {
        return alert({ message: "StartTime", type: "ERROR" });
      }
      if (cutEndTime === 0 || cutEndTime === undefined || cutEndTime === null) {
        return alert({ message: "End Time", type: "ERROR" });
      }

      if (clipName.length > 32) {
        return alert({
          message: "The name of the clip can't be longer than 50 characters",
          type: "ERROR",
        });
      }

      const duration = parseInt(cutEndTime - cutStartTime);
      setLoading(true);

      const data = await createUserClip(
        token,
        streamer,
        video,
        cutStartTime,
        cutEndTime,
        clipName,
        duration,
        textClip
      );
      if (data.data != null && data.data != undefined) {
        const image = await createImage(selectedCover);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 1920;
        canvas.height = 1080;

        ctx.drawImage(image, 0, 0, 1920, 1080);

        var wavefilefromblob = new File(
          [canvas.toDataURL("image/jpeg")],
          "image.png",
          { lastModified: 1534584790000, type: "image/png" }
        );

        let formData = new FormData();
        formData.append("file", wavefilefromblob);

        const res = await axios.post(
          process.env.REACT_APP_DEV_API_URL +
            `/api/upload_clip_cover?clip=` +
            data.data.clipId +
            `&text=` +
            textClip,
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: token,
            },
          }
        );

        if (res.data != null) {
          setLoading(false);
          alert({ message: data.data.msg, type: "SUCCESS" });
          closePopup();
        } else {
          alert({ type: "ERROR", message: res });
        }
      }
    }
  };

  function getClip() {
    if (video === null) {
      return (
        <div
          style={{ textAlign: "left" }}
          className={"popupclipcreator-container"}
        >
          <div
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScaleLoader color="#f36197d7" />
          </div>
        </div>
      );
    }

    if (video != null) {
      return (
        <div
          style={{ textAlign: "left" }}
          className={"popupclipcreator-container"}
        >
          <div className="popupclipcreator-close">
            <button className="button-more" onClick={closePopup}>
              <i class="fas fa-times" />
            </button>
          </div>

          {loading ? (
            <div
              style={{
                minHeight: "600px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <ScaleLoader color="#f36197d7" />
                <p style={{ fontFamily: "Montserrat", color: "#ededed" }}>
                  Publicando... espera un momento.
                </p>
              </div>
            </div>
          ) : (
            <div className="popupclipcreator-video">
              {video ? (
                <video
                  src={video}
                  ref={videoRef}
                  controls
                  autoPlay
                  onTimeUpdate={(e) => handleTimeUpdate(e)}
                  onPlay={handlePlay}
                  onLoadedMetadata={handleLoadedMetadata}
                />
              ) : (
                <div
                  style={{
                    minHeight: "600px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  <Loader
                    type="TailSpin"
                    color="#ff60b2"
                    height={125}
                    width={125}
                    timeout={3000}
                  />
                </div>
              )}
            </div>
          )}

          {loading === false && renderClipCut()}
        </div>
      );
    }
  }

  function renderPreview() {
    return (
      <div className="clip-create-preview">
        <div style={{ width: "436px", height: "572px" }}>
          <div
            style={{
              backgroundColor: "#000000",
              position: "absolute",
              left: "101px",
              marginTop: "25px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              height: "185px",
              width: "240px",
            }}
          />
          <img
            style={{ marginTop: "210px" }}
            className="clip-create-selected-cover"
            src={selectedCover}
            alt=""
          />
          <div
            style={{
              backgroundColor: "#000000",
              position: "absolute",
              left: "101px",
              marginTop: "360px",
              borderEndEndRadius: "20px",
              borderEndStartRadius: "20px",
              height: "185px",
              width: "240px",
            }}
          />
          <img
            style={{
              position: "absolute",
              left: "175px",
              marginTop: "440px",
              width: "85px",
            }}
            src="https://res.cloudinary.com/pinkker/image/upload/v1672958413/logo_4_gwjtqc.png"
          />
          <p
            style={{
              position: "absolute",
              left: "100px",
              textAlign: "center",
              marginTop: "120px",
              color: "white",
              fontSize: "22px",
              width: "245px",
            }}
          >
            {textClip}
          </p>

          <img src="/images/phone.png" />
        </div>
      </div>
    );
  }

  return (
    <div className="popupclipcreator-body">
      {videoRef && renderPreview()}
      {getClip()}
    </div>
  );
}
