import React, { useEffect, useRef, useState } from 'react';
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
}

interface TSFilePath {
  url: string;
  start: number;
  end: number;
}

function VideoPlayerCreateClips({ src, videoRef, height, width, onVideoURLsReady, isMuted, volume }: ReactVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    let hls: Hls | null = null;

    const initializePlayer = async () => {
      try {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        hls = new Hls();
        hlsRef.current = hls;

        if (videoRef.current) {
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);

      

          // hls.on(Hls.Events.MANIFEST_PARSED, () => {
          //   videoRef.current?.play();
          // });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
          });
        }
      } catch (error) {
        console.error('Error initializing video player:', error);
      }
    };

    initializePlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  const fetchM3U8AndExtractTSUrls = async () => {
    try {
      const response = await fetch(src);
      const playlistText = await response.text();

      const tsFilePaths: TSFilePath[] = [];
      let accumulatedTime = 0;

      playlistText.split("\n").forEach((line, index, arr) => {
        if (line && line.startsWith("#EXTINF:")) {
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
    <div style={{ height:"74%" }}>
      <video style={{ height, width }} ref={videoRef} controls />
    </div>
  );
}

export default VideoPlayerCreateClips;