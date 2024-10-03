import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./ClipsMain.css";
import { useParams } from "react-router-dom";
import ClipCard from "./card/ClipCard";
import {
  ClipsRecommended,
  GetClipsMostViewed,
  GetClipId,
  GetClipIdlogeado,
} from "../../../services/backGo/clip";
import { BarLoader } from "react-spinners";
import ClipsMobile from "./ClipsMobile";

const ClipsMain = ({ tyExpanded, expandedLeft, isMobile }) => {
  const { clipId } = useParams();

  const [clips, setClips] = useState([]);
  const [viewedClip, setViewedClip] = useState(null);
  const [loadingMoreClips, setLoadingMoreClips] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transitionDirection, setTransitionDirection] = useState(null);
  const [blobUrls, setBlobUrls] = useState({}); // Almacena las URLs de los blobs

  let startY = 0;

  const loadMoreClips = useCallback(
    async (dt) => {
      if (loadingMoreClips) return;

      setLoadingMoreClips(true);

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
          setClips((prevClips) => [...prevClips, ...newClips]);

          setViewedClip(dt);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingMoreClips(false);
      }
    },
    [clips, loadingMoreClips]
  );

  const nextClip = useCallback(() => {
    const currentIndex = clips.findIndex((clip) => clip?.id === viewedClip);
    let dt = clips[currentIndex + 1]?.id;
    if (currentIndex < clips.length - 1) {
      setTransitionDirection("down");
      setTimeout(() => {
        setViewedClip(dt);
        setTransitionDirection("up");
      }, 300);

      setTimeout(() => {
        setTransitionDirection(null);
      }, 400);

      if (currentIndex === clips.length - 2) {
        loadMoreClips(dt);
      }
    }
  }, [clips, viewedClip, loadMoreClips]);

  const previewClip = useCallback(() => {
    const currentIndex = clips.findIndex((clip) => clip.id === viewedClip);
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
  }, [clips, viewedClip]);

  const revokeBlobUrl = (clipId) => {
    if (blobUrls[clipId]) {
      URL.revokeObjectURL(blobUrls[clipId]); // Revoca la URL del blob
      setBlobUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[clipId];
        return newUrls;
      });
    }
  };

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.deltaY > 0) {
        nextClip();
      } else if (e.deltaY < 0) {
        previewClip();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        nextClip();
      } else if (e.key === "ArrowUp") {
        previewClip();
      }
    };

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const endY = e.touches[0].clientY;
      const deltaY = startY - endY;

      if (deltaY > 50) {
        nextClip();
      } else if (deltaY < -50) {
        previewClip();
      }
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [nextClip, previewClip]);

  const loadClips = useCallback(async () => {
    try {
      let res;
      let newClips = [];
      let token = window.localStorage.getItem("token");

      if (clipId && !token) {
        const resClipById = await GetClipId(clipId);
        if (
          resClipById.data.message === "StatusOK" &&
          resClipById.data.dataClip != null
        ) {
          newClips.push(resClipById.data.dataClip);
        }
      } else if (clipId && token) {
        const resClipById = await GetClipIdlogeado(clipId, token);
        if (
          resClipById.data.message === "StatusOK" &&
          resClipById.data.dataClip != null
        ) {
          newClips.push(resClipById.data.dataClip);
        }
      }

      const ExcludeIDs = newClips.map((clip) => clip.id);

      if (token) {
        res = await ClipsRecommended(token, ExcludeIDs);
      } else {
        res = await GetClipsMostViewed(1);
      }

      if (res.data.message === "ok" && res.data.data != null) {
        newClips = [...newClips, ...res.data.data];
      }

      setClips(newClips);
      setViewedClip(newClips[0]?.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [clipId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadClips();
  }, [loadClips]);

  const memoizedClips = useMemo(() => {
    if (!viewedClip || clips.length === 0) return null;

    const clipIndex = clips.findIndex((clip) => clip.id === viewedClip);

    // Si no se encuentra el clip, no se renderiza nada y se elimina el blob si existe
    if (clipIndex === -1) {
      revokeBlobUrl(viewedClip);
      return null;
    }

    const clipsToRender = clips.slice(
      Math.max(clipIndex - 0, 0),
      Math.min(clipIndex + 1, clips.length)
    );

    return clipsToRender.map((clip) => (
      <div
        key={clip.id}
        className={`clip-wrapper ${clip.id === viewedClip ? "active" : ""}`}
        id={clip.id}
      >
        {console.log(clip.id)}
        <ClipCard
          tyExpanded={tyExpanded}
          type={0}
          clip={clip}
          isActive={clip.id === viewedClip ? 2 : 1}
        />
      </div>
    ));
  }, [clips, viewedClip, tyExpanded]);

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
      ) : !isMobile ? (
        <>
          <div className={`clips-container ${transitionDirection}`}>
            {memoizedClips}
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
                }}
                className="fa fa-arrow-up fa-lg"
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
                }}
                className="fa fa-arrow-down fa-lg"
              />
            </div>
          </div>
        </>
      ) : (
        <ClipsMobile />
      )}
    </div>
  );
};

export default ClipsMain;
