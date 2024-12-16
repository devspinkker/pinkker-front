import React, { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css";

interface ReactVideoPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  quality: string;
}

function FloatingPlayerReproduccion({ src, videoRef, height, width }: ReactVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const hlsRef = useRef<Hls | null>(null);
  let token = window.localStorage.getItem("token");
  useEffect(() => {
    let flvPlayer: flvjs.Player | null = null;
    let hls: Hls | null = null;

    async function initializePlayer() {
      try {
        // Limpia las instancias anteriores del player
        if (flvPlayer) {
          flvPlayer.pause();
          flvPlayer.unload();
          flvPlayer.detachMediaElement();
          flvPlayer.destroy();
          flvPlayer = null;
        }

        if (hls) {
          hls.destroy();
          hls = null;
        }

        // Soporte para FLV
        if (flvjs.isSupported()) {
          flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: src + `.flv?token=${token}`,
          });

          if (videoRef.current) {
            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.load();
            videoRef.current.addEventListener('loadedmetadata', async () => {
              try {
                await flvPlayer?.play();
                setIsPlaying(true);
              } catch (error) {
                console.error('Error playing video:', error);
              }
            });
          }
        } else {
          // Soporte para HLS
          hls = new Hls();
          hlsRef.current = hls;

          if (videoRef.current) {
            hls.loadSource(src + `/index.m3u8?token=${token}`);
            hls.attachMedia(videoRef.current);
            videoRef.current.addEventListener('click', () => {
              if (!isPlaying) {
                videoRef.current?.play();
                setIsPlaying(true);
              }
            });
            videoRef.current?.play();
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log('Manifest parsed');
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
              console.error('HLS Error:', data);
            });
          }
        }
      } catch (error) {
        console.error('Error initializing video player:', error);
      }
    }

    initializePlayer();
    const timeoutId = setTimeout(() => {
      if (!videoRef.current?.readyState || videoRef.current.readyState < 3) {
        initializePlayer();
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      if (hls) {
        hls.destroy();
        hls = null;
      }
      if (flvPlayer) {
        flvPlayer.pause();
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
        flvPlayer = null;
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      style={{ width, height }}
      controls
      muted={false}
      id='Player-Floating'
    />
  );
}

export default FloatingPlayerReproduccion;
