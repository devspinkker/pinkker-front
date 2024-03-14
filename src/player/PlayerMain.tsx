import React, { useEffect,useRef,useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';

interface ReactFlvPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height:string;
  width:string
}

function ReactFlvPlayer({ src, videoRef,height,width }: ReactFlvPlayerProps) {
  const [usedHLS, setUsedHLS] = useState(false);

  const hlsRef = useRef<Hls | null>(null);
  useEffect(() => {
    let flvPlayer: flvjs.Player | null = null;
    let hls: Hls | null = null;

    async function initializePlayer() {
      try {
        if (flvjs.isSupported() ) { 
                  flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: src+".flv",
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
        } else if(Hls.isSupported() ){
                    hls = new Hls();
                    hlsRef.current = hls;
            
                    if (videoRef.current) {
                      hls.loadSource(src + "/index.m3u8");
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
            
                          videoRef.current.muted = false;
                        }
                      });
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
