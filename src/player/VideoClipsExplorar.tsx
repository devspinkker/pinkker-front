import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css";

interface ReactVideoPlayerProps {
  src: string;
  streamThumbnail: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  onVideoURLsReady: (urls: { url: string, start: number, end: number }[]) => void;
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
    const initializePlayer = async () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          capLevelToPlayerSize: true, // Ajusta al tamaño del reproductor
        });
        hlsRef.current = hls;

        if (videoRef.current) {
          hls.loadSource(src.replace(".mp4", ".m3u8"));
          hls.attachMedia(videoRef.current);

          // Configura el nivel preferido tras cargar el manifiesto
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            const levelIndex = hls.levels.findIndex(level => level.height === preferredQuality);
            if (levelIndex >= 0) {
              hls.currentLevel = levelIndex; // Cambia al nivel de 720p (u otro especificado)
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
          });
        }
      } else if (videoRef.current && videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = src.replace(".mp4", ".m3u8");
      }
    };

    initializePlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src, videoRef, preferredQuality]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume, videoRef]);

  return (
    <div style={{ height: "100%" }}>
      <video
        style={{ height, width }}
        ref={videoRef}
        controls
        onTimeUpdate={onTimeUpdate}
        onClick={onClick}
        onPlay={onPlay}
        loop
        autoPlay
        playsInline
        poster={streamThumbnail}
      />
    </div>
  );
}

export default VideoClipsExplorar;
