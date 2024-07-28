import React, { useEffect, useState } from "react";
import "./ClipsMain.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ClipCard from "./card/ClipCard";
import Auth from "../../auth/Auth";
import {
  ClipsRecommended,
  GetClipsMostViewed,
  GetClipId,
} from "../../../services/backGo/clip";
import { BarLoader } from "react-spinners";

export default function ClipsMain({ tyExpanded, expandedLeft }) {
  const auth = useSelector((state) => state.auth);
  const { isLogged } = auth;
  const { clipId } = useParams(); // Usa useParams para obtener el clipId

  const [clips, setClips] = useState([]);
  const [viewedClip, setViewedClip] = useState(null);
  const [viewAuth, setViewAuth] = useState(false);
  const [loadingMoreClips, setLoadingMoreClips] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transitionDirection, setTransitionDirection] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadClips();

    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        previewClip();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        nextClip();
      }
    };

    const handleWheel = (event) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        previewClip();
      } else if (event.deltaY > 0) {
        nextClip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (clipId) {
      setViewedClip(clipId);
    } else if (clips.length > 0) {
      setViewedClip(clips[0].id); // Set the first clip as default if no parameter is found
    }
  }, [clipId, clips]);

  const loadClips = async () => {
    try {
      let res;
      let newClips = [];
      let token = window.localStorage.getItem("token");

      // Obtén el clip por clipId si está presente
      if (clipId) {
        const resClipById = await GetClipId(clipId); // Asegúrate de que esta función existe
        console.log('resClipById', resClipById)
        if (resClipById.data.message === "StatusOK" && resClipById.data.dataClip != null) {
          newClips.push(resClipById.data.dataClip);
        }
      }
      
      const ExcludeIDs = newClips.map((clip) => clip.id);

      // Obtén los clips recomendados si existe token, sino obtén los clips más vistos
      if (token) {
        res = await ClipsRecommended(token, ExcludeIDs);
      } else {
        res = await GetClipsMostViewed(1);
      }

      if (res.data.message === "ok" && res.data.data != null) {
        newClips = [...newClips, ...res.data.data];
      }

      setClips(newClips);
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
          const ExcludeIDs = clips.map((clip) => clip.id);
          res = await ClipsRecommended(token, ExcludeIDs);
        } else {
          res = await GetClipsMostViewed(1);
        }

        if (res.data.message === "ok" && res.data.data != null) {
          const newClips = res.data.data;
          setClips([...clips, ...newClips]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMoreClips(false);
      }
    }
  };

  const nextClip = () => {
    const currentIndex = clips.findIndex(clip => clip.id === viewedClip);
    if (currentIndex < clips.length - 1) {
      setTransitionDirection("down");

      setTimeout(() => {
        setViewedClip(clips[currentIndex + 1].id);
        setTransitionDirection("up");
      }, 300);

      setTimeout(() => {
        setTransitionDirection(null);
      }, 400);

      if (currentIndex === clips.length - 3) {
        loadMoreClips();
      }
    }
  };

  const previewClip = () => {
    const currentIndex = clips.findIndex(clip => clip.id === viewedClip);
    if (currentIndex > 0) {
      setTransitionDirection("up");

      setTimeout(() => {
        setViewedClip(clips[currentIndex - 1].id);
        setTransitionDirection("down");
      }, 300);

      setTimeout(() => {
        setTransitionDirection(null);
      }, 300);
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
                className={`clip-wrapper ${clip.id === viewedClip ? "active" : ""}`}
                id={clip.id}
              >
                <ClipCard
                  tyExpanded={tyExpanded}
                  type={index === 0 ? 0 : 1}
                  clip={clip}
                  isActive={clip.id === viewedClip ? 2 : 1}
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
