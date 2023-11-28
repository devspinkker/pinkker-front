import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Alert } from '@mui/material';

interface ReactHlsPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

function ReactHlsPlayer({ src, autoPlay = false, muted = false, videoRef }: ReactHlsPlayerProps) {
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

            if (autoPlay && videoRef.current) {
              // Iniciar reproducción en respuesta a un evento de usuario (clic)
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch((error) => {
                  console.error('Error during video playback:', error);
                });
              }
            }

            if (videoRef.current) {
              videoRef.current.muted = muted ?? false;
            }
          });
        }
      } else {
        alert('Tu navegador no es compatible con Hls.js. Se usará el reproductor de video estándar.');
      }
      if (!usedHLS && videoRef.current) {

        videoRef.current.src = src;
        videoRef.current.load();

        if (autoPlay) {
          // Iniciar reproducción en respuesta a un evento de usuario (clic)
          document.addEventListener('click', () => {
            const playPromise = videoRef.current?.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
              });
            }
          });
        }
        if (videoRef.current) {
          videoRef.current.muted = muted ?? false;
        }
      }
    }

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay, muted, videoRef, usedHLS]);

  return <video autoPlay={true} controls playsInline ref={videoRef} />;
}

export default ReactHlsPlayer;
