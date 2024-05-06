import React, { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css"
import { AdsAddStreamSummary } from '../services/backGo/streams';
interface ReactVideoPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  quality:string;
  stream:string;
  streamerDataID:string;
}

function ReactVideoPlayer({ src, videoRef, height, width, quality,stream,streamerDataID}: ReactVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [Commercial, setCommercial] = useState(null);
  const commercialRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);



  const handleCommercialEnded = async () => {
    setCommercial(null);
    let token = window.localStorage.getItem("token");
     await AdsAddStreamSummary(token, streamerDataID)

  };
  useEffect(() => {
    const REACT_APP_BACKCOMMERCIALWS = process.env.REACT_APP_BACKCOMMERCIALWS;
    
    const newSocket = new WebSocket(
      `wss://www.pinkker.tv/8084/ws/commercialInStream/${stream}`
    );

    const connectWebSocket = () => {
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      newSocket.onmessage = (event) => {
        try {

          const receivedMessage = JSON.parse(event.data);
          if (receivedMessage && receivedMessage.Commercial) {
            setCommercial(receivedMessage.Commercial);
            if (commercialRef.current) {
              commercialRef.current.src = receivedMessage.Commercial;
              commercialRef.current.play();
              commercialRef.current.muted = false;
              
            }
          }
        } catch (error) {
          console.error("Error al analizar el mensaje JSON:", error);
        }
      };

      newSocket.onopen = () => {};
      setSocket(newSocket);

      window.addEventListener("beforeunload", () => {
        newSocket.send("closing");
        newSocket.close();
      });
    };   
     if (!socket || socket.readyState !== WebSocket.OPEN) {
      connectWebSocket();
    }
    return () => {
      window.addEventListener("beforeunload", () => {
        newSocket.send("closing");
        newSocket.close();
      });
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [stream]);

  useEffect(() => {
    const pingInterval = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    };
  
    pingInterval(); // Invocar la función aquí para que se ejecute inmediatamente
    const intervalId = setInterval(pingInterval, 3000);
    if (pingIntervalRef.current) {
      pingIntervalRef.current = intervalId;
    }
  
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [socket]);
  
  

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
      {Commercial && (
        <video
          style={{
            width: width,
            height: height,
          }}
          id='commercial-player'
          muted={true}
          controls={false}
          playsInline
          ref={commercialRef}
          onEnded={handleCommercialEnded}
        />
      )}
      <video
        style={{
          width: width,
          height: height,
          display: Commercial ? "none":""
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
