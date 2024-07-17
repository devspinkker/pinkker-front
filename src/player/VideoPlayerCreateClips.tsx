import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css";
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
function VideoPlayerCreateClips({ src, videoRef, height, width,}: ReactVideoPlayerProps) {
  const history = useHistory();
  const [isPlaying, setIsPlaying] = useState(false);
  const [Commercial, setCommercial] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(true);
  const [Player, setPlayer] = useState(true);
  const hlsRef = useRef<Hls | null>(null);

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
            videoRef.current?.play(); 
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);



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

  const convertTSFileToBytes = async (tsFilePath: string) => {
    try {
      const response = await fetch(tsFilePath);
      const arrayBuffer = await response.arrayBuffer();
      const videoBytes = new Uint8Array(arrayBuffer);
      console.log('Video bytes:', videoBytes);
    } catch (error) {
      console.error('Error fetching or converting TS file to bytes:', error);
    }
  };

  useEffect(() => {
    if (src && src.endsWith('.ts')) {
      convertTSFileToBytes(src);
    }
  }, [src]);

  return (
    <>
      {showWarning && (
        <div
          style={{ width, height, background: "#080808", paddingTop: "100px", display: "flex", justifyContent: "center" }}
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

      <video
        style={{ width, height, display: Commercial || Player ? "none" : "" }}
        id='video-player'
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

export default VideoPlayerCreateClips;
