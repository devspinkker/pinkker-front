// src/VideoPlayer.js
import React, { useRef, useEffect, useState } from 'react';

const VideoPlayer = ({ src, isPlaying }) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(error => {
          console.error('Error attempting to play video:', error);
        });
      }
    } else if (!isPlaying && videoRef.current) {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      onPlay={handlePlay}
      onPause={handlePause}
      style={{ width: '100%', height: 'auto' }}
    />
  );
};

export default VideoPlayer;
