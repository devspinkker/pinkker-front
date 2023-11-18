import React, {useState, useEffect} from "react"

import "./CiteTweet.css"

import {useSelector, useDispatch} from 'react-redux'

import { useNotification } from "../../Notifications/NotificationProvider";


import { ScaleLoader } from "react-spinners"

import { addComment,getAllCommentsInVideo } from "../../../services/commentsTweet";

import TweetCard from "../tweet/TweetCard";

import Tippy from '@tippyjs/react';

import EmojiPicker, { Theme } from "emoji-picker-react";

import { createTweet } from "../../../services/tweet";


export default function CiteTweet({ closePopup, tweet, isLiked, isRetweet }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const dispatch = useDispatch()
    const alert = useNotification();

    const [comments, setComments] = useState(null)
    const [message, setMessage] = useState(null)

    const [likes, setLikes] = useState(null);

    const [dropdownEmotes, setDropdownEmotes] = useState(false);


    const onMouseEnterEmotes = () => {
        setDropdownEmotes(!dropdownEmotes);
    };

    function clickEmoji(e) {
        setMessage(message + e.emoji)
    }

    async function handleSubmit() {
        if(message === "") return (alert({type: "ERROR", message: "Completa tu mensaje"}))

        const data = await createTweet(token, message, null, tweet)
        if(data != null && data != undefined) {
            setMessage("")
            alert({type: "SUCCESS", message: data.data.msg})
            setDropdownEmotes(false)
            closePopup();
        }
    }

    return (
        <div className='citetweet-popup-body'>
            
            <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
                
                <div className={'citetweet-popup-container'}>

                    <div className="usersettings-popup-close">
                        <button onClick={closePopup}><i style={{fontSize: "24px"}} className="fas fa-times" /></button>
                    </div>

                    <div className="citetweet-popup-primary">
                        <div className="citetweet-popup-avatar">
                            <img style={{width: "50px", borderRadius: "50px"}} src={user.avatar}/>
                        </div>
                        <div className="muro-send-tweet-input">
                            <textarea style={{height: "70px"}} id="citetweet-textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Añade un comentario" type="text" />
                        </div>
                    </div>  


                    <div className="citetweet-popup-tweet">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img style={{width: "30px"}} src={tweet.avatar} alt="" />
                            <h4 style={{color: "white", marginLeft: "5px"}}>{tweet.name} <a style={{color: "darkgray", fontSize: "13px"}}>@{tweet.name}</a></h4>
                        </div>
                        <div style={{marginLeft: "5px", marginTop: "5px"}}>
                            <h3>{tweet.text}</h3>
                        </div>
                        {tweet.image != null && <div style={{marginTop: "10px"}}>
                            <img style={{borderRadius: "20px", maxWidth: "200px"}} src={tweet.image} />
                        </div>}
                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "60%", marginTop: "10px"}}>
                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>{isLiked ? "Cancelar Me gusta" : "Me gusta"}</h1>}>
                                <div style={{color: isLiked && "red"}} className="tweetcard-icon-like">
                                    {isLiked ? <i style={{fontSize: "14px"}} class="fas fa-heart"/> : <i style={{fontSize: "14px"}} class="far fa-heart"/>}                        <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalLikes}</p>
                                </div>
                            </Tippy>

                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>ReTwittear</h1>}>
                                    {tweet.gallery != true && <div style={{color: isRetweet && "rgb(46, 255, 60)"}} className="tweetcard-icon-retweet">
                                    <i style={{fontSize: "14px"}} class="fas fa-retweet"/>
                                    <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalRetweets}</p>
                                </div>}
                            </Tippy>
                                
                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>Compartir</h1>}>
                                <div className="tweetcard-icon-share">
                                    <i style={{fontSize: "14px"}} class="fas fa-share"/>
                                </div>
                            </Tippy>

                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>Vistas</h1>}>
                                <div className="tweetcard-icon-comment">
                                    <i style={{fontSize: "14px"}} class="fas fa-chart-bar"/>
                                    <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalViews}</p>
                                </div>    
                            </Tippy>
                        </div>
                    </div>


                    <div style={{marginTop: "20px"}}>
                        <div onClick={() => onMouseEnterEmotes()} className="mure-send-tweet-icons-card" style={{width: "33px", height: "33px",borderRadius: "100px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "5px"}}>
                            <i style={{padding: "5px", color: "#ff4aa7d2", marginRight: "5px"}} class="far fa-smile"/>
                        </div>
                        {dropdownEmotes && <div style={{position: "absolute", zIndex: "1001", marginTop: "20px"}}> 
                            <EmojiPicker
                                onEmojiClick={(e) => clickEmoji(e)}
                                autoFocusSearch={false}
                                theme={Theme.DARK}
                                searchDisabled
                                height={"300px"}
                                width="300px"
                                lazyLoadEmojis={true}
                                previewConfig={{
                                    showPreview: false
                                }}
                            />
                        </div>}
                    </div>

                    <div style={{width: "100%", height: "1px", backgroundColor: "#ffffff1a", marginTop: "10px", marginBottom: "10px"}}/>

                    <div style={{marginTop: "50px", textAlign: "right"}}>
                        <button onClick={() => handleSubmit()} className="muro-send-tweet-button">Publicar</button>
                    </div>                  

                </div>
            </div>
            

      </div>
    )

}