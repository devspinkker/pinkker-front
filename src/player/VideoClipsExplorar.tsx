import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css";

interface ReactVideoPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  onVideoURLsReady: (urls: { url: string, start: number, end: number }[]) => void;
  isMuted: boolean;
  volume: number;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onClick?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onPlay?: () => void;
}

interface TSFilePath {
  url: string;
  start: number;
  end: number;
}

function VideoClipsExplorar({
  src,
  videoRef,
  height,
  width,
  onVideoURLsReady,
  isMuted,
  volume,
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
        const hls = new Hls();
        hlsRef.current = hls;

        if (videoRef.current) {
          hls.loadSource(src.replace(".mp4", ".m3u8")); // Cambia a m3u8
          hls.attachMedia(videoRef.current);

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
  }, [src, videoRef]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume, videoRef]);

  const fetchM3U8AndExtractTSUrls = async () => {
    try {
      const response = await fetch(src.replace(".mp4", ".m3u8"));
      const playlistText = await response.text();

      const tsFilePaths: TSFilePath[] = [];
      let accumulatedTime = 0;

      playlistText.split("\n").forEach((line, index, arr) => {
        if (line.startsWith("#EXTINF:")) {
          const duration = parseFloat(line.split(":")[1]);
          const tsFile = arr[index + 1];
          if (tsFile && tsFile.endsWith(".ts")) {
            const startTime = accumulatedTime;
            const endTime = accumulatedTime + duration;
            tsFilePaths.push({ url: new URL(tsFile, src).toString(), start: startTime, end: endTime });
            accumulatedTime = endTime;
          }
        }
      });

      if (tsFilePaths.length > 0) {
        onVideoURLsReady(tsFilePaths);
      }
    } catch (error) {
      console.error("Error fetching M3U8 playlist:", error);
    }
  };

  useEffect(() => {
    fetchM3U8AndExtractTSUrls();
  }, [src]);

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
      />
    </div>
  );
}

export default VideoClipsExplorar;