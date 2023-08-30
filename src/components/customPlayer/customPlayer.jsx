import React, {useState, useRef, useEffect} from "react"

import "./customPlayer.css"
import ReactHlsPlayer from '../../player/PlayerMain';
import ReactFlvPlayer from '../../player/PlayerWeb.tsx';


import DropdownSettings from "./DropdownSettings";

import { getUser } from "../../services/follow";
import { useSelector } from 'react-redux'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import PopupClipCreator from "../popup/PopupClipCreator/PopupClipCreator";
import ClipCreator from "../popup/ClipCreator/ClipCreator";

import { createClip } from "../../services/vods";


import Slider from '@mui/material/Slider';
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom"
import { ScaleLoader } from "react-spinners"
import ReactPlayer from 'react-player'

export default function CustomPlayer({isMobile, expanded, dashboard, setViewInfoStream, streamerName, width, height, left, marginLeft, time, vod, popup, closePopup}) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)
    
    const { streamer } = useParams();

    const videoRef = React.useRef();
    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(false);
    const [volumePlayer, setVolumePlayer] = useState(0);

    const [dropdownSettings, setDropdownSettings] = useState(false);
    const [streamerData, setStreamerData] = useState(null);

    const [popupClipCreator, setPopupClipCreator] = useState(false);
    const [video, setVideo] = useState(null);

    const [startTime, setStartTime] = useState(time);

    const [multiverse, setMultiverse] = useState(false);

    const [volumeHovered, setVolumeHovered] = useState(false);

    const [quality, setQuality] = useState("auto");

    const [showScreenMute, setShowScreenMute] = useState(true);

    const [currentTime, setCurrentTime] = useState(null);


    const togglePopupClipCreator = (video) => {
        setVideo(video)
        setPopupClipCreator(!popupClipCreator);
    }

    useEffect(() => {

        const fetchData = async () => {

            if(popup) {
                if(streamerName != null && streamerName != undefined) {
                    const dataStreamer = await getUser(streamerName);
                    if(dataStreamer != null && dataStreamer != undefined) {
                        setStreamerData(dataStreamer);
                    }
                }
            } else {
                if(streamer != null && streamer != undefined) {
                    const dataStreamer = await getUser(streamer);
                    if(dataStreamer != null && dataStreamer != undefined) {
                        setStreamerData(dataStreamer);
                    }
                }
            }
        }

        fetchData();
    }, [user])

    const [videoLoading, setVideoLoading] = useState(true);

    /*useEffect(() => {

        if(videoRef.current != null && videoRef.current != undefined) {
            console.log(videoRef.current)
            const videoPlayer = videoRef.current;
    
            const handlePlayerLoad = () => {
                console.log("loaded")
            setVideoLoading(false);
            };
        
            const handlePlayerError = () => {
            console.log('error loading');
            setVideoLoading(false);
            };
        
            videoPlayer.addEventListener('loadeddata', handlePlayerLoad);
            videoPlayer.addEventListener('error', handlePlayerError);
        
            return () => {
            videoPlayer.removeEventListener('loadeddata', handlePlayerLoad);
            videoPlayer.removeEventListener('error', handlePlayerError);
            };
        }
        
      }, [videoRef.current]);
*/


    const [preLoad , setPreLoad] = useState(false);


    /*useEffect(() => {

        if(preLoad === false) {
            if(videoRef.current?.currentTime != NaN && videoRef.current?.currentTime != undefined && videoRef.current?.currentTime != null && videoRef.current?.currentTime != 0) {

                videoRef.current.currentTime = videoRef.current.duration - 20;
                setPreLoad(true);
                setCurrentTime(videoRef.current.currentTime);
                console.log(videoRef.current?.currentTime)
                console.log(videoRef.current?.duration)
            }
    
        }
        
      }, [videoRef.current?.currentTime]);*/

      useEffect(() => {

        if(videoRef.current?.currentTime != NaN && videoRef.current?.currentTime != undefined && videoRef.current?.currentTime != null && videoRef.current?.currentTime != 0) {


            if(videoRef.current?.duration - videoRef.current?.currentTime > 60) {
                videoRef.current.currentTime = videoRef.current.duration - 30;
            }

          
        }
                
      }, [videoRef.current?.currentTime]);


    const onMouseEnterSettings = () => {
        if(dropdownSettings === true) {
            setDropdownSettings(false);
        } else{
            setDropdownSettings(true);
        }
      };
      

    const videoHandler = () => {
        if (playing === false) {

            videoRef.current.currentTime = videoRef.current.duration - 15;
            videoRef.current.play();
            setPlaying(true);
        } else {
            videoRef.current.pause();
            setPlaying(false);
        }
      };


      const mutedPlayer = () => {
        if (muted === true) {
            videoRef.current.muted = false;
            setMuted(false);
            setVolumePlayer(0.2);

        } else if (muted === false) {
            videoRef.current.muted = true;
            setMuted(true);
            setVolumePlayer(0);
        }
      };

      function activateSound() {
        setShowScreenMute(false);
        //Play video
        videoRef.current.play();
        videoRef.current.muted = false;
        setMuted(false);
        setVolumePlayer(0.2);
      }

      const setVolume = (volume) => {
        if (volume === 0) {
            setMuted(true);
            setVolumePlayer(volume);

        } else {
            videoRef.current.volume = volume;
            console.log(videoRef.current.volume)
            setVolumePlayer(volume);
            setMuted(false);
        }

      };



      const toggleFullScreen = () => {
        
        var el = document.getElementById("pinkker-player");
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        }

       
        
      };

      function getHlsSrc() {

        const url = process.env.REACT_APP_DEV_RMTP_URL + "/live/";


        /*if(quality === "auto") {
            return (url + streamerData.keyTransmission.substring(4, streamerData.keyTransmission.length) + "/index.m3u8")
        }

        if(quality === "720") {
            return (url + streamerData.keyTransmission.substring(4, streamerData.keyTransmission.length) + "_720/index.m3u8")
        }

        if(quality === "480") {
            return (url + streamerData.keyTransmission.substring(4, streamerData.keyTransmission.length) + "_480/index.m3u8")
        }

        if(quality === "360") {
            return (url + streamerData.keyTransmission.substring(4, streamerData.keyTransmission.length) + "_360/index.m3u8")
        }*/

        return (url + streamerData.keyTransmission.substring(4, streamerData.keyTransmission.length) + "/index.m3u8")

      }

      function getFlvSrc() {

        const url = process.env.REACT_APP_DEV_RMTP_URL + "/live/";
        return (url + streamerData.keyTransmission.substring(4, streamerData.keyTransmission.length) + ".flv")

      }

      function getHlsPlayer() {
        if(streamerData != null) {
          if(vod === true) {
              return <video style={{position: "relative", top: "60px"}} id="pinkker-player" playerRef={videoRef} src={video} autoPlay={true} muted controls={false} width="100%" height="729px"/>
            } else {
                /*if(isMobile) {
                    return <ReactHlsPlayer id="pinkker-player" 
                        playerRef={videoRef} 
                        src={getHlsSrc()}  
                        autoPlay={true} 
                        muted = {true} 
                        controls={false} 
                        style={{position: "relative", marginLeft: marginLeft, top: popup === true ? "10px" : "2px", left: height === "200px" ? "0px": popup === true ? "0px" : left ? left : "-0px", zIndex: "1"}}
                        width={width ? width : "100%"} 
                        height={height ? height : "835px"}
                    />
                }*/

                return <ReactHlsPlayer id="pinkker-player" 
                playerRef={videoRef} 
                preload={"auto"}
                webkit-playsinline={true}
                playsInline={true}
                src={getHlsSrc()}  
                autoPlay={true} 
                muted = {true} 
                controls={false} 
                style={{position: "relative", marginLeft: marginLeft, top: popup === true ? "10px" : "2px", left: height === "200px" ? "0px": popup === true ? "0px" : left ? left : "-0px", zIndex: "1"}}
                width={width ? width : "100%"} 
                height={height ? height : "835px"}
            />

                return <ReactFlvPlayer id="pinkker-player" 
                        playerRef={videoRef} 
                        url={getFlvSrc()}  
                        isMuted={muted}
                        isLive={true}
                        showControls={true}
                        enableStashBuffer={true}
                        style={{position: "relative", marginLeft: marginLeft, top: popup === true ? "10px" : "2px", left: height === "200px" ? "0px": popup === true ? "0px" : left ? left : "-0px", zIndex: "1"}}
                        width={width ? width : "100%"} 
                        height={height ? height : "835px"}
                    />

                
              
            }
        }
       
    }


      function getVolumeButton() {
        if (muted === true) {
            return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                        <i
                            onMouseEnter={() => setVolumeHovered(true)} 
                            onMouseLeave={() => setVolumeHovered(false)} 
                            onClick={() => mutedPlayer()} style={{cursor: "pointer"}} 
                            className="fas fa-volume-mute pinkker-button-more"
                        />
                    </Tippy>
        } else {

            if(volumePlayer === 0) {
                return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                            <i
                             onMouseEnter={() => setVolumeHovered(true)} 
                             onMouseLeave={() => setVolumeHovered(false)} 
                             onClick={() => mutedPlayer()} 
                             style={{cursor: "pointer"}} 
                             className="fas fa-volume-down pinkker-button-more"
                            />
                        </Tippy>
            }

            if(volumePlayer <= 0.5) {
                return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                            <i
                             onMouseEnter={() => setVolumeHovered(true)} 
                             onMouseLeave={() => setVolumeHovered(false)} 
                             onClick={() => mutedPlayer()} 
                             style={{cursor: "pointer"}} 
                             className="fas fa-volume-down pinkker-button-more"
                            />
                        </Tippy>
            }
            if(volumePlayer > 0.5) {
                return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                            <i
                             onMouseEnter={() => setVolumeHovered(true)} 
                             onMouseLeave={() => setVolumeHovered(false)} 
                             onClick={() => mutedPlayer()} 
                             style={{cursor: "pointer"}} 
                             className="fas fa-volume-down pinkker-button-more"
                            />
                        </Tippy>
            }
        }
    }

    //Get Random String
    function getRandomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      
    }


    const handleClip = async () => {

        togglePopupClipCreator(video)
      
        const data = await createClip(streamer, time, 30, getRandomString());
        if(data != null) {
            setVideo(data.data.video)

        }
    }

    function getTopButtom() {

        if(videoRef.current != null && videoRef.current != undefined) {

            if(popup === true) {
                return (
                    <div style={{backgroundColor: "rgba(0, 0, 0, 0.541)", justifyContent: "space-between", width: "100%", zIndex: "9999", left: "0px", top: "50px"}} className="customPlayer-top">
                        <div style={{width: "180px", textAlign: "left", marginLeft: "5px"}}>
                            <h4 style={{fontFamily: "Poppins", fontSize: "12px", color: "#ededed"}}>Estas viendo a {streamerName}</h4>
                        </div>
                        <div style={{position: "relative", top: "-0px", left: "-5px"}} onClick={() => closePopup()} className="customPlayer-close-popup">
                            <i style={{cursor: "pointer"}}  class="fas fa-times"/>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div style={{marginLeft: expanded && "-50px"}} className="customPlayer-top">
                        <div className="channel-custom-player-online">
                            <h4>EN DIRECTO</h4>
                        </div>
                    </div>
                )
            }
        }
    }

    function popupwindow(url, title, w, h) {
        var y = window.outerHeight / 2 + window.screenY - ( h / 2)
        var x = window.outerWidth / 2 + window.screenX - ( w / 2)
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
    }


    function getBottomButtons() {
        if(videoRef.current != null && videoRef.current != undefined) {

            if(popup === true) {
                return (
                    <div  className="customPlayer-container">
                    <div style={{marginTop: "-85px", justifyContent: "center"}} className="customPlayer-primary">
                        <div style={{justifyContent: "center"}} className="customPlayer-secundary-div">
                            <div style={{marginRight: "15px"}} className="customPlayer-card">
                                {playing ? 
                                    <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat", marginRight: "10px"}}>Pausa</h1>}>
                                        <i onClick={() => videoHandler()} style={{cursor: "pointer"}}  class="fas fa-pause custom-player-popup-icon"/>
                                    </Tippy> : 
                                    <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Play</h1>}>
                                        <i onClick={() => videoHandler()} style={{cursor: "pointer"}} class="fas fa-play custom-player-popup-icon"/>
                                    </Tippy>}
                            </div>
                            <div className="customPlayer-card">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volver al stream</h1>}>
                                    <Link to={"/" + streamerName}>
                                        <i onClick={() => videoHandler()} style={{cursor: "pointer", color: "#ededed"}}  class="fas fa-expand-alt custom-player-popup-icon"/>
                                    </Link>
                                </Tippy>
                            </div>
                            
                            
                        </div>
    
                        
                    </div>
                   
                </div>
                )
            } else {
                return (
                    <div className="customPlayer-container">
                    <div style={{marginTop: expanded ? "-130px" : "-130px"}} className="customPlayer-primary">
                        <div className="customPlayer-secundary-div">
                            <div className="customPlayer-card">
                                {playing ? 
                                    <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Pausa</h1>}>
                                        <i onClick={() => videoHandler()} style={{cursor: "pointer"}}  class="fas fa-pause pinkker-button-more"/>
                                    </Tippy> : 
                                    <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Play</h1>}>
                                        <i onClick={() => videoHandler()} style={{cursor: "pointer"}} class="fas fa-play pinkker-button-more"/>
                                    </Tippy>}
                            </div>
                            <div className="customPlayer-card">
                                {getVolumeButton()}
                            </div>
    
                            <div style={{marginLeft: "15px", width: "125px"}} className="customPlayer-card">
    
                                <Slider
                                    onMouseEnter={() => setVolumeHovered(true)}
                                    onMouseLeave={() => setVolumeHovered(false)}
                                    aria-label="Temperature"
                                    defaultValue={volumePlayer}
                                    max={1}
                                    step={0.01}
                                    color="secondary"
                                    value={volumePlayer}
                                    style={{opacity: volumeHovered ? "1" : "0"}}
                                    onChange={(e) => setVolume(e.target.value)}
                                />
                            </div>
                            
                        </div>
    
                        <div style={{marginLeft: expanded && "-50px"}} className="customPlayer-secundary-div2">
    
                            {/*<div className="customPlayer-card">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Entrar al Multiverso</h1>}>
                                    <i onClick={() => setMultiverse(true)} style={{cursor: "pointer"}} class="fas fa-hotel button-more-player"/>
                                </Tippy>
                                </div>*/}
                            
                            <div className="customPlayer-card">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Crear clip</h1>}>
                                    <i onClick={() => handleClip()} style={{cursor: "pointer"}} class="fas fa-cut pinkker-button-more button-more-player"/>
                                </Tippy>
                            </div>
                            
                            <div className="customPlayer-card">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Configuración</h1>}>
                                    <i onClick={onMouseEnterSettings} style={{cursor: "pointer"}} class="fas fa-cog pinkker-button-more button-more-player"/>
                                </Tippy>
                            </div>
    
                            <div  className="customPlayer-card">
                                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Full Screen</h1>}>
                                    <i onClick={() => toggleFullScreen()} style={{cursor: "pointer"}} class="fas fa-expand pinkker-button-more button-more-player"/>
                                </Tippy>
                            </div>
    
    
                                    
    
                        </div>
                    </div>
                   
                </div>
                )
            }


            
        }
    }


    return (
        <div  style={{left: expanded === true ? "225px" : "70px", height: height ? height : "845px"}} className={popup === true ? "custom-player-popup" : "custom-player"}>


            {getTopButtom()}
            {popup === false && <div className="customPlayer-shadow-1"></div>}

            {getHlsPlayer()}

            {/*dashboard === false && videoLoading === true && <div className="pinkker-player-loading">
                <ScaleLoader color="#f36197d7" />
    </div>*/}

            {dashboard === false && showScreenMute === true && <div onClick={() => activateSound()} className="customPlayer-sound">
                <div style={{textAlign: "center", backgroundColor: "#303030", padding: "10px", position: "relative", top: "53px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <i style={{fontSize: "34px"}} class="fas fa-volume-mute"/>
                    <h3 style={{fontSize: "24px", marginTop: "5px", marginLeft: "10px"}}>Haz click para activar el sonido</h3>
                </div>
            </div>}

            {/*<div className="customPlayer-shadow-1"></div>*/}
            {getBottomButtons()}

           
            {dropdownSettings && <DropdownSettings streamer={streamer} quality={quality} changeQuality={(e) => setQuality(e)} />}
            {popupClipCreator && <PopupClipCreator streamer={streamer} closePopup={() => togglePopupClipCreator()} video={video} />}
        </div>
    )
}