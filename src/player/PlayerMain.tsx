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
    console.log(src);
    
    let hls: Hls | null = null;

    function initPlayer() {
      if (hls !== null) {
        hls.destroy();
      }

      const newHls = new Hls({
        enableWorker: false,
      });

      if (videoRef.current !== null) {
        newHls.attachMedia(videoRef.current);
      }

      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(src);

        newHls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            videoRef.current?.play().catch(() => {
              console.error('Unable to autoplay prior to user interaction with the dom.');
            });
          }

          if (videoRef.current !== null) {
            videoRef.current.muted = muted ?? false;
          }
        });
      });

      newHls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              newHls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError();
              break;
            default:
              initPlayer();
              break;
          }
        }
      });

      hls = newHls;
      hlsRef.current = newHls;
    }

    if (Hls.isSupported()) {
      initPlayer();
    }

    return () => {
      if (hls !== null) {
        hls.destroy();
      }
    };
  }, [src, autoPlay, muted]);

  return <video autoPlay={true} playsInline ref={videoRef} />;
  // ref={playerRef} src={src} autoPlay={autoPlay} {...props} webkit-playsinline playsInline
}

export default ReactHlsPlayer;
