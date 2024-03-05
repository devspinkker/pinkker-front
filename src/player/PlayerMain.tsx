import React, { useEffect } from 'react';
import flvjs from 'flv.js';

interface ReactFlvPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height:string;
  width:string
}

function ReactFlvPlayer({ src, videoRef,height,width }: ReactFlvPlayerProps) {
  useEffect(() => {
    let flvPlayer: flvjs.Player | null = null;

    async function initializePlayer() {
      try {
        if (!flvjs.isSupported()) {
          throw new Error('FLV playback is not supported.');
        }

        flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: src,
        });

        if (videoRef.current) {
          flvPlayer.attachMediaElement(videoRef.current);
          flvPlayer.load();

          // Iniciar la reproducción cuando el metadato del video esté cargado
          videoRef.current.addEventListener('loadedmetadata', () => {
            if (videoRef.current && flvPlayer) {
              videoRef.current.play().catch((error) => {
                console.error('Error playing video:', error);
              });
            }
          });
        }
      } catch (error) {
        console.error('Error initializing FLV player:', error);
      }
    }

    initializePlayer();

    return () => {
      if (flvPlayer) {
        flvPlayer.destroy();
      }
    };
  }, [src, videoRef]);

  return <video 
  style={{
    width:width,
    // height:height
  }}
  id='pinkker-player' controls playsInline ref={videoRef} />;
}

export default ReactFlvPlayer;


// import React, { useEffect, useRef, useState } from 'react';
// import Hls from 'hls.js';
// import { Alert } from '@mui/material';

// interface ReactHlsPlayerProps {
//   src: string;
//   muted?: boolean;
//   videoRef: React.RefObject<HTMLVideoElement>;
// }

// function ReactHlsPlayer({ src, muted = false, videoRef }: ReactHlsPlayerProps) {
//   const hlsRef = useRef<Hls | null>(null);
//   const [usedHLS, setUsedHLS] = useState(false);

//   useEffect(() => {
    
//     let hls: Hls | null = null;

//     async function initPlayer() {
//       if (Hls.isSupported()) {
//         hls = new Hls();
//         hlsRef.current = hls;

//         if (videoRef.current) {
//           hls.loadSource(src);
//           hls.attachMedia(videoRef.current);

//           hls.on(Hls.Events.MANIFEST_PARSED, () => {
//             setUsedHLS(true);

//             if (videoRef.current) {
//               const playPromise = videoRef.current.play();
//               if (playPromise !== undefined) {
//                 playPromise.catch((error) => {
//                   console.error('Error during video playback:', error);
//                 });
//               }

//               videoRef.current.muted = muted ?? false;
//             }
//           });
//         }
//       } else {
//         if (videoRef.current) {
//           videoRef.current.src = src
//           videoRef.current.load();
//           videoRef.current.play();

//         }
//       }
//     }

//     initPlayer();
//     return () => {
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, [src, muted, videoRef, usedHLS]);

//   return <video id='pinkker-player' controls playsInline ref={videoRef} />;
// }

// export default ReactHlsPlayer;
