import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import "./ReactVideoPlayer.css";

interface ReactVideoPlayerProps {
  src: string;
  streamThumbnail: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  onVideoURLsReady: (urls: { url: string; start: number; end: number }[]) => void;
  isMuted: boolean;
  volume: number;
  preferredQuality: number; // Índice del nivel deseado, por ejemplo, 720p
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onClick?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onPlay?: () => void;
}

function VideoClipsExplorar({
  streamThumbnail,
  src,
  videoRef,
  height,
  width,
  onVideoURLsReady,
  isMuted,
  volume,
  preferredQuality,
  onTimeUpdate,
  onClick,
  onPlay,
}: ReactVideoPlayerProps) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        maxBufferLength: 10, // Tiempo máximo de buffer en segundos
        maxMaxBufferLength: 30, // Máximo absoluto del buffer
        maxBufferSize: 60 * 1024 * 1024, // Límite del buffer en bytes (60MB)
        maxBufferHole: 0.5, // Permite un pequeño agujero de 0.5s entre segmentos
        liveSyncDuration: 3, // Retraso para sincronización en vivo
        liveMaxLatencyDuration: 5, // Máximo retraso aceptable en vivo
        liveBackBufferLength: 0,
      });


      hlsRef.current = hls;
      console.log(src);

      hls.loadSource(src?.replace(".mp4", ".m3u8"));
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const preferredLevel = hls.levels.findIndex(
          (level) => level.height === preferredQuality
        );
        if (preferredLevel >= 0) {
          hls.currentLevel = preferredLevel;
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            console.error("HLS Network Error:", data);
            hls.startLoad(); // Reintentar cargar fuente
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            console.error("HLS Media Error:", data);
            hls.recoverMediaError(); // Intentar recuperación de errores
          } else {
            console.error("Fatal HLS Error:", data);
            hls.destroy(); // Destruir la instancia en caso de error fatal
          }
        }
      });
    } else if (videoRef.current) {
      // Fallback para navegadores que no soportan HLS.js
      videoRef.current.src = src.replace(".mp4", ".m3u8");
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, videoRef, preferredQuality]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  return (
    <div style={{ height: "100%" }}>
      <video
        style={{ height, width }}
        ref={videoRef}
        
        onTimeUpdate={onTimeUpdate}
        onClick={onClick}
        onPlay={onPlay}
        loop
        autoPlay
        playsInline
        webkit-playsinline="true"
        disablePictureInPicture
        poster={streamThumbnail}
      />
    </div>
  );
}

export default VideoClipsExplorar;
