import React, { useEffect, useRef, useState } from 'react';
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

function ReactVideoPlayerVod({ src, videoRef, height, width, quality, stream, streamerDataID,stream_thumbnail }: ReactVideoPlayerProps) {
  const history = useHistory();
  const [isPlaying, setIsPlaying] = useState(false);
  const [Commercial, setCommercial] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(true);
  const [Player, setPlayer] = useState(true);
  const commercialRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(3); // Estado para la cuenta regresiva
  const handleCommercialEnded = async () => {
    let token = window.localStorage.getItem("token");
    await AdsAddStreamSummary(token, streamerDataID, Commercial._id);
    setCommercial(null)
  };

  const playCommercial = () => {
    if (commercialRef.current && Commercial) {
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
          console.log(receivedMessage);
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
    let hls: Hls | null = null;

    async function initializePlayer() {
      try {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        hls = new Hls();
        hlsRef.current = hls;

        if (videoRef.current) {
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);

          videoRef.current.addEventListener('click', () => {
            if (!isPlaying) {
              videoRef.current?.play();
              setIsPlaying(true);
            }
          });

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('Manifest parsed');
            videoRef.current?.play(); // Asegúrate de que el video comience después de cargar el manifiesto
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
          });
        }
      } catch (error) {
        console.error('Error initializing video player:', error);
      }
    }

    initializePlayer();

    return () => {
      console.log(src);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

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

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  return (
    <>
{showWarning && (
  <div
    style={{
      width,
      height,
      backgroundImage: `url(${stream_thumbnail})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
      
    }}
  >
    <div className="base-dialog-player">
      <button onClick={handleStartWatchingClick}>
        <div>
          <i className='fas fa-play pinkker-button-more' ></i>
        </div>
      </button>
    </div>
  </div>
)}
      {Commercial && (
        <div>

          <video
          style={{ width, height }}
            id='commercial-player'
            muted={true}
            controls={false}
            playsInline
            ref={commercialRef}
            onClick={() => window.open(Commercial?.LinkReference, '_blank')}
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
                  width: "100px",
                }}>
                  omitir en {countdown}...
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
        
      )}
      <video
        style={{ width, height, display: Commercial ||  Player ? "none" : "" }}
        className='video-player'
        muted={true}
        controls={false}
        playsInline
        ref={videoRef}
      />
      {/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <button onClick={skipBackward}>Retroceder 10 segundos</button>
        <button onClick={skipForward}>Adelantar 10 segundos</button>
      </div> */}
    </>
  );
}

export default ReactVideoPlayerVod;
