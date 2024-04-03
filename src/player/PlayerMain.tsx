import React, { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';

interface ReactFlvPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
}

function ReactFlvPlayer({ src, videoRef, height, width }: ReactFlvPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    let flvPlayer: flvjs.Player | null = null;
    let hls: Hls | null = null;

    async function initializePlayer() {
      try {
        console.log(isMobile());

        if (flvjs.isSupported()) {
          flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: src + ".flv",
          });

          if (videoRef.current) {
            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.load();

            videoRef.current.addEventListener('loadedmetadata', () => {
              if (videoRef.current && flvPlayer) {
                videoRef.current.play().catch((error) => {
                  console.error('Error playing video:', error);
                });
              }
            });
          }
        } else {
          const mobileInformation = isMobile().toLowerCase();
          
          if (mobileInformation.includes("iphone") || mobileInformation.includes("ipad")) {
            videoRef.current!.src = src + "/index.m3u8";
            videoRef.current!.play().catch(error => {
              console.error('Error playing video:', error);
            });
          } else {
            hls = new Hls();
            hlsRef.current = hls;

            if (videoRef.current) {
              hls.loadSource(src + "/index.m3u8");
              hls.attachMedia(videoRef.current);

              videoRef.current.addEventListener('click', () => {
                if (!isPlaying) {
                  videoRef.current?.play();
                  setIsPlaying(true);
                }
              });

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('Manifest parsed');
              });

              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
              });
            }
          }
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

  function isMobile() {
    var check = false;
    (function (a) {
      if (/android|bb\d+|meego|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || "");
    return navigator.userAgent;
  }
  
  function isMobileHight() {
    // Función para determinar si el dispositivo es móvil
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  return <video   
    style={{
      width: width,
      height:isMobileHight() ? height :""
    }}
    id='pinkker-player' 
    muted ={false}
    controls={false} 
    playsInline 
    ref={videoRef} 
  />;
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
