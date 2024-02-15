import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Alert } from '@mui/material';

interface ReactHlsPlayerProps {
  src: string;
  muted?: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

function ReactHlsPlayer({ src, muted = false, videoRef }: ReactHlsPlayerProps) {
  const hlsRef = useRef<Hls | null>(null);
  const [usedHLS, setUsedHLS] = useState(false);

  useEffect(() => {
    let hls: Hls | null = null;

    async function initPlayer() {
      if (Hls.isSupported()) {
        hls = new Hls();
        hlsRef.current = hls;

        if (videoRef.current) {
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setUsedHLS(true);

            if (videoRef.current) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch((error) => {
                  console.error('Error during video playback:', error);
                });
              }
              videoRef.current.muted = muted ?? false;
            }
          });
        }
      } else {
        if (videoRef.current) {
          videoRef.current.src = src
          videoRef.current.load();
          videoRef.current.play();
        }
      }
    }

    initPlayer();
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, muted, videoRef, usedHLS]);

  return <video id='pinkker-player' controls playsInline ref={videoRef} />;
}

export default ReactHlsPlayer;
