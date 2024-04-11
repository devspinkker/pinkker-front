import React, { useEffect, useRef } from 'react';
import flvjs from 'flv.js';

interface ReactRtmpPlayerProps {
  src: string;
}

function ReactRtmpPlayer({ src }: ReactRtmpPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const flvPlayerRef = useRef<flvjs.Player | null>(null);

  useEffect(() => {
    let flvPlayer: flvjs.Player | null = null;

    async function initPlayer() {
      if (flvjs.isSupported()) {
        flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: src,
        });
        flvPlayerRef.current = flvPlayer;

        if (videoRef.current) {
          flvPlayer.attachMediaElement(videoRef.current);
          flvPlayer.load();
          flvPlayer.play();
        }
      } else {
        console.error('FLV.js is not supported.');
      }
    }

    initPlayer();

    return () => {
      if (flvPlayer) {
        flvPlayer.destroy();
      }
    };
  }, [src]);

  return <video controls ref={videoRef} />;
}

export default ReactRtmpPlayer;
