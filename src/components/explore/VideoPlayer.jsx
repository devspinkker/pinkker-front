import React, { useRef, useEffect, useState } from 'react';
import VideoActions from './VideoActions';

const VideoPlayer = ({ src, isPlaying }) => {
  const videoRef = useRef(null);
  const [isVertical, setIsVertical] = useState(false);
  const [isSquare, setIsSquare] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play().catch((error) => {
        console.error('Error attempting to play video:', error);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      const { videoWidth, videoHeight } = videoRef.current;
      setIsVertical(videoHeight > videoWidth);
      setIsSquare(videoHeight === videoWidth);
    };

    const video = videoRef.current;
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  return (
    <div style={videoPlayerStyle}>
      <video
        ref={videoRef}
        src={src}
        controls
        style={
          isVertical
            ? verticalVideoStyle
            : isSquare
            ? squareVideoStyle
            : horizontalVideoStyle
        }
      />
      <VideoActions />
    </div>
  );
};

const videoPlayerStyle = {
  position: 'relative',
  width: '320px',
  height: '568px',
};

const verticalVideoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const squareVideoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

const horizontalVideoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

export default VideoPlayer;
