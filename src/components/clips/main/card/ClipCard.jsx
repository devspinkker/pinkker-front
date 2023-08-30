import React, {useState, useRef, useEffect} from "react"

import "./ClipCard.css"

import Tippy, {followCursor} from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import { Link } from "react-router-dom"

import { likeClip } from "../../../../services/vods";

import { useSelector } from "react-redux";

import { ScaleLoader } from "react-spinners"

import { getAllCommentsInVideoWithAuth, addComment } from "../../../../services/commentsClip";

import CommentCard from "../../view/card/CommentCard";

import { useNotification } from "../../../Notifications/NotificationProvider";

export default function ClipCard({type, clip}) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(true);
    const [volumePlayer, setVolumePlayer] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [isLiked, setIsLiked] = useState(clip.likedByMe);

    const playerRef = useRef();

    const [videoHover, setVideoHover] = useState(false);

    const [showComment, setShowComment] = useState(false)
    const [comments, setComments] = useState(null)
    const [comment, setComment] = useState(null)

    const alert = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllCommentsInVideoWithAuth(token, clip._id)
            if(data != null && data != undefined) {
                setComments(data)
            }
        }
        fetchData();
    }, [showComment]) 


    const handlePlay = () => {
        if (playing) {
            playerRef.current.pause();
        } else {
            playerRef.current.play();
        }
        setPlaying(!playing);
    }

    const handleProgress = (e) => {
        const {duration, currentTime} = e.target;
        setProgress((currentTime / duration) * 100);
    }

    async function handleLike() {
        if(isLiked) {
            setIsLiked(false);
            clip.totalLikes = clip.totalLikes - 1;
        } else {
            setIsLiked(true);
            clip.totalLikes = clip.totalLikes + 1;
        }
        await likeClip(token, clip._id);
    }

    const handleMute = () => {
        if (muted) {
            playerRef.current.muted = false;
            setMuted(false);
        } else {
            playerRef.current.muted = true;
            setMuted(true);
        }
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
                        <i onClick={handleMute} className="fas fa-volume-mute button-more-player"/>
                    </Tippy>
        } else {

            return  <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Volumen</h1>}>
                        <i onClick={handleMute} className="fas fa-volume-up button-more-player"/>
                    </Tippy>

        }
    }


    function getButtonDuration() {
        if(playerRef.current != null && playerRef.current != undefined) {
            return (
                <div  className="clipcard-progress-body">
                    <p style={{width: "97%", position: "relative", top: "-10px"}} className="controlsTime">{parseDuration(playerRef.current.currentTime)}/{parseDuration(playerRef.current.duration)}</p>
                     <div style={{width: "95%", borderRadius: "0", height: videoHover ? "5px" : "2px"}} className="time_progressbarContainer">
                        <div style={{ width: `${progress}%` }} className="time_progressBar"></div>
                    </div>
                        
                </div>
            )
        }
    }

    function handleUpdate() {
        const fetchData = async () => {
            const data = await getAllCommentsInVideoWithAuth(token, clip._id)
            if(data != null && data != undefined) {
                setComments(data)
            }
        }   
        fetchData()
    }

    function createComment() {
        if(comment.trim() != '') {
            addComment(token, comment, clip._id, 1)
            .then(res => {
                if(res.data != null && res.data != undefined) {
                    alert({type: "SUCCESS", message: res.data.msg})
                    setComment('');
                    handleUpdate()
                }
                   
            })
        }
    }

    return (
        <div className="clipmain-card-main">
            <div style={{marginTop: type === 1 && "20px"}} className="clipsmain-container">
                <div onMouseEnter={() => setVideoHover(true)} onMouseLeave={() => setVideoHover(false)} className="clipsmain-video">
                    <div className="clipsmain-top-buttons">
                        {playing ? 
                            <i style={{opacity: "0"}}  class="fas fa-pause button-more-player"/> : 
                             <i style={{opacity: "0"}} class="fas fa-play button-more-player"/>
                            }
                        {getVolumeButton()}
                    </div>
                    <video onTimeUpdate={handleProgress} onClick={handlePlay} ref={playerRef} loop={true} autoPlay={true} muted={true} controls={true} src={clip.url} />

                    {playing === false && 
                        <div className="clipcard-muted">
                            <i onClick={handlePlay} style={{cursor: "pointer", fontSize: "44px", color: "lightgray"}}  class="fas fa-play button-more-player"/>
                        </div>
                    }

                    <div style={{width: "100%", position: "absolute", bottom: "55px", textAlign: "right"}}>
                        {getButtonDuration()}

                    </div>

                    <div className="clipsmain-bottom-buttons">                        
                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                            <Link style={{textDecoration: "none", color: "white"}} to={"/" + clip.name}>
                                <div style={{display: "flex", alignItems: "center", marginTop: "20px"}}>
                                    <div>
                                        <Link to={"/" + clip.name}>
                                            <img style={{width: "30px", borderRadius: "50px", marginRight: "5px"}} src={clip.avatar} />
                                        </Link>
                                    </div>
                                    <h3>{clip.name}</h3>
                                    <button style={{marginTop: "0px", marginLeft: "10px", padding: "3px", fontSize: "11px", width: "55px"}} className="channel-bottom-v2-button-follow">Seguir</button>
                                </div>    
                            </Link>
                        </div>
                        <div style={{position: "relative", top: "10px"}}>
                            <p style={{fontWeight: "400", color: "#ededed"}}>{clip.clipName}</p>
                            <div style={{display: "flex"}}>
                                {clip.stream.stream_tag.map((tag) => <p style={{textAlign: "left", fontWeight: "600"}} className="channel-title-tag">#{tag}</p>)}
                            </div>
                        </div>                        
                    </div>
                </div>

                <div style={{width: "50px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", left: "30px", opacity: showComment && "0"}} className="clipsmain-right-buttons">
                    <div>

                        <div style={{height: "410px"}}/>
                        
                        <div onClick={() => handleLike()} style={{color: isLiked && "#f36196"}} className="clipcard-icon-like">
                            {isLiked ? 
                                <i style={{backgroundColor: "#303030", width: "40px", height: "40px", borderRadius: "50px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"}} class="fas fa-heart"/> 
                                : 
                                <i style={{backgroundColor: "#303030", width: "40px", height: "40px", borderRadius: "50px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"}} class="far fa-heart"/>
                            }
                            <h3 style={{fontSize: "15px", marginTop: "5px"}}>{clip.totalLikes}</h3>
                        </div>

                        
                        <div onClick={() => setShowComment(true)} className="clipcard-icon-comment">
                            <i style={{backgroundColor: "#303030", width: "40px", height: "40px", borderRadius: "50px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"}} class="fas fa-comment"/> 
                            <h3 style={{fontSize: "15px", marginTop: "5px"}}>{clip.totalComments}</h3>
                        </div>
                        
                        

                        <div className="clipcard-icon-share">
                            <i style={{backgroundColor: "#303030", width: "40px", height: "40px", borderRadius: "50px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"}} class="fas fa-share"/> 
                        </div>

                        <div className="clipcard-icon-share">
                            <i style={{backgroundColor: "#303030", width: "40px", height: "40px", borderRadius: "50px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"}} class="fas fa-ellipsis-v"/> 
                        </div>

                    </div>
                </div>
                
            </div>

           {showComment && <div className="clipmain-comments-container">
                
                <div style={{width: "375px", backgroundColor: "#151515", padding: "20px"}} className="clipcard-comments-container">
                    <div style={{position: "relative", top: "-20px"}} className='embleminfo-close'>
                        <i onClick={() => setShowComment(false)}  style={{cursor: "pointer", color: "#ededed", fontSize: "16px"}} class="fas fa-times"/>
                    </div>
                    {comments != null ? comments.map((comment) => <CommentCard comment={comment}/>) : <div style={{ minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <ScaleLoader width={4} height={20} color="#f36197d7" />
                    </div>}
                </div>

                <div style={{display: "flex", alignItems: "center", marginTop: "5px", marginBottom: "10px", backgroundColor: "#151515"}} className="clipcard-send-comment">
                    <div>
                        <img style={{width: "30px", borderRadius: "100px"}} src={user.avatar} />
                    </div>

                    <div style={{marginLeft: "10px", height: "50px"}} className="muro-send-tweet-input">
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} style={{borderBottom: "1px solid white", height: "30px", width: "90%", fontSize: "16px"}} placeholder="Comenta el clip.." type="text" />
                    </div>

                    <div>
                        <button onClick={() => createComment()} className="viewtweet-button-reply">Responder</button>
                    </div>
                </div>
            </div>}
        </div>
        
    )
}