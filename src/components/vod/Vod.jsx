import React, {useState, useEffect} from 'react';

import "./Vod.css"

import { getVod } from "../../services/vods";
import {useParams} from 'react-router-dom';

import Player from '../clips/player/Player';
import { useSelector } from 'react-redux'

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; 

import Comments from './comments/Comments';

import { addView } from '../../services/views';

import { userLikeVideo, userDislikeVideo, likeVideo, dislikeVideo } from '../../services/vods';

import { ScaleLoader } from "react-spinners"

import { getMessagesStream } from '../../services/chat';
import Message from './Message';



export default function Vod() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)


    const { vodId } = useParams();
    const [video, setVideo] = useState();

    const [isLiked, setIsLiked] = useState(null);
    const [isDisliked, setIsDisliked] = useState(null);

    const [likes, setLikes] = useState(null);
    const [dislikes, setDislikes] = useState(null);

    const [messages, setMessages] = useState(null);
    

    useEffect(() => {
        const fetchData = async () => {

            const dataLiked = await userLikeVideo(token, vodId, 1);
            if(dataLiked != null && dataLiked != undefined) {
                setIsLiked(dataLiked.data);
            }

            const dataDisliked = await userDislikeVideo(token, vodId, 1);
            if(dataDisliked != null && dataDisliked != undefined) {
                setIsDisliked(dataDisliked.data); 
            }


            const data = await getVod(vodId);
            if(data != null && data != undefined) {
                setVideo(data);
                const dataView = await addView(token, vodId, 1);
                setLikes(data.likes.length);
                setDislikes(data.dislikes.length);
            }
            
            const dataMessages = await getMessagesStream(data.stream_title);
            if(dataMessages != null && dataMessages != undefined) {
                setMessages(dataMessages);
            }

           
        }
        fetchData();
    }, [token])



    const handleLike = async () => {

        if(isDisliked) {
            setIsDisliked(false);
            setDislikes(dislikes - 1);

            const data = await dislikeVideo(token, vodId, 1);
        }

        if(isLiked) {
            setIsLiked(false);
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
            setIsLiked(true);
        }

       

        const data = await likeVideo(token, vodId, 1);
       
       
    }

    const handleDislike = async () => {
        if(isLiked) {
            setIsLiked(false);
            setLikes(likes - 1);
            const data = await likeVideo(token, vodId, 1);
        }
        if(isDisliked) {
            setDislikes(dislikes - 1);
            setIsDisliked(false);
        } else {
            setDislikes(dislikes + 1);
            setIsDisliked(true);
        }

        
        const data = await dislikeVideo(token, vodId, 1);
    }


    function timeSince(date) {

        const date2 = new Date(date).getTime();

        var seconds = Math.floor((new Date().getTime() - date2) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " años";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " meses";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " días";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " horas";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutos";
        }
        return Math.floor(seconds) + " segundos";
    }


    function Primary () {
        if(video != null && isLiked != null && isDisliked != null && likes != null && dislikes != null) {
            return (
                <div className="vod-primary">
                    <Player style={{width: "1360px"}} url={video.url}/>
    
                    <div className="vod-content">
                        <div className="vod-primary-title">
                            <div style={{width: "100px", padding: "5px", borderRadius: "5px", borderLeft: "3px solid #ff60b2", backgroundColor: "#151515"}}>
                                <p style={{marginLeft: "3px"}}>Hace {timeSince(video.createdAt)}</p>
                            </div>
                            <h2 style={{marginTop: "5px", textTransform: "uppercase", fontSize: "22px"}}>{video.stream_title}</h2>
                            <p style={{color: "lightgray", marginTop: "6px", fontSize: "13px"}}><a>{video.stream_category}</a>  · {video.views} vistas</p>
                        </div>

                        <div className="vod-primary-title-secundary">
                            <div>
                                <div style={{display: "flex", justifyContent: "right", alignItems: "center"}}>
                                    <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Pausa</h1>}>
                                    </Tippy> 
                                    <button className="vod-button-view-vod"> <i style={{cursor: "pointer"}} class="fas fa-share"/> Compartir</button>

                                    <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Pausa</h1>}>
                                        <i style={{cursor: "pointer"}}  class="fas fa-ellipsis-v button-more-player"/>
                                    </Tippy> 

                                </div>

                                <div style={{display: "flex", width: "100%", justifyContent: "right"}}>
                                    <Tippy theme="pinkker" placement='bottom'  content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Me gusta</h1>}>
                                        <button onClick={handleLike} className={isLiked ? 'button-isliked' : 'button-like'}><i style={{fontSize: "14px", marginRight: "3px"}} class="fas fa-thumbs-up"/>  {likes}</button>
                                    </Tippy>

                                    <Tippy theme="pinkker" placement='bottom'  content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>No me gusta</h1>}>
                                        <button style={{marginRight: "0px"}} onClick={handleDislike} className={isDisliked ? 'button-isliked' : 'button-like'}><i style={{fontSize: "14px", marginRight: "3px"}} class="fas fa-thumbs-down"/>  {dislikes}</button>
                                    </Tippy>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr style={{width: "100%", border: "1px solid #2b2b2b8f"}}/>


                    <Comments video={vodId}/>
                </div>
            )
        } else {
            return (
                <div style={{ minHeight: "800px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <ScaleLoader color="#ff60b2" />
                </div>
                
            )
        }
    }

    return (
        <div className="vod-body">
            {Primary()}
            {video && messages && <div className='vod-secondary'>
                <div className='vod-secondary-title'>
                    <p>Chatea sobre vídeos</p>
                </div>
                <div className='vod-secondary-chat'>
                    {messages.map((message, index) => <Message message={message}/>)}
                </div>
            </div>}
        </div>
    )
}