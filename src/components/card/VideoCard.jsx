import React, { useEffect, useState } from "react"

import "./VideoCard.css"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { Link } from "react-router-dom"
import io from "socket.io-client";

import DropdownSettings from "../home/dropdown/DropdownSettings";
import Chat from "../channel/chat/Chat";
import { useParams } from "react-router-dom"
import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";

let socket;

export default function VideoCard(props) {
    const { streamer } = useParams();

    const [dropdownSettings, setDropdownSettings] = useState(false);

    function toggleDropdownSettings() {
        setDropdownSettings(!dropdownSettings);
    }

    function ellipsis(text, length) {
        if (text.length > length) {
            return text.substring(0, length) + "..."
        }
        return text
    }
    const [chatExpanded, setChatExpanded] = useState(false);
    const [pointGoal, setPointGoal] = useState(0);
    const [goal, setGoal] = useState(false);
    const [topGoal, setTopGoal] = useState(10000);
    const [announce, setAnnounce] = useState(false);
    

    const [userSuscripted, setUserSuscripted] = useState(false);
    const [suscribers, setSuscribers] = useState(null);
    const [time, setTime] = useState(0);
    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    let currentTime = 0;
    const history = useHistory ();
    const ENDPOINT = process.env.REACT_APP_DEV_CHAT_URL;

    useEffect(() => {
        const unlisten = history.listen(() => {

            socket.emit("removeUser", { room: streamer }, () => {
             
            });

            socket.disconnect();


        });
    
        return () => {
          unlisten();
        };

    }, [history]);
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const loadDataOnlyOnce = () => {
        const name = user.name;
        const room = streamer;
    
        socket = io(ENDPOINT);
    
        setName(name);
        setRoom(room);
    
    };
    const callbackDonation = (e) => {
        setPointGoal(pointGoal + e);
        if(pointGoal < 9999) {

            setGoal(true);
            setPointGoal(0);
            setTimeout(() => {
                setGoal(false);
            }, 4000);    
        
        }
    }
    function handleAnnounce() {
        setAnnounce(true);
    }

    useEffect(() => {
        if(announce) {
            setInterval(() => {
                let duration = 45;
                currentTime = currentTime + 1;
                setTime(parseInt(duration - currentTime));

                if(duration === currentTime) {
                    setAnnounce(false)
                }
            }, 1000)
        }
    }, [announce])

    function getCard() {
        if (props.big === true) {
            return (
                <>
                    <div style={props.style} className="videocard-body">
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: ' column', marginBottom: '10px' }}>

                            <div style={{ display: "flex", alignItems: "center", width: '100%', gap: '15px' }}>
                                <Link style={{ textDecoration: "none", cursor: "pointer" }} to={"/" + props.streamer}>
                                    <div className='videocard-streamer-image'>
                                        <img src={props.streamerImage ? props.streamerImage : "/images/pinkker-stream.png"} alt="" />
                                        {dropdownSettings && <DropdownSettings closeNavbar={() => toggleDropdownSettings()} />}
                                    </div>
                                </Link>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                    <span style={{ color: 'white', fontWeight: '800', fontSize: '24px' }}>{props.streamer}</span>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Link style={{ textDecoration: "none", cursor: "pointer" }} to={"/" + props.streamer}>
                                            <h3 style={{ fontSize: "16px", letterSpacing: "0.4px", color: 'white' }}>{ellipsis(props.title, 25)}</h3>
                                        </Link>
                                        <i class="fa fa-ellipsis-h" aria-hidden="true" style={{ backgroundColor: '#f36196', color: 'white', padding: 5, fontSize: "14px", borderRadius: '15%' }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>


                                <Link style={{ textDecoration: "none", cursor: "pointer" }} to={"/" + props.streamer}>
                                    <div style={{ display: "flex", alignItems: "center", width: '80%', marginLeft: '12%', gap: '15px' }}>
                                        {
                                            props.tags?.map((tags) => (
                                                <p style={{ fontSize: "14px", backgroundColor: '#f36196', borderRadius: '15%', paddingLeft: 15, paddingRight: 15, color: 'white' }}>{tags}</p>

                                            ))
                                        }
                                    </div>
                                </Link>
                            </div>

                        </div>

                        <div className="videocard-container">
                            <h4 className="videocard-online">EN DIRECTO</h4>
                            <h3 className="videocard-entrar">ENTRAR</h3>
                            <p style={{ color: "#ededed" }} className="videocard-spectator">{props.viewers} espectadores</p>

                            <Link style={{ textDecoration: "none", cursor: "default" }} to={"/" + props.streamer}>
                                <div className="home-categories-container-card-contain">
                                    <img style={{ width: props.isMobile ? "100%" : "290px", borderRadius: "5px" }} src={props.image ? props.image : "/images/pinkker-stream.png"} alt="" />
                                </div>
                            </Link>

                        </div>



                    </div>
                    <Chat
                        external={true}
                        isMobile={props.isMobile}
                        socket={socket}
                        socketMain={props.socketMain}
                        handleSendMessage={(e) => props.handleMessage(e)}
                        chatExpanded={() => setChatExpanded(!chatExpanded)}
                        callback={(e) => callbackDonation(e)}
                        announce={announce}
                        handleAnnounce={() => handleAnnounce()}
                        setUserSuscripted={setUserSuscripted}
                        setSuscribers={setSuscribers}
                    />
                </>

            )
        } else {
            return (
                <div style={props.style} className="videocard-body">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: ' column', marginBottom: '10px' }}>

                        <div style={{ display: "flex", alignItems: "center", width: '100%', gap: '15px' }}>
                            <Link style={{ textDecoration: "none", cursor: "pointer" }} to={"/" + props.streamer}>
                                <div className='videocard-streamer-image'>
                                    <img src={props.streamerImage ? props.streamerImage : "/images/pinkker-stream.png"} alt="" />
                                    {dropdownSettings && <DropdownSettings closeNavbar={() => toggleDropdownSettings()} />}
                                </div>
                            </Link>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                                <span style={{ color: 'white', fontWeight: '800', fontSize: '24px' }}>{props.streamer}</span>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Link style={{ textDecoration: "none", cursor: "pointer" }} to={"/" + props.streamer}>
                                        <h3 style={{ fontSize: "16px", letterSpacing: "0.4px", color: 'white' }}>{ellipsis(props.title, 25)}</h3>
                                    </Link>
                                    <i class="fa fa-ellipsis-h" aria-hidden="true" style={{ backgroundColor: '#f36196', color: 'white', padding: 5, fontSize: "14px", borderRadius: '15%' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>


                            <Link style={{ textDecoration: "none", cursor: "pointer" }} to={"/" + props.streamer}>
                                <div style={{ display: "flex", alignItems: "center", width: '80%', marginLeft: '12%', gap: '15px' }}>
                                    {
                                        props.tags?.map((tags) => (
                                            <p style={{ fontSize: "14px", backgroundColor: '#f36196', borderRadius: '15%', paddingLeft: 15, paddingRight: 15, color: 'white' }}>{tags}</p>

                                        ))
                                    }
                                </div>
                            </Link>
                        </div>

                    </div>

                    <div className="videocard-container">
                        <h4 className="videocard-online">EN DIRECTO</h4>
                        <h3 className="videocard-entrar">ENTRAR</h3>
                        <p style={{ color: "#ededed" }} className="videocard-spectator">{props.viewers} espectadores</p>

                        <Link style={{ textDecoration: "none", cursor: "default" }} to={"/" + props.streamer}>
                            <div className="home-categories-container-card-contain">
                                <img style={{ width: props.isMobile ? "100%" : "290px", borderRadius: "5px" }} src={props.image ? props.image : "/images/pinkker-stream.png"} alt="" />
                            </div>
                        </Link>

                    </div>



                </div>
            )
        }
    }


    return (
        <div>
            {getCard()}
        </div>
    )
}