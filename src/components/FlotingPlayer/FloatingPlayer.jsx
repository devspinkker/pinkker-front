import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./FloatingPlayer.css";
import { getUserByNameUser } from "../../services/backGo/user";
import FloatingPlayerReproduccion from "../../player/FloatingPlayer";

const FloatingPlayer = () => {
  const location = useLocation();
  const history = useHistory();
  const videoRef = useRef(null);
  const [previousPath, setPreviousPath] = useState(null); // Para guardar la ruta anterior
  const [streamerData, setStreamerData] = useState(null);
  const [streamerName, setStreamerName] = useState(""); // Para mostrar el nombre del streamer
  const [showPlayer, setShowPlayer] = useState(false); // Inicialmente ocultar el reproductor
  const [isPlaying, setIsPlaying] = useState(true); // Estado de reproducción

  useEffect(() => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean); // Obtener partes de la ruta actual
    const isTopLevelRoute = pathParts.length === 1; // Verificar si es una ruta de nivel superior

    if (previousPath !== currentPath) {
      if (isTopLevelRoute && currentPath !== "/") {
        // Estás en la página del usuario (ej: /bruno)
        const nameUser = pathParts[0]; // Obtener el nombre del usuario de la ruta actual
        fetchStreamerData(nameUser); // Obtener los datos del streamer
        setShowPlayer(false); // Ocultar el reproductor mientras estás en esta página
      } else if (previousPath) {
        // Si sales de la ruta del usuario, mostrar el reproductor
        setShowPlayer(true);
      }
    }

    setPreviousPath(currentPath); // Actualiza la ruta anterior
  }, [location]);

  // Función para obtener los datos del streamer
  const fetchStreamerData = async (nameUser) => {
    if (nameUser) {
      const dataStreamer = await getUserByNameUser(nameUser);
      if (dataStreamer?.message === "ok") {
        if (!dataStreamer.data.Online) {
          return;
        }
        const keyTransmission = dataStreamer.data?.keyTransmission?.substring(
          4,
          dataStreamer.data.keyTransmission.length
        );
        setStreamerData(keyTransmission);
        setStreamerName(nameUser); // Guardar el nombre del streamer
      }
    }
  };

  const handleClearPlayer = () => {
    setShowPlayer(false); // Ocultar el reproductor y limpiar el estado
    setStreamerData(null);
  };

  const videoHandler = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying); // Alternar estado de reproducción
    }
  };

  const handleGoToStreamer = () => {
    if (streamerName) {
      history.push(`/${streamerName}`); // Redirigir a la página del streamer
      handleClearPlayer(); // Limpiar el reproductor
    }
  };

  const rtmp = process.env.REACT_APP_RTMP;

  function srcRuta() {
    return streamerData ? `${rtmp}/${streamerData}` : null;
  }

  return (
    <div
      className="FloatingPlayer"
      style={{
        display: showPlayer && streamerData ? "block" : "none",
      }}
    >
      {showPlayer && streamerData ? (
        <div className="FloatingPlayer-container">
          <div className="player-header">
            <span>
              Viendo a <strong>{streamerName}</strong>{" "}
              {/* Mostrar nombre del streamer */}
            </span>
            <button className="close-button" onClick={handleClearPlayer}>
              X
            </button>
          </div>
          <FloatingPlayerReproduccion
            src={srcRuta()}
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
            {/* Botón para redirigir a la ruta del streamer */}
            <svg
              onClick={handleGoToStreamer}
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
      ) : null}
    </div>
  );
};

export default FloatingPlayer;
