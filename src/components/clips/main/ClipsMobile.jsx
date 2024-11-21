import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams } from "react-router-dom";

import { Box, Typography, IconButton, Avatar, Grid } from "@mui/material";
import { Favorite, Comment, Share, MusicNote } from "react-icons/fa";
import { FaHeart, FaComment, FaShare, FaMusic } from "react-icons/fa";
import "./ClipsMobile.css"; // Archivo CSS para estilos personalizados
import {
  ClipsRecommended,
  GetClipsMostViewed,
  GetClipId,
  GetClipIdlogeado,
} from "../../../services/backGo/clip";
import Loading from "../../layout/Loading";
const ClipsMobile = () => {
  const { clipId } = useParams();
  const playerRef = useRef();

  const [clips, setClips] = useState([]);
  const [viewedClip, setViewedClip] = useState(null);
  const [loadingMoreClips, setLoadingMoreClips] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transitionDirection, setTransitionDirection] = useState(null);
  const [blobUrls, setBlobUrls] = useState({}); // Almacena las URLs de los blobs
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [videoHover, setVideoHover] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Para manejar el estado de la animación

  let startY = 0;

  const handleProgress = (e) => {
    const { duration, currentTime } = e.target;
    setProgress((currentTime / duration) * 100);
  };
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      

      if (player) {
        player.pause();
        URL.revokeObjectURL(player.src); // Limpiar el Blob
        player.src = "";
        
      }
    };
  }, []);

  const handlePlay = () => {
    if (playing) {
      
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleVideoPlay = () => {
    setTimeout(() => {
      setVideoPlaying(true);
    }, 100);
  };

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

  // Función actualizada para manejar el cambio de clip
  const handleClipChange = useCallback(
    (direction) => {
      setIsAnimating(true); // Iniciar la animación
      setTransitionDirection(direction); // Establecer la dirección de la animación

      // Encontrar el índice actual del clip visualizado
      const currentIndex = clips.findIndex((clip) => clip.id === viewedClip);

      // Retrasar el cambio de clip para que la animación se vea
      setTimeout(() => {
        let newIndex = currentIndex;

        // Calcular el nuevo índice basándose en la dirección del cambio
        if (direction === "up" && currentIndex < clips.length - 1) {
          newIndex = currentIndex + 1;
        } else if (direction === "down" && currentIndex > 0) {
          newIndex = currentIndex - 1;
        }

        // Cambiar el clip visualizado solo si el nuevo índice es válido
        if (newIndex >= 0 && newIndex < clips.length) {
          setViewedClip(clips[newIndex].id); // Cambiar el clip actual

          // Cargar más clips si estamos cerca del final
          if (newIndex === clips.length - 2) {
            loadMoreClips(clips[newIndex].id);
          }
        }

        setIsAnimating(false); // Terminar la animación
      }, 300); // Este tiempo debe coincidir con la duración de la transición CSS

      // Restablecer la dirección de la transición después de la animación
      setTimeout(() => {
        setTransitionDirection(null);
      }, 400);
    },
    [clips, viewedClip, loadMoreClips]
  );

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
        handleClipChange("up");
      } else if (e.deltaY < 0) {
        handleClipChange("down");
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        handleClipChange("up");
      } else if (e.key === "ArrowUp") {
        handleClipChange("down");
      }
    };

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const endY = e.touches[0].clientY;
      const deltaY = startY - endY;

      if (deltaY > 50) {
        handleClipChange("up");
      } else if (deltaY < -50) {
        handleClipChange("down");
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
  }, [handleClipChange]);

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
    if (!viewedClip || clips.length === 0) return <Loading />;

    const clipIndex = clips.findIndex((clip) => clip.id === viewedClip);

    // Si no se encuentra el clip, no se renderiza nada y se elimina el blob si existe
    if (clipIndex === -1) {
      revokeBlobUrl(viewedClip);
      return null;
    }

    const clipsToRender = clips.slice(
      Math.max(clipIndex - 1, 0),
      Math.min(clipIndex + 3, clips.length)
    );

    return clipsToRender.map((clip) => (
      <div
        key={clip.id}
        className={`clip-wrapper ${clip.id === viewedClip ? "active" : ""} ${
          transitionDirection || ""
        } ${isAnimating ? "animating" : ""}`}
        id={clip.id}
      >
        <Box className="video-video-container">
          {/* Video */}
          <Box className="video-wrapper">
            <div className="conetent-player-clip">
              {!videoPlaying ? (
                <div className="video-placeholder-loading">
                  <img src={clip.streamThumbnail} alt="" />
                </div>
              ) : null}

              <video
                crossOrigin="anonymous"
                onTimeUpdate={handleProgress}
                onClick={handlePlay}
                ref={playerRef}
                loop={true}
                autoPlay={true}
                muted={muted}
                playsInline
                src={clip.url}
                onPlay={handleVideoPlay} // Llama al handler cuando el video comienza a reproducirse
                onLoadStart={() => setLoading(true)}
              />
              {playing === false && (
                <div className="clipcard-muted">
                  <i
                    onClick={handlePlay}
                    style={{
                      cursor: "pointer",
                      fontSize: "44px",
                      color: "lightgray",
                    }}
                    className="fas fa-play button-more-player"
                  />
                </div>
              )}
            </div>
          </Box>

          {/* Usuario e información */}
          <Box className="video-info">
            <Box className="text-info">
              <Grid
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" component="h3">
                  {clip.NameUser} ●
                </Typography>
                <Typography variant="h6" style={{ color: "grey" }}>
                  Clipeado por {clip.nameUserCreator}
                </Typography>
              </Grid>
              <Typography variant="h6">{clip.clipTitle}</Typography>
            </Box>
          </Box>

          {/* Iconos de interacción */}
          <Box className="video-actions">
            <Avatar
              className="profile-pic"
              src={clip.Avatar}
              alt="user-profile"
              sx={{ width: 56, height: 56 }}
            />
            <IconButton className="action-icon">
              <FaHeart size={40} />
              <Typography variant="body2">{clip.likeCount}</Typography>
            </IconButton>
            <IconButton className="action-icon">
              <FaComment size={40} />
              <Typography variant="body1">{clip.CommentsCount}</Typography>
            </IconButton>
            <IconButton className="action-icon">
              <FaShare size={40} />
              <Typography variant="body2">Compartir</Typography>
            </IconButton>
          </Box>
        </Box>
      </div>
    ));
  }, [clips, viewedClip, transitionDirection, isAnimating, videoPlaying]);

  return <>{memoizedClips}</>;
};

export default ClipsMobile;
