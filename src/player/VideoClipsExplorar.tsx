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
  m3u8Content: string;
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
  m3u8Content,
}: ReactVideoPlayerProps) {
  const hlsRef = useRef<Hls | null>(null);
  const m3u8UrlRef = useRef<string | null>(null);

  useEffect(() => {
    let videoSource = src;
    const isM3U8 = src.endsWith(".m3u8");
    const isMP4 = src.endsWith(".mp4");

    // Si `m3u8Content` tiene contenido y `src` NO es un .m3u8, generar un Blob URL
    if (!isM3U8 && m3u8Content.trim().length > 0) {
      const blob = new Blob([m3u8Content], { type: "application/x-mpegURL" });
      m3u8UrlRef.current = URL.createObjectURL(blob);
      videoSource = m3u8UrlRef.current;
    }

    if ((isM3U8 || m3u8UrlRef.current) && Hls.isSupported() && videoRef.current) {
      const hls = new Hls({
        maxBufferLength: 10,
        maxMaxBufferLength: 30,
        maxBufferSize: 60 * 1024 * 1024,
        maxBufferHole: 0.5,
        liveSyncDuration: 3,
        liveMaxLatencyDuration: 5,
        liveBackBufferLength: 0,
      });

      hlsRef.current = hls;
      hls.loadSource(videoSource);
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
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            console.error("HLS Media Error:", data);
            hls.recoverMediaError();
          } else {
            console.error("Fatal HLS Error:", data);
            hls.destroy();
          }
        }
      });
    } else if (isMP4 && videoRef.current) {
      videoRef.current.src = videoSource;
      videoRef.current.load();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
      }
      if (m3u8UrlRef.current) {
        URL.revokeObjectURL(m3u8UrlRef.current);
        m3u8UrlRef.current = null;
      }
    };
  }, [src, m3u8Content, videoRef, preferredQuality]);

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
