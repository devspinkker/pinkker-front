import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSwipeable } from 'react-swipeable';
import VideoPlayer from './VideoPlayer';
import Filter from './Filter';

const VideoFeed = ({ liveVideos, clipsVideos }) => {
  const [selectedFilter, setSelectedFilter] = useState('live');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [inViewIndices, setInViewIndices] = useState([]);
  
  const videos = selectedFilter === 'live' ? liveVideos : clipsVideos;

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setCurrentVideoIndex(0); // Reset the index when filter changes
  };

  const handleIntersection = useCallback((inView, entry, index) => {
    setInViewIndices((prev) => {
      const newInViewIndices = inView ? [...new Set([...prev, index])] : prev.filter((i) => i !== index);
      return newInViewIndices;
    });
  }, []);

  useEffect(() => {
    if (inViewIndices?.length === 1 && inViewIndices[0] !== currentVideoIndex) {
      setCurrentVideoIndex(inViewIndices[0]);
    }
  }, [inViewIndices, currentVideoIndex]);

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

  return (
    <div {...handlers} style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Filter selectedFilter={selectedFilter} onSelectFilter={handleSelectFilter} />
      <button
        onClick={handlePrev}
        disabled={currentVideoIndex === 0}
        style={{ ...buttonStyle, top: '10px' }}
      >
        &uarr;
      </button>
      <div style={{ flex: 1, width: '100%', overflow: 'auto' }}>
        {videos?.map((video, index) => (
          <InViewWrapper
            key={index}
            index={index}
            onIntersection={handleIntersection}
          >
            <div style={videoWrapperStyle}>
              <VideoPlayer src={video.url} isPlaying={index === currentVideoIndex} />
            </div>
          </InViewWrapper>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={currentVideoIndex === videos?.length - 1}
        style={{ ...buttonStyle, bottom: '10px' }}
      >
        &darr;
      </button>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  position: 'absolute',
  zIndex: 1,
};

const videoWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh', // Adjust this to control the height of the video
  margin: '10vh 0', // Add some top and bottom margin
};

const InViewWrapper = ({ children, index, onIntersection }) => {
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    onIntersection(inView, entry, index);
  }, [inView, entry, index, onIntersection]);

  return <div ref={ref} style={{ height: '100vh' }}>{children}</div>;
};

export default VideoFeed;
