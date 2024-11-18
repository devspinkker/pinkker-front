import React, { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css";
import { AdsAddStreamSummary } from '../services/backGo/streams';
import { useHistory } from "react-router-dom";

interface ReactVideoPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  quality: string;
  stream: string;
  streamerDataID: string;  
  stream_thumbnail: string;
}

function ReactVideoPlayer({ src, videoRef, height, width, quality, stream, streamerDataID, stream_thumbnail }: ReactVideoPlayerProps) {
  const history = useHistory();
  const [isPlaying, setIsPlaying] = useState(false);
  const [Commercial, setCommercial] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(true);
  const [Player, setPlayer] = useState(true);
  const [countdown, setCountdown] = useState(3); // Estado para la cuenta regresiva
  const commercialRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false); // Estado para fullScreen
  const playerRef = useRef();
  const canvasRef = useRef(null);
  const [videoHover, setVideoHover] = useState(false);

  const handleCommercialEnded = async () => {
    let token = window.localStorage.getItem("token");
    await AdsAddStreamSummary(token, streamerDataID, Commercial._id);
    setCommercial(null);
  };

  const playCommercial = () => {
    if (commercialRef.current) {
      commercialRef.current.src = Commercial.UrlVideo;
      commercialRef.current.muted = false;
      commercialRef.current.play().catch(error => {
        console.error('Error playing commercial:', error);
      });
    }
  };

  useEffect(() => {
    if (Commercial) {
      playCommercial();
      setCountdown(3); // Reiniciar la cuenta regresiva cuando empieza el comercial
    }
  }, [Commercial]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const initializeWebSocket = () => {
    const newSocket = new WebSocket(`wss://www.pinkker.tv/8084/ws/commercialInStream/${stream}`);

    newSocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    newSocket.onmessage = (event) => {
      try {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage && receivedMessage.UrlVideo) {
          setCommercial(receivedMessage);
          setShowWarning(false);
        }
      } catch (error) {
        console.error("Error parsing JSON message:", error);
      }
    };

    newSocket.onclose = () => {
      console.warn("WebSocket closed. Attempting to reconnect...");
      if (reconnectIntervalRef.current) {
        clearTimeout(reconnectIntervalRef.current);
      }
      reconnectIntervalRef.current = setTimeout(() => {
        initializeWebSocket();
      }, 5000);
    };

    newSocket.onopen = () => {
      console.log("WebSocket connected.");
    };

    setSocket(newSocket);
  };

  useEffect(() => {
    initializeWebSocket();

    window.addEventListener("beforeunload", () => {
      if (socket) {
        socket.send("close");
        socket.close();
      }
    });

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      if (reconnectIntervalRef.current) {
        clearTimeout(reconnectIntervalRef.current);
      }
    };
  }, [stream]);

  useEffect(() => {
    const pingInterval = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    };

    pingInterval();
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
    var srcQ = "";
    const qualities = ["720", "480", "360"];
    let currentQualityIndex = 0;
  
    if (quality === "auto") {
      srcQ = `${src}`; // URL base sin sufijo
    } else if (quality === "1080") {
      srcQ = `${src}`;
    } else {
      srcQ = `${src}_${quality}`;
    }
  
    let flvPlayer: flvjs.Player | null = null;
    let hls: Hls | null = null;
  
    async function initializePlayer() {
      try {
        // Limpieza de instancias anteriores
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
          let finalSrc = srcQ;
  
          if (quality === "auto" && currentQualityIndex > 0) {
            finalSrc = `${src}_${qualities[currentQualityIndex]}`;
          }
          flvPlayer = flvjs.createPlayer({
            type: "flv",
            url: `${finalSrc}.flv`,
            isLive: true,
          });
          
  
          if (videoRef.current) {
            flvPlayer.attachMediaElement(videoRef.current);
            flvPlayer.load();
  
            videoRef.current.addEventListener("loadedmetadata", async () => {
              try {
                await flvPlayer?.play();
                setIsPlaying(true);
              } catch (error) {
                console.error("Error playing video:", error);
              }
            });
  
            // Manejo de problemas de reproducción
            videoRef.current.addEventListener("stalled", handlePlaybackIssue);
            videoRef.current.addEventListener("error", handlePlaybackIssue);
          }
        } else {
          // Configuración para HLS
          const mobileInformation = isMobile().toLowerCase();
          if (mobileInformation.includes("iphone") || mobileInformation.includes("ipad")) {
            videoRef.current!.src = `${srcQ}/index.m3u8`;
            videoRef.current!.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          } else {
            hls = new Hls({ startLevel: -1 });
            hlsRef.current = hls;
  
            if (videoRef.current) {
              hls.loadSource(`${srcQ}/index.m3u8`);
              hls.attachMedia(videoRef.current);
              videoRef.current.addEventListener("click", () => {
                if (!isPlaying) {
                  videoRef.current?.play();
                  setIsPlaying(true);
                }
              });
              videoRef.current?.play();
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("Manifest parsed");
              });
              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS Error:", data);
              });
            }
          }
        }
      } catch (error) {
        console.error("Error initializing video player:", error);
      }
    }
  
    function handlePlaybackIssue() {
      console.log("what");
      

      if (quality === "auto" && currentQualityIndex < qualities.length) {
      console.log("what 22");
 
        console.warn(`Playback issue detected, lowering quality to ${qualities[currentQualityIndex]}`);
        currentQualityIndex++;
        initializePlayer(); // Reinicializa con la nueva calidad
      } else {
        console.error("Playback issue could not be resolved");
      }
    }
  
    // Inicialización del reproductor
    initializePlayer();
  
    const timeoutId = setTimeout(() => {
      if (!videoRef.current?.readyState || videoRef.current.readyState < 3) {
        initializePlayer();
      }
    }, 5000);
  
    // Cleanup
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
      if (videoRef.current) {
        videoRef.current.removeEventListener("stalled", handlePlaybackIssue);
        videoRef.current.removeEventListener("error", handlePlaybackIssue);
      }
    };
  }, [src, quality]);
  

  function isMobile() {
    var check = false;
    (function (a) {
      if (/android|bb\d+|meego|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)) {
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

  const handleStartWatchingClick = () => {
    setShowWarning(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      setPlayer(false);
      videoRef.current.play();
    }
  };

  const handleRedirectHome = () => {
    history.push("/");
  };
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFullScreen = !!(
        document.fullscreenElement 
     
      );
      setIsFullScreen(isFullScreen);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);
  return (
    <>
    {showWarning && (
  <div
    style={{
      backgroundImage: `url(${stream_thumbnail})`,
    }}
        className='thumbnail-prev-PlayerMain'
  >
    <div className="base-dialog-player">
      <button
         style={
          {
            background:"#000000"
          }
        }
        
       onClick={handleStartWatchingClick}>
        <div>
          <i
            style={
              {
                color:"#ffff"
              }
            }
          className='fas fa-play pinkker-button-more' ></i>
        </div>
      </button>
    </div>
  </div>
)}
 
          {Commercial && (
            <div style={{ textAlign: 'center' }}>
              <video
               id='commercial-player'
                ref={commercialRef}
                width={width}
                height={height}
                onEnded={handleCommercialEnded}
                controls={false}
                style={{ objectFit: 'contain' }}
              />
              {countdown > 0 ? (
                <div style={{
                  position: 'relative',
                  top: '-130px',
                  left: "17px",
                  zIndex:"10000",
                  padding: '5px 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  width: "100px", }}>
                  Cargando en {countdown}...
                </div>
              ) : (
                <button
                onClick={handleCommercialEnded}
                style={{
                  position: 'relative',
                  top: '-130px',
                  left: "17px",
                  padding: '5px 10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  zIndex:"10000"
                }}
                >
                  Cerrar anuncio
                </button>
              )}
            </div>
          ) }
      <video
        ref={videoRef}
        style={{ width, height, display: Commercial ||  Player ? "none" : "" }}
        height={HeightVideo()}
        width={width}
        controls
        muted={Player}
        className={`video-player  ${isFullScreen ? 'fullscreen' : ''}`}
      />
    </>
  );
}

export default ReactVideoPlayer;
