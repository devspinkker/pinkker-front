import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import "./ReactVideoPlayer.css";

interface ReactVideoPlayerProps {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  height: string;
  width: string;
  onVideoBytesReady: (bytes: Uint8Array) => void;
  isMuted: boolean;
  volume: number;
}

function VideoPlayerCreateClips({ src, videoRef, height, width, onVideoBytesReady, isMuted, volume }: ReactVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    let hls: Hls | null = null;

    const initializePlayer = async () => {
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
            videoRef.current?.play();
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
          });
        }
      } catch (error) {
        console.error('Error initializing video player:', error);
      }
    };

    initializePlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  const convertTSFileToBytes = async (tsFilePath: string): Promise<Uint8Array> => {
    try {
      const response = await fetch(tsFilePath);
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (error) {
      console.error('Error converting TS file to bytes:', error);
      return new Uint8Array();
    }
  };

  const fetchAndCombineTSFiles = async (tsFilePaths: string[]) => {
    const buffers: Uint8Array[] = [];

    for (const path of tsFilePaths) {
      const bytes = await convertTSFileToBytes(path);
      buffers.push(bytes);
    }

    const combinedLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);
    const combinedBuffer = new Uint8Array(combinedLength);
    let offset = 0;

    for (const buffer of buffers) {
      combinedBuffer.set(buffer, offset);
      offset += buffer.length;
    }

    onVideoBytesReady(combinedBuffer);
  };

  useEffect(() => {
    const fetchM3U8AndCombineTSFiles = async () => {
      try {
        const response = await fetch(src);
        const playlistText = await response.text();

        const tsFilePaths = playlistText
          .split("\n")
          .filter(line => line && !line.startsWith("#") && line.endsWith(".ts"))
          .map(line => new URL(line, src).toString());

        if (tsFilePaths.length > 0) {
          fetchAndCombineTSFiles(tsFilePaths);
        } else {
          console.warn("No TS files found in playlist.");
        }
      } catch (error) {
        console.error("Error fetching and parsing M3U8 file:", error);
      }
    };

    if (src && src.endsWith('.m3u8')) {
      fetchM3U8AndCombineTSFiles();
    }
  }, [src]);

  return (
    <video
      className='VideoPlayerCreateClip'
      id='video-player'
      muted={isMuted}
      controls={false}
      playsInline
      ref={videoRef}
      height={height}
      width={width}
    />
  );
}

export default VideoPlayerCreateClips;
