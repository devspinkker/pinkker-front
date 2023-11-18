import React, {useState, useEffect} from 'react';

import "./EmoteDropdown.css";

import { ScaleLoader } from "react-spinners"

import Tippy from '@tippyjs/react';

import { useSelector } from 'react-redux';

import { userFollowUser } from '../../../../../services/follow';


export default function EmoteDropdown({ name, img, close, chat, streamer }) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [followParam, setFollowParam] = useState(false)
    const [hoverFollow, setHoverFollow] = useState(false);
    const [hoverSubscriber, setHoverSubscriber] = useState(false);

    useEffect(() => {

        setFollowParam(false);


        const fetchData = async () => {
            if(user.name != streamer) {
                const dataFollowParam = await userFollowUser(token, streamer);
                if(dataFollowParam != null && dataFollowParam != undefined) {
                    setFollowParam(dataFollowParam.data);
                }
            }
        }

        fetchData()
    }, [token] )
    
    function getEmblemUser() {
        if(name.includes("pinkker")) {
            return <p style={{color: "darkgray", fontSize: "13px", fontWeight: "600", marginTop: "3px"}}>Emote global de Pinkker</p>
        } else {
            return <div>
                <p style={{color: "darkgray", fontSize: "13px", fontWeight: "600", marginTop: "3px", marginBottom: "20px"}}>Emote de suscripción de {streamer}</p>
            </div>
        }
    }

    function getFollowButton() {
        if(followParam === false) {
            return (
                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Empezar a seguir</h1>}>
                    <button className="channel-bottom-v2-button-follow">Seguir</button>    
                </Tippy>
            )
        } else {
            return (
                <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Dejar de seguir</h1>}>
                    <button
                        onMouseEnter={() => setHoverFollow(true)} 
                        onMouseLeave={() => setHoverFollow(false)}  
                        style={{width: "35px", backgroundColor: "#252525"}} 
                        className="channel-bottom-v2-button-follow">{hoverFollow ? <i class="fas fa-heart-broken"/> : <i class="fas fa-heart"/>}</button>    
                </Tippy>
            )
        }
    }


    return (
        <div style={{top: chat ? "170px" : "-250px"}} className='emoteinfo-body'>
            <div className='emoteinfo-container'>
                <div style={{backgroundColor: "#101010", padding: "10px", height: "0px", position: "relative", top: "5px"}} className='emoteinfo-close'>
                    <i onClick={() => close()} style={{cursor: "pointer", color: "#ededed", fontSize: "16px"}} class="fas fa-times"/>
                </div>
                <div style={{display: "flex", backgroundColor: "#101010", padding: "10px", marginBottom: name.includes("pinkker") && "10px"}}>
                    <div style={{textAlign: "center"}}>
                        <img style={{width: "42px"}} src={img} alt="" />
                    </div>

                    <div style={{color: "#ededed", marginLeft: "20px"}}>
                        <h3 style={{fontFamily: "Poppins", fontSize: "15px"}}>{name}</h3>
                        {getEmblemUser()}
                    </div>
                </div>

                {!name.includes("pinkker") && <div style={{height: "75px", marginTop: "10px", marginBottom: "10px", padding: "10px"}}>
                    <h3 style={{color: "#f36196", fontWeight: "800"}}><i class="fas fa-video"/> {streamer}</h3>
                    <p style={{fontSize: "13px", color: "darkgray", marginTop: "5px"}}>Te has suscrito a {streamer}. ¡Disfruta del emoticono!</p>
                    <div style={{display: "flex"}}>
                        {getFollowButton()}
                        <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Suscribirse al canal</h1>}>
                            <button style={{marginLeft: "5px"}} onMouseEnter={() => setHoverSubscriber(true)} onMouseLeave={() => setHoverSubscriber(false)} className="channel-bottom-v2-button-sub"><i style={{marginRight: "5px"}} class={hoverSubscriber ? "fas fa-star" : "far fa-star"}/> Suscribirse</button>    
                        </Tippy>
                    </div>
                </div>}
                
            </div>
        </div>
    )

}