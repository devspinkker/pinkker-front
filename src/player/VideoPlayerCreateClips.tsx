import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css";

interface ReactVideoPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  onVideoURLsReady: (urls: string[]) => void;
  isMuted: boolean;
  volume: number;
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

          videoRef.current.addEventListener('click', () => {
            if (!isPlaying) {
              videoRef.current?.play();
              setIsPlaying(true);
            }
          });

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play();
          });

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

      const tsFilePaths = playlistText
        .split("\n")
        .filter(line => line && !line.startsWith("#") && line.endsWith(".ts"))
        .map(line => new URL(line, src).toString());

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
    <div style={{ height, width }}>
      <video ref={videoRef} controls />
    </div>
  );
}

export default VideoPlayerCreateClips;
