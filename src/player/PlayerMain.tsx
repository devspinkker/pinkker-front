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
  dashboard: boolean;
  onPauseDuration?: (duration: number) => void; // Nueva prop para enviar duración de pausas
  reset?: boolean; // Nueva prop para reiniciar el reproductor
}

function ReactVideoPlayer({ src, videoRef, height, width, quality, stream, streamerDataID, stream_thumbnail, dashboard, onPauseDuration, reset }: ReactVideoPlayerProps) {
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
  let token = window.localStorage.getItem("token");

  const [playLive, setPlayLive] = useState(1);
  const handleCommercialEnded = async () => {
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


    const qualities = ["720", "480", "360"];
    let currentQualityIndex = 0;
    let lastPlaybackTime = 0; // Última posición del video detectada
    let bufferingStartTime: number | null = null; // Momento en que comienza el buffering

    let flvPlayer: flvjs.Player | null = null;
    let hls: Hls | null = null;

    const cleanUpPlayer = () => {
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
    };

    const initializePlayer = async () => {
      try {
        cleanUpPlayer();

        const isAutoQuality = quality === "auto";
        const currentQuality = isAutoQuality ? qualities[currentQualityIndex] : quality;
        const srcQ = isAutoQuality
          ? `${src}_${currentQuality}`
          : `${src}${quality !== "1080" ? `_${quality}` : ""}`;

        if (flvjs.isSupported()) {
          flvPlayer = flvjs.createPlayer({
            type: "flv",
            url: `${srcQ}.flv?token=${token}`,
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
                console.error("Error al reproducir el video:", error);
              }
            });

            videoRef.current.addEventListener("stalled", handlePlaybackIssue);
            videoRef.current.addEventListener("error", handlePlaybackIssue);
          }
        } else {
          const mobileInformation = isMobile().toLowerCase();
          if (mobileInformation.includes("iphone") || mobileInformation.includes("ipad")) {
            videoRef.current!.src = `${srcQ}/index.m3u8?token=${token}`;
            videoRef.current!.play().catch((error) => {
              console.error("Error al reproducir video en iOS:", error);
            });
          } else {
            hls = new Hls({ startLevel: -1 });
            hlsRef.current = hls;

            if (videoRef.current) {
              hls.loadSource(`${srcQ}/index.m3u8?token=${token}`);
              hls.attachMedia(videoRef.current);

              videoRef.current.addEventListener("click", () => {
                if (!isPlaying) {
                  videoRef.current?.play();
                  setIsPlaying(true);
                }
              });

              hls.on(Hls.Events.MANIFEST_PARSED, () => {

              });

              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("Error de HLS:", data);
              });

              await videoRef.current?.play();
            }
          }
        }
      } catch (error) {
        console.error("Error inicializando el reproductor:", error);
      }
    };

    let lastQualityChangeTime = 0; // Controla el tiempo de cambio de calidad
    const handlePlaybackIssue = () => {
      if (quality === "auto") {
        const now = Date.now();
        // Cambiar la calidad solo si ha pasado un tiempo considerable
        if (now - lastQualityChangeTime >= 10000 && currentQualityIndex < qualities.length - 1) {
          currentQualityIndex++;
          console.warn(`Problema de reproducción detectado, cambiando a calidad ${qualities[currentQualityIndex]}`);
          lastQualityChangeTime = now;
          initializePlayer();
        }
      } else {
        console.error("No se pudo resolver el problema de reproducción");
      }
    };

    const monitorBuffering = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;

        if (currentTime === lastPlaybackTime && !videoRef.current.paused) {
          // Si no avanza el tiempo de reproducción
          if (!bufferingStartTime) {
            bufferingStartTime = Date.now();
          } else if (Date.now() - bufferingStartTime >= 3000) {
            // Si lleva más de 3 segundos detenido
            console.warn("Detección de buffering prolongado, intentando resolver...");
            handlePlaybackIssue();
            bufferingStartTime = null; // Reinicia el monitoreo de buffering
          }
        } else {
          // El video está avanzando normalmente
          bufferingStartTime = null;
        }

        lastPlaybackTime = currentTime; // Actualiza la última posición
      }
    };

    initializePlayer();

    const bufferCheckInterval = setInterval(monitorBuffering, 3000);

    return () => {
      clearInterval(bufferCheckInterval);
      cleanUpPlayer();
      if (videoRef.current) {
        videoRef.current.removeEventListener("stalled", handlePlaybackIssue);
        videoRef.current.removeEventListener("error", handlePlaybackIssue);
      }
    };
  }, [src, quality, reset]);


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

  const pauseStartRef = useRef<number | null>(null); // Registro del inicio de la pausa

  useEffect(() => {
    if (videoRef.current) {
      // Detectar pausa
      const handlePause = () => {
        pauseStartRef.current = Date.now(); // Registrar momento de pausa
      };

      // Detectar reanudación y calcular duración
      const handlePlay = () => {
        if (pauseStartRef.current) {
          const duration = (Date.now() - pauseStartRef.current) / 1000; // Calcular en segundos
          pauseStartRef.current = null;
          if (onPauseDuration) {
            onPauseDuration(duration); // Enviar al padre
          }
        }
      };

      videoRef.current.addEventListener('pause', handlePause);
      videoRef.current.addEventListener('play', handlePlay);

      return () => {
        videoRef.current?.removeEventListener('pause', handlePause);
        videoRef.current?.removeEventListener('play', handlePlay);
      };
    }
  }, [videoRef, onPauseDuration]);

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


  useEffect(() => {
    if (showWarning) {
      const timeout = setTimeout(() => {
        setShowWarning(false);

        // Reproducir de forma silente primero
        if (videoRef.current) {
          videoRef.current.muted = false;
          setPlayer(false);
          videoRef.current.play().catch((error) => {
            console.error('Error al iniciar la reproducción automáticamente:', error);
            setShowWarning(true)
            setPlayer(true);

          });
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [showWarning]);

  return (
    <>
      {showWarning && (
        <div
          style={{
            backgroundImage: `url(${stream_thumbnail})`,
            height: dashboard ? '30vh' : '',
          }}
          className='thumbnail-prev-PlayerMain'

        >
          <div className="base-dialog-player">
            <button
              style={
                {
                  background: "#000000"
                }
              }

              onClick={handleStartWatchingClick}>
              <div>
                <i
                  style={
                    {
                      color: "#ffff"
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
              zIndex: "10000",
              padding: '5px 10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              width: "100px",
            }}>
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
                zIndex: "10000"
              }}
            >
              Cerrar anuncio
            </button>
          )}
        </div>
      )}
      <video
        ref={videoRef}
        style={{ width, height, display: Commercial || Player ? "none" : "" }}
        height={HeightVideo()}
        width={width}
        controls
        muted={true}
        className={`video-player  ${isFullScreen ? 'fullscreen' : ''}`}
        poster={stream_thumbnail}
      />
    </>
  );
}

export default ReactVideoPlayer;
