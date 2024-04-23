import React, { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css"

interface ReactVideoPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  quality:string;
}

function ReactVideoPlayer({ src, videoRef, height, width, quality }: ReactVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {

    let flvPlayer: flvjs.Player | null = null;
    let hls: Hls | null = null;

    async function initializePlayer() {

      try {
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
        if (flvjs.isSupported()) {
          flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: src + ".flv",
          });

          if (videoRef.current) {
            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.load();

            videoRef.current.addEventListener('loadedmetadata', async () => {
              try {
                await flvPlayer?.play();
                setIsPlaying(true);
              } catch (error) {
                console.error('Error reproduciendo el video:', error);
              }
            });
          }
        } else {
          const mobileInformation = isMobile().toLowerCase();

          if (mobileInformation.includes("iphone") || mobileInformation.includes("ipad")) {
            videoRef.current!.src = src + "/index.m3u8";
            videoRef.current!.play().catch(error => {
              console.error('Error reproduciendo el video:', error);
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
              videoRef.current?.play();

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('Manifesto analizado');
              });

              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('Error HLS:', data);
              });
            }
          }
        }
      } catch (error) {
        console.error('Error inicializando el reproductor de video:', error);
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

  function isMobile() {
    var check = false;
    (function (a) {
      if (/android|bb\d+|meego|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i) {
        check = true;
      }
    })(navigator.userAgent || navigator.vendor || "");
    return navigator.userAgent;
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !navigator.userAgent.includes("Macintosh");
  }

  function HeightVideo() {
    if (!isMobile()) {
      return height;
    } else {
      return "600px";
    }
  }

  // Función para desmutear el video
  const handleUnmuteClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      if (overlayRef.current) {
        overlayRef.current.style.display = 'none';
      }
    }
  };
  

  return (
    <>
      <div
        ref={overlayRef}
        className="overlay" 
        onClick={handleUnmuteClick} 
        style={{
          // width: width ,
          height: height
        }}
      >
        <span
          className="mute-icon" 
        >
          🔊 
        </span>
      </div>

      <video
        style={{
          width: width,
          height: height
        }}
        id='video-player'
        muted={true}
        controls={false}
        playsInline
        ref={videoRef}
      />
    </>
  );
}

export default ReactVideoPlayer;
