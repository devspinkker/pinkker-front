import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import VideoPlayer from './VideoPlayer';
import Filter from './Filter';
import Comments from './Comments';

const VideoFeed = ({ liveVideos, clipsVideos }) => {
  const [selectedFilter, setSelectedFilter] = useState('live');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);

  const videos = selectedFilter === 'live' ? liveVideos : clipsVideos;

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setCurrentVideoIndex(0); // Reset the index when filter changes
  };

  useEffect(() => {
    if (videoRefs.current[currentVideoIndex]) {
      videoRefs.current[currentVideoIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentVideoIndex, videos]);

  const handleNext = () => {
    if (currentVideoIndex < videos?.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => handleNext(),
    onSwipedDown: () => handlePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        handlePrev();
      } else if (event.key === 'ArrowDown') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, videos]);

  return (
    <div {...handlers} style={containerStyle}>
      <Filter selectedFilter={selectedFilter} onSelectFilter={handleSelectFilter} />
      <div style={contentStyle}>
        <div style={videoColumnStyle}>
          {videos?.map((video, index) => (
            <div
              key={index}
              ref={(el) => (videoRefs.current[index] = el)}
              style={videoWrapperStyle}
            >
              <VideoPlayer src={video.url} isPlaying={index === currentVideoIndex} />
            </div>
          ))}
        </div>
        {/* <div style={commentsColumnStyle}>
          <Comments video={videos?.length >= 1 && videos } />
        </div> */}
      </div>
    </div>
  );
};

const containerStyle = {
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  display: 'flex',
  width: '100%',
  height: '100%',
};

const videoColumnStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflowY: 'auto',
};

const commentsColumnStyle = {
  width: '400px',
  padding: '20px',
  overflowY: 'auto',
};

const videoWrapperStyle = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export default VideoFeed;
