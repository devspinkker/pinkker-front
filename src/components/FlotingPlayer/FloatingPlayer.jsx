import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./FloatingPlayer.css";
import { getUserByNameUser } from "../../services/backGo/user";
import FloatingPlayerReproduccion from "../../player/FloatingPlayer";

const FloatingPlayer = () => {
  const location = useLocation();
  const history = useHistory();
  const videoRef = useRef(null);
  const [previousPath, setPreviousPath] = useState(null);
  const [streamerData, setStreamerData] = useState(null);
  const [showPlayer, setShowPlayer] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true); // Estado de reproducción

  useEffect(() => {
    const currentPath = location.pathname;

    const isTopLevelRoute = currentPath.split("/").length === 2;

    if (currentPath !== "/" && isTopLevelRoute) {
      setPreviousPath(currentPath);
    }

    async function GetUser() {
      let nameUser = getPreviousRouteName();
      const dataStreamer = await getUserByNameUser(nameUser);

      if (dataStreamer?.message === "ok") {
        const keyTransmission = dataStreamer.data?.keyTransmission?.substring(
          4,
          dataStreamer.data.keyTransmission.length
        );
        setStreamerData(keyTransmission);
      }
    }

    GetUser();
  }, [location]);

  const getPreviousRouteName = () => {
    if (previousPath) {
      const pathParts = previousPath.split("/");
      return pathParts[1];
    }
    return null;
  };

  const handleGoToPatch = () => {
    if (previousPath) {
      history.push(previousPath);
      handleClearPlayer();
    }
  };

  const handleClearPlayer = () => {
    setShowPlayer(false); // Oculta el reproductor y limpia el estado
    setStreamerData(null);
  };

  const videoHandler = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying); // Alterna el estado de reproducción
  };

  const rtmp = process.env.REACT_APP_RTMP;
  const streamUrl = streamerData ? `${rtmp}/${streamerData}` : null;

  return (
    <div
      className="FloatingPlayer"
      style={{
        display: (!showPlayer || !streamerData) && "none",
      }}
    >
      {showPlayer && streamerData ? (
        <div className="FloatingPlayer-container">
          <div className="player-header">
            <span>
              Viendo a <strong>{getPreviousRouteName()}</strong>
            </span>
            <button className="close-button" onClick={handleClearPlayer}>
              X
            </button>
          </div>
          <FloatingPlayerReproduccion
            src={streamUrl}
            videoRef={videoRef}
            height="360px"
            width="640px"
            quality="auto"
          />
          <div className="player-controls">
            <i
              onClick={videoHandler}
              className={`fas ${
                isPlaying ? "fa-pause" : "fa-play"
              } pinkker-button-more`}
              style={{ cursor: "pointer" }}
            />
            <svg
              onClick={handleGoToPatch}
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 20 20"
              aria-hidden="true"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ cursor: "pointer" }}
            >
              <path
                fillRule="evenodd"
                d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.243 1 1 0 11-1.415 1.414 5 5 0 010-7.07 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.415 3 3 0 000-4.242 1 1 0 010-1.415zM10 9a1 1 0 011 1v.01a1 1 0 11-2 0V10a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FloatingPlayer;
