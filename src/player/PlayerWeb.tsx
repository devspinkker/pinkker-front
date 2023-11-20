import { FC, Fragment, useEffect, useRef } from "react";
import flv from "flv.js";

export interface ReactFlvPlayerProps {
  isLive?: boolean;
  hasAudio?: boolean;
  hasVideo?: boolean;
  showControls?: boolean;
  enableStashBuffer?: boolean;
  stashInitialSize?: number | undefined;
  height?: number;
  width?: number;
  isMuted?: false;
  url: string;
  videoProps?: React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >;
  flvMediaSourceOptions?: flv.MediaDataSource;
  flvConfig?: flv.Config;
  playerRef?: React.RefObject<HTMLVideoElement>;
  // errorCallback?: (err: any) => void;
}

export const ReactFlvPlayer: FC<ReactFlvPlayerProps> = (props) => {
  const {
    height,
    width,
    isLive,
    hasAudio,
    hasVideo,
    showControls,
    enableStashBuffer,
    stashInitialSize,
    isMuted,
    url,
    playerRef,
  } = props;
  

  useEffect(() => {
    console.log("ASKOAP");
    
    const player = flv.createPlayer(
      {
        type: "flv",
        isLive: isLive,
        hasAudio: hasAudio,
        hasVideo: hasVideo,
        url: url,
        ...props.flvMediaSourceOptions,
      },
      {
        stashInitialSize: stashInitialSize,
        enableStashBuffer: enableStashBuffer,
        ...props.flvConfig,
      }
    );

    player.attachMediaElement(playerRef?.current!);
    player.load();
    player.play();
    // player.on("error", (err) => {
    //   props.errorCallback?.(err);
    // });
  }, []);
 
  return (
    <Fragment>
      <video
        autoPlay={true}
        controls={showControls}
        muted={isMuted}
        ref={playerRef}
        style={{ height, width }}
        {...props.videoProps}
      />
    </Fragment>
  );
};

export default ReactFlvPlayer;