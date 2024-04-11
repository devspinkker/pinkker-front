import React, {useState, useRef} from "react"

import "./Player.css"

import Tippy, {followCursor} from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

export default function Player({url, style}) {

    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(true);
    const [volumePlayer, setVolumePlayer] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const playerRef = useRef();
    
    const handlePlay = () => {
        if (playing) {
            playerRef.current.pause();
        } else {
            playerRef.current.play();
        }
        setPlaying(!playing);
    }

    const handleMute = () => {
        if (muted) {
            playerRef.current.muted = false;
        } else {
            playerRef.current.muted = true;
        }
        setMuted(!muted);
    }

    const handleVolume = (e) => {
        playerRef.current.volume = e.target.value;
        setVolumePlayer(e.target.value);
    }

    const handleProgress = (e) => {
        const {duration, currentTime} = e.target;
        setProgress((currentTime / duration) * 100);
    }
    
    const handleChangeTime = () => {
        const {duration} = playerRef.current;
        const newTime = (1 * duration) / 100;
        playerRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
    

    function parseDuration(duration) {

        let fullduration = parseInt(duration);

        let minutes = Math.floor(fullduration / 60);
        let seconds = fullduration - minutes * 60;
        if(seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    function getVolumeButton() {
        if (muted === true) {
            return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                        <i className="fas fa-volume-mute button-more-player"/>
                    </Tippy>
        } else {

            if(volumePlayer === 0) {
                return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                            <i className="fas fa-volume-mute button-more-player"/>
                        </Tippy>
            }

            if(volumePlayer <= 0.5) {
                return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                            <i className="fas fa-volume-mute button-more-player"/>
                        </Tippy>
            }
            if(volumePlayer > 0.5) {
                return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                            <i className="fas fa-volume-mute button-more-player"/>
                        </Tippy>
            }
        }
    }

    function getButtons() {
        if(playerRef.current != null && playerRef.current != undefined) {
            return (
                <div className="player-control-container">
                <div className="player-control-primary">
                    <Tippy theme="pinkker" followCursor content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Time</h1>} >
                        <div onClick={() => handleChangeTime()} className="time_progressbarContainer">
                            <div style={{ width: `${progress}%` }} className="time_progressBar"></div>
                        </div>
                    </Tippy>
                    <p className="controlsTime">{parseDuration(playerRef.current.currentTime)}/{parseDuration(playerRef.current.duration)}</p>
                </div>
                <div className="player-control-secundary">
                    <div className="player-control-secundary-div">
                        
                    </div>

                    <div className="player-control-secundary-div2">
                        <div className="player-control-card">
                            {getVolumeButton()}
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }

    return (
        <div style={style} className="player-body">
            <video ref={playerRef} onClick={handlePlay} className="player-video" src={url}  loop={true} autoPlay={true} muted={true} onTimeUpdate={handleProgress}/>
            {playing === false && 
                <div style={{zIndex: "99999", position: "absolute", top: "28%", left: "35%"}} className="clipcard-muted">
                    <i onClick={handlePlay} style={{cursor: "pointer", fontSize: "44px", color: "lightgray"}}  class="fas fa-play button-more-player"/>
                </div>
            }

            
            <div className="player-shadow-1"></div>
            {getButtons()}
        </div>
    )
}