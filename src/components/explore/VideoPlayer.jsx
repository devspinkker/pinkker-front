import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ src, isPlaying }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play().catch((error) => {
        console.error('Error attempting to play video:', error);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      style={{ width: '100%', height: 'auto' }}
    />
  );
};

export default VideoPlayer;
