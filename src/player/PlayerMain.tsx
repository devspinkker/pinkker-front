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
}

function ReactVideoPlayer({ src, videoRef, height, width, quality, stream, streamerDataID }: ReactVideoPlayerProps) {
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

  const handleCommercialEnded = async () => {
    let token = window.localStorage.getItem("token");
    await AdsAddStreamSummary(token, streamerDataID,Commercial._id);
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
    }
  }, [Commercial]);

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
                console.error('Error playing video:', error);
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
              videoRef.current?.play();
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('Manifest parsed');
              });
              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
              });
            }
          }
        }
      } catch (error) {
        console.error('Error initializing video player:', error);
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

  return (
    <>
      {showWarning && (
        <div
          style={{ width, height, background: "#080808", display: "flex", justifyContent: "center", alignItems:'center' }}
        >
          <div className="base-dialog">
            <div className="dialog-icon-holder">
              <svg
                width="70px"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="stroke-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                ></path>
              </svg>
            </div>
            <div className="base-dialogo-Adver">
              Advertencia, contenido para mayores de 18 años
            </div>
            <div className="base-dialogo-transmisión">
              <p>
                Esta transmisión tiene contenido para adultos. Debes tener 18 años de edad o más para poder ver este contenido.
              </p>
            </div>
            <div className="dialog-actions">
              <button onClick={handleRedirectHome}>
                <div>
                  <div>Cancelar</div>
                </div>
              </button>
              <button onClick={handleStartWatchingClick}>
                <div>
                  <div>Comenzar a mirar</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      {Commercial && (
        <video
          style={{ width, height }}
          id='commercial-player'
          muted={true}
          controls={false}
          playsInline
          ref={commercialRef}
          onPlay={handleCommercialEnded}
          onClick={() => window.open(Commercial?.LinkReference, '_blank')}
        />
      )}
      <video
        style={{ width, height, display: Commercial || Player ? "none" : "" }}
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
