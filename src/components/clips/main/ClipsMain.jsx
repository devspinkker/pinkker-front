import React, { useEffect, useState } from "react";
import "./ClipsMain.css";
import { useSelector } from "react-redux";
import ClipCard from "./card/ClipCard";
import Auth from "../../auth/Auth";
import {
  ClipsRecommended,
  GetClipsCategory,
  GetClipsMostViewed,
} from "../../../services/backGo/clip";
import { BarLoader } from "react-spinners";

export default function ClipsMain({ tyExpanded, expandedLeft }) {
  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;

  const [clips, setClips] = useState([]);
  const [viewedClip, setViewedClip] = useState(0);
  const [viewAuth, setViewAuth] = useState(false);
  const [loadingMoreClips, setLoadingMoreClips] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transitionDirection, setTransitionDirection] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadClips();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const loadClips = async () => {
    try {
      let token = window.localStorage.getItem("token");
      const ExcludeIDs = clips.map((clips) => clips.id);
      let res;
      if (token) {
        res = await ClipsRecommended(token, ExcludeIDs);
      } else {
        res = await GetClipsMostViewed(1);
      }

      if (res.data.message === "ok") {
        const newClips = res.data.data;
        setClips(newClips);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreClips = async () => {
    if (!isLogged && clips.length > 0) {
      try {
        let token = window.localStorage.getItem("token");

        let res;
        if (token) {
          const ExcludeIDs = clips.map((clips) => clips.id);
          res = await ClipsRecommended(token, ExcludeIDs);
        } else {
          res = await GetClipsCategory("", 1, "");
        }

        if (res.data.message === "ok" && res.data.data != null) {
          const newClips = res.data.data;
          setClips([...clips, ...newClips]);
        } else {
          res = await GetClipsMostViewed(1);
          if (res.data.message === "ok") {
            setClips([...clips, ...res.data.data]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMoreClips(false);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      previewClip();
    } else if (event.key === "ArrowDown") {
      nextClip();
    }
  };

  const nextClip = () => {
    if (viewedClip < clips.length - 1) {
      // Primero, establecemos la dirección de transición hacia abajo
      setTransitionDirection("down");

      setTimeout(() => {
        // Luego, cambiamos el clip visto y establecemos la dirección hacia arriba para la animación inversa
        setViewedClip((prevViewedClip) => prevViewedClip + 1);
        setTransitionDirection("up");
      }, 300); // Esperamos un tiempo para que termine la primera animación

      setTimeout(() => {
        // Finalmente, reseteamos la dirección de transición
        setTransitionDirection(null);
      }, 400); // Esperamos el doble del tiempo de la animación para asegurar que termine completamente

      // Verificamos si estamos viendo el antepenúltimo clip
      if (viewedClip === clips.length - 3) {
        // Cargamos más clips
        loadMoreClips();
      }
    }
  };

  const previewClip = () => {
    if (viewedClip > 0) {
      // Primero, establecemos la dirección de transición hacia arriba
      setTransitionDirection("up");

      setTimeout(() => {
        // Luego, cambiamos el clip visto y establecemos la dirección hacia abajo para la animación inversa
        setViewedClip((prevViewedClip) => prevViewedClip - 1);
        setTransitionDirection("down");
      }, 300); // Esperamos un tiempo para que termine la primera animación

      setTimeout(() => {
        // Finalmente, reseteamos la dirección de transición
        setTransitionDirection(null);
      }, 300); // Esperamos el doble del tiempo de la animación para asegurar que termine completamente
    }
  };

  return (
    <div className="clipsmain-body" style={{ padding: "0px" }}>
      {isLoading ? (
        <div
          style={{
            height: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <div className={`clips-container ${transitionDirection}`}>
            {clips.map((clip, index) => (
              <div
                key={clip.id}
                className={`clip-wrapper ${
                  index === viewedClip ? "active" : ""
                }`}
              >
                <ClipCard
                  tyExpanded={tyExpanded}
                  type={index === 0 ? 0 : 1}
                  clip={clip}
                  isActive={index === viewedClip ? 2 : 1}
                />
              </div>
            ))}
          </div>

          <div
            className="clipsmain-right-buttons"
            style={{
              transition: "width 0.2s ease-in-out 0s",
              right: expandedLeft && "15%",
              top: "120px",
            }}
          >
            <div
              style={{
                height: "40%",
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
              }}
            >
              <i
                onClick={previewClip}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  color: "darkgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
                className="fas fa-arrow-up"
              />
            </div>
            <div
              style={{
                height: "40%",
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <i
                onClick={nextClip}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#303030",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50px",
                  color: "darkgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
                className="fas fa-arrow-down"
              />
            </div>
          </div>

          {viewAuth && (
            <Auth typeDefault={0} closePopup={() => setViewAuth(false)} />
          )}
        </>
      )}
    </div>
  );
}
