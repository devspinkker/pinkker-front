import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface ReactHlsPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

function ReactHlsPlayer({ src, autoPlay = false, muted = false, videoRef }: ReactHlsPlayerProps) {
  const hlsRef = useRef<Hls | null>(null);

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
            
            if (autoPlay) {
              videoRef.current?.play().catch((error) => {
                console.error('Error during video playback:', error);
              });
            }
 
            if (videoRef.current) {
              videoRef.current.muted = muted ?? false;
            }
          });
        }
      } else if (videoRef.current) {
        // Fallback to standard video tag if Hls is not supported
        alert('Tu navegador no es compatible con Hls.js. Se usará el reproductor de video estándar.');
        videoRef.current.src = src;
        videoRef.current.load();

        if (autoPlay) {
          videoRef.current.play().catch((error) => {
            console.error('Error during video playback:', error);
          });
        }

        videoRef.current.muted = muted ?? false;
      }
    }

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay, muted, videoRef]);

  return <video autoPlay={true} playsInline ref={videoRef} />;
}

export default ReactHlsPlayer;
