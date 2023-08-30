import React, {useState, useEffect} from "react"

import "./TweetCard.css"

import { like, retweet } from "../../../services/tweet"

import { useSelector } from "react-redux"

import ViewTweet from "../popup/ViewTweet"
import CiteTweet from "../popup/CiteTweet"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import DropdownReTweet from "./DropdownReTweet"

import { useNotification } from "../../Notifications/NotificationProvider"

export default function TweetCard({tweet}) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [isLiked, setIsLiked] = useState(null);
    const [isRetweet, setIsRetweet] = useState(null);

    const [likes, setLikes] = useState(null);

    const [popupTweetView, setPopupTweetView] = useState(false)
    const [popupCiteTweet, setPopupCiteTweet] = useState(false)

    const [showDropdownRetweet, setShowDropdownRetweet] = useState(false)

    const alert = useNotification()


    function togglePopupTweetView() {
        setPopupTweetView(!popupTweetView)
    }

    function togglePopupCiteTweet() {
        setPopupCiteTweet(!popupCiteTweet)
    }

    function toggleShowDropdownRetweet() {
        setShowDropdownRetweet(!showDropdownRetweet)
    }


    useEffect(() => {
        setIsLiked(tweet.likedByMe)
        setIsRetweet(tweet.retweetByMe)
    }, [])


    async function handleLike() {
        
        if(isLiked) {
            setIsLiked(false);
            tweet.totalLikes = tweet.totalLikes - 1;
        } else {
            setIsLiked(true);
            tweet.totalLikes = tweet.totalLikes + 1;
        }

        await like(token, tweet._id);
    }

    async function handleRetweet() {

        return alert({type: "ERROR", message: "Esta función esta desabilitada este momento!"})
        
        if(isRetweet) {
            setIsRetweet(false);
            tweet.totalRetweets = tweet.totalRetweets - 1;
        } else {
            setIsRetweet(true);
            tweet.totalRetweets = tweet.totalRetweets + 1;
        }

        setPopupCiteTweet(false)
        await retweet(token, tweet._id);
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
          return Math.floor(interval) + "d";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + "h";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + "m";
        }
        return Math.floor(seconds) + "s";
    }
    
    const [isAnimatig, setIsAnimationg] = useState(false)

    function enableLikeAnimation() {
        setIsAnimationg(true)
        /*setTimeout(() => {
            setIsAnimationg(false)
        }, 1000)*/
    }


    function getType() {
        if(tweet.citeTweet != null) {
            return (
                <div className="tweetcard-body">
                    <div onClick={() => togglePopupTweetView()} className="tweetcard-avatar">
                        <img style={{width: "40px", borderRadius: "100px", marginTop: tweet.isRetweet && "8px", position: "relative", left: "-10px"}} src={tweet.avatar}/>
                    </div>
        
                    <div className="tweetcard-primary">
                        {tweet.isRetweet === true && <p style={{position: "relative", top: "-10px", height: "8px", fontSize: "13px", color: "darkgray", marginTop: "5px"}}><i style={{fontSize: "12px"}} class="fas fa-retweet"/> Retweteado por test123</p>}
                        {tweet.isLiked === true && <p style={{position: "relative", top: "-10px", height: "8px", fontSize: "13px", color: "darkgray", marginTop: "5px"}}><i style={{fontSize: "12px", marginRight: "3px"}} class="fas fa-heart"/> test123 indico que le gusta</p>}
        
                        <div style={{display: "flex", alignItems: "center"}}>
                            <h3>{tweet.name}</h3>
                            <p style={{color: "lightgray", marginLeft: "5px", fontSize: "15px"}}>@{tweet.user} · {timeSince(tweet.createdAt)}</p>     
                            {tweet.gallery === true && <p style={{color: "#f36196", marginLeft: "5px"}}>Contenido de Suscriptores</p>}
        
                        </div>
                
                        <div style={{marginTop: "5px", textAlign: "left"}}>
                            <p>{tweet.gallery ? tweet.title : tweet.text}</p>
                        </div>

                        <div className="tweetcard-citetweet">
                            <div style={{display: "flex", alignItems: "center"}}>
                                <img style={{width: "30px"}} src={tweet.citeTweet.avatar} alt="" />
                                <h4 style={{color: "white", marginLeft: "5px"}}>{tweet.citeTweet.name} <a style={{color: "darkgray", fontSize: "13px"}}>@{tweet.citeTweet.name} · {timeSince(tweet.citeTweet.createdAt)}</a></h4>
                            </div>
                            <div style={{marginLeft: "5px", marginTop: "5px"}}>
                                <h3>{tweet.citeTweet.text}</h3>
                            </div>
                            {tweet.citeTweet.image != null && <div style={{marginTop: "10px"}}>
                                <img style={{borderRadius: "20px", maxWidth: "200px"}} src={tweet.citeTweet.image} />
                            </div>}
                        </div>
        
                        
        
                        {tweet.image != null && <div style={{marginTop: "10px"}}>
                            <img style={{borderRadius: "20px", maxWidth: "350px"}} src={tweet.image} alt="" />
                        </div>}
        
                        {tweet.gallery === true && <div style={{marginTop: "10px"}}>
                            <img style={{borderRadius: "20px", maxWidth: "350px"}} src={tweet.photo} alt="" />
                        </div>}
        
                        <div className="tweetcard-icons">
        
                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>Responder</h1>}>
                                <div className="tweetcard-icon-comment">
                                    <i style={{fontSize: "14px"}} class="far fa-comment"/>
                                    <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalComments}</p>
                                </div>    
                            </Tippy>
                            
        
                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>ReTwittear</h1>}>
                                {tweet.gallery != true && <div onClick={() => toggleShowDropdownRetweet()} style={{color: isRetweet && "rgb(46, 255, 60)"}} className="tweetcard-icon-retweet">
                                    <i style={{fontSize: "14px"}} class="fas fa-retweet"/>
                                    <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalRetweets}</p>
                                </div>}
                            </Tippy>
                            {showDropdownRetweet === true && <DropdownReTweet reTweet={() => handleRetweet()} citeTweet={() => setPopupCiteTweet(true)} closePopup={() => toggleShowDropdownRetweet()} />}
        
        
                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>{isLiked ? "Cancelar Me gusta" : "Me gusta"}</h1>}>
                                <div onClick={() => handleLike()} style={{color: isLiked && "red"}} className="tweetcard-icon-like">
                                    {isLiked ? <i style={{fontSize: "14px"}} class="fas fa-heart"/> : <i style={{fontSize: "14px"}} class="far fa-heart"/>}
                                    <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalLikes}</p>
                                </div>
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
        
                    {popupTweetView === true && <ViewTweet isRetweet={isRetweet} isLiked={isLiked} tweet={tweet} closePopup={() => togglePopupTweetView()} />}
                    {popupCiteTweet === true && <CiteTweet isRetweet={isRetweet} isLiked={isLiked} tweet={tweet} closePopup={() => togglePopupCiteTweet()} />}
        
                </div>
            )
        }

        return (
            <div className="tweetcard-body">

                <div onClick={() => togglePopupTweetView()} className="tweetcard-container">
                    <div className="tweetcard-avatar">
                        <img style={{width: "40px", borderRadius: "100px", marginTop: tweet.isRetweet && "8px", position: "relative", left: "-10px"}} src={tweet.avatar}/>
                    </div>

                    <div className="tweetcard-primary">
                        {tweet.isRetweet === true && <p style={{position: "relative", top: "-10px", height: "8px", fontSize: "13px", color: "darkgray", marginTop: "5px"}}><i style={{fontSize: "12px"}} class="fas fa-retweet"/> Retweteado por test123</p>}
                        {tweet.isLiked === true && <p style={{position: "relative", top: "-10px", height: "8px", fontSize: "13px", color: "darkgray", marginTop: "5px"}}><i style={{fontSize: "12px", marginRight: "3px"}} class="fas fa-heart"/> test123 indico que le gusta</p>}

                        <div style={{display: "flex", alignItems: "center"}}>
                            <h3>{tweet.name}</h3>
                            <p style={{color: "lightgray", marginLeft: "5px", fontSize: "15px"}}>@{tweet.user} · {timeSince(tweet.createdAt)}</p>     
                            {tweet.gallery === true && <p style={{color: "#f36196", marginLeft: "5px"}}>Contenido de Suscriptores</p>}

                        </div>


                        <div style={{marginTop: "5px", textAlign: "left"}}>
                            <p>{tweet.gallery ? tweet.title : tweet.text}</p>
                        </div>

                        

                        {tweet.image != null && <div style={{marginTop: "10px"}}>
                            <img style={{borderRadius: "20px", maxWidth: "350px"}} src={tweet.image} alt="" />
                        </div>}

                        {tweet.gallery === true && <div style={{marginTop: "10px"}}>
                            <img style={{borderRadius: "20px", maxWidth: "350px"}} src={tweet.photo} alt="" />
                        </div>}

                        <div className="tweetcard-icons">

                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>Responder</h1>}>
                                <div className="tweetcard-icon-comment">
                                    <i style={{fontSize: "14px"}} class="far fa-comment"/>
                                    <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalComments}</p>
                                </div>    
                            </Tippy>
                            

                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>ReTwittear</h1>}>
                                {tweet.gallery != true && <div onClick={() => handleRetweet()} style={{color: isRetweet && "rgb(46, 255, 60)"}} className="tweetcard-icon-retweet">
                                    <i style={{fontSize: "14px"}} class="fas fa-retweet"/>
                                    <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalRetweets}</p>
                                </div>}
                            </Tippy>
                            {showDropdownRetweet === true && <DropdownReTweet reTweet={() => handleRetweet()} citeTweet={() => setPopupCiteTweet(true)} closePopup={() => toggleShowDropdownRetweet()} />}


                            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "11px", fontFamily: "Montserrat"}}>{isLiked ? "Cancelar Me gusta" : "Me gusta"}</h1>}>
                                <div onClick={() => handleLike()} style={{color: isLiked && "red"}} className="tweetcard-icon-like">
                                    {isLiked ? <i style={{fontSize: "14px"}} class="fas fa-heart"/> : <i style={{fontSize: "14px"}} class="far fa-heart"/>}
        {/*                            <div onClick={(() => enableLikeAnimation())} class={isAnimatig ? "like-btn-svg animate" : "like-btn-svg"}></div>
        */}                            <p style={{marginLeft: "5px", fontSize: "14px"}}>{tweet.totalLikes}</p>
                                </div>
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

                </div>

                    {popupTweetView === true && <ViewTweet isRetweet={isRetweet} isLiked={isLiked} tweet={tweet} closePopup={() => togglePopupTweetView()} />}
                    {popupCiteTweet === true && <CiteTweet isRetweet={isRetweet} isLiked={isLiked} tweet={tweet} closePopup={() => togglePopupCiteTweet()} />}

            </div>
        )
    }

    return (
        <div>
            {getType()}
        </div>
        
    )
}