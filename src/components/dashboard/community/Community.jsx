import React, {useState, useEffect} from 'react';

import "./Community.css";

import { useSelector } from "react-redux";

import AddEmotePopup from './popup/AddEmotePopup';

import { getMyEmotes, deleteEmote } from '../../../services/emotes';

import { getMyEmblem } from '../../../services/emblem';

import { ScaleLoader } from "react-spinners"

import { useNotification } from '../../Notifications/NotificationProvider';
import Tippy from '@tippyjs/react';
import AddEmblemPopup from './popup/AddEmblemPopup';

export default function Community() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [addEmotePopup, setAddEmotePopup] = useState(false)
    const [addEmblemPopup, setAddEmblemPopup] = useState(false)

    const [emoteType, setEmoteType] = useState(0)

    const alert = useNotification()

    const openAddEmotePopup = (type) => {
        setEmoteType(type)
        setAddEmotePopup(!addEmotePopup)
    }

    const openAddEmblemPopup = (type) => {
        setEmoteType(type)
        setAddEmblemPopup(!addEmblemPopup)
    }

    const [emotes, setEmotes] = useState(null)

    const [emotesFree, setEmotesFree] = useState(null)
    const [emotesSubscriptions, setEmotesSubscriptions] = useState(null)
    const [emotesSubscriptionsTier2, setEmotesSubscriptionsTier2] = useState(null)

    const [emblems, setEmblems] = useState(null)
    const [emblemType0, setEmblemType0] = useState(null)
    const [emblemType1, setEmblemType1] = useState(null)
    const [emblemType2, setEmblemType2] = useState(null)
    const [emblemType3, setEmblemType3] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await getMyEmotes(token)
            if(response != null && response != undefined) {
                const freeEmotes = response.filter(emote => emote.type === 0)
                setEmotesFree(freeEmotes)

                const suscriptionEmotes = response.filter(emote => emote.type === 1)
                setEmotesSubscriptions(suscriptionEmotes)

                const suscriptionTier2Emotes = response.filter(emote => emote.type === 2)
                setEmotesSubscriptionsTier2(suscriptionTier2Emotes)

                setEmotes(response)
            }

            const responseEmblem = await getMyEmblem(token)
            if(responseEmblem != null && responseEmblem != undefined) {
                const emblemType0 = responseEmblem.filter(emote => emote.type === 0)
                setEmblemType0(emblemType0)

                const emblemType1 = responseEmblem.filter(emote => emote.type === 1)
                setEmblemType1(emblemType1)

                const emblemType2 = responseEmblem.filter(emote => emote.type === 2)
                setEmblemType2(emblemType2)

                const emblemType3 = responseEmblem.filter(emote => emote.type === 3)
                setEmblemType3(emblemType3)

                setEmblems(responseEmblem)

            }
        }
        fetchData()
    }, [token])

    async function removeEmote(emoteName) {
        console.log(token)
        const data = await deleteEmote(token, emoteName)
        if(data != null) {
            setEmotes(emotes.filter(emote => emote.name != emoteName))
            alert({type: "SUCCESS", message: data.data.msg})
        }
    }

    function handleReload() {
        const fetchData = async () => {
            const response = await getMyEmotes(token)
            if(response != null && response != undefined) {
                const freeEmotes = response.filter(emote => emote.type === 0)
                setEmotesFree(freeEmotes)

                const suscriptionEmotes = response.filter(emote => emote.type === 1)
                setEmotesSubscriptions(suscriptionEmotes)

                const suscriptionTier2Emotes = response.filter(emote => emote.type === 2)
                setEmotesSubscriptionsTier2(suscriptionTier2Emotes)

                setEmotes(response)

            }
        }
        fetchData()
    }

    return (
        <div className='dashboard-community-body'>
            <div className='dashboard-community-container'>
                <div style={{height: "100px"}}/>
                <div className="dashboard-content-title">
                    <h3>Emotes del canal</h3>
                </div>

                <div className='dashboard-content-emotes-container'>
                    <div>
                        <h3>Emotes <button onClick={() => openAddEmotePopup(0)} style={{width: "25px", cursor: "pointer", height: "25px", color: "white", backgroundColor: "#303030", border: "none", borderRadius: "3px", marginLeft: "5px"}}><i class="fas fa-plus" /></button></h3>

                        {emotes != null ? <div className='dashboard-content-emotes'>

                        {emotes && emotes.map(emote => emote.type === 0 && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{emote.name}</h1>}>
                            <div className='dashboard-content-emotes-image'>
                                <i onClick={() => removeEmote(emote.name)} style={{position: "absolute", marginLeft: "40px", marginBottom: "55px"}} class="fas fa-times" />
                                <img src={emote.image} />
                            </div>
                        </Tippy> )}

                        {/* if it doesn't exist more emotes fill with empty */}
                        {emotesFree.length < 2 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(0)} class="fas fa-plus" /></div>}
                        {emotesFree.length < 1 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(0)} class="fas fa-plus" /></div>}

                        
                        </div> : 
                        <div style={{marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <ScaleLoader color="#f36197d7" />
                        </div>
                        }
                    </div>

                    <div style={{marginTop: "50px"}}>
                        <h3>Emotes Suscripciones<button onClick={() => openAddEmotePopup(1)} style={{width: "25px", cursor: "pointer", height: "25px", color: "white", backgroundColor: "#303030", border: "none", borderRadius: "3px", marginLeft: "5px"}}><i class="fas fa-plus" /></button></h3>

                        {emotes != null ? <div className='dashboard-content-emotes'>

                        {emotes && emotes.map(emote => emote.type === 1 && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{emote.name}</h1>}>
                            <div className='dashboard-content-emotes-image'>
                                <i onClick={() => removeEmote(emote.name)} style={{position: "absolute", marginLeft: "40px", marginBottom: "55px"}} class="fas fa-times" />
                                <img src={emote.image} />
                            </div>
                        </Tippy> )}

                        {emotesSubscriptions.length < 5 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptions.length < 4 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptions.length < 3 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptions.length < 2 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptions.length < 1 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}

                        
                        
                        </div> : 
                        <div style={{marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <ScaleLoader color="#f36197d7" />
                        </div>
                        }
                    </div>

                    <div style={{marginTop: "50px"}}>
                        <h3>Emotes Suscripción 2 <button onClick={() => openAddEmotePopup(2)} style={{width: "25px", cursor: "pointer", height: "25px", color: "white", backgroundColor: "#303030", border: "none", borderRadius: "3px", marginLeft: "5px"}}><i class="fas fa-plus" /></button></h3>

                        {emotes != null ? <div className='dashboard-content-emotes'>

                        {emotes && emotes.map(emote => emote.type === 2 && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{emote.name}</h1>}>
                            <div className='dashboard-content-emotes-image'>
                                <i onClick={() => removeEmote(emote.name)} style={{position: "absolute", marginLeft: "40px", marginBottom: "55px"}} class="fas fa-times" />
                                <img src={emote.image} />
                            </div>
                        </Tippy> )}

                        {/* if it doesn't exist more emotes fill with empty */}
                        {emotesSubscriptionsTier2.length < 5 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptionsTier2.length < 4 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptionsTier2.length < 3 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptionsTier2.length < 2 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}
                        {emotesSubscriptionsTier2.length < 1 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmotePopup(2)} class="fas fa-plus" /></div>}

                        
                        </div> : 
                        <div style={{marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <ScaleLoader color="#f36197d7" />
                        </div>
                        }
                    </div>
                </div>

                <div className="dashboard-content-title">
                    <h3>Emblemas del canal</h3>
                </div>

                <div className='dashboard-content-emotes-container'>
                    <div>
                        <h3>Emblema Suscripción 2 meses</h3>

                        {emblems != null ? <div className='dashboard-content-emotes'>

                        {emblems && emblems.map(emote => emote.type === 0 && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{emote.name}</h1>}>
                            <div className='dashboard-content-emotes-image'>
                                <i onClick={() => removeEmote(emote.name)} style={{position: "absolute", marginLeft: "40px", marginBottom: "55px"}} class="fas fa-times" />
                                <img src={emote.image} />
                            </div>
                        </Tippy> )}

                        {emblemType0.length < 1 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmblemPopup(0)} class="fas fa-plus" /></div>}

                        
                        </div> : 
                        <div style={{marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <ScaleLoader color="#f36197d7" />
                        </div>
                        }
                    </div>

                    <div style={{marginTop: "20px"}}>
                        <h3>Emblema Suscripción 6 meses</h3>

                        {emblems != null ? <div className='dashboard-content-emotes'>

                        {emblems && emblems.map(emote => emote.type === 1 && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{emote.name}</h1>}>
                            <div className='dashboard-content-emotes-image'>
                                <i onClick={() => removeEmote(emote.name)} style={{position: "absolute", marginLeft: "40px", marginBottom: "55px"}} class="fas fa-times" />
                                <img src={emote.image} />
                            </div>
                        </Tippy> )}

                        {emblemType1.length < 1 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmblemPopup(1)} class="fas fa-plus" /></div>}

                        
                        </div> : 
                        <div style={{marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <ScaleLoader color="#f36197d7" />
                        </div>
                        }
                    </div>

                    <div style={{marginTop: "20px"}}>
                        <h3>Emblema Suscripción 1 año</h3>

                        {emblems != null ? <div className='dashboard-content-emotes'>

                        {emblems && emblems.map(emote => emote.type === 2 && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{emote.name}</h1>}>
                            <div className='dashboard-content-emotes-image'>
                                <i onClick={() => removeEmote(emote.name)} style={{position: "absolute", marginLeft: "40px", marginBottom: "55px"}} class="fas fa-times" />
                                <img src={emote.image} />
                            </div>
                        </Tippy> )}

                        {emblemType2.length < 1 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmblemPopup(2)} class="fas fa-plus" /></div>}

                        
                        </div> : 
                        <div style={{marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <ScaleLoader color="#f36197d7" />
                        </div>
                        }
                    </div>

                    <div style={{marginTop: "20px"}}>
                        <h3>Emblema Suscripción 2 años</h3>

                        {emblems != null ? <div className='dashboard-content-emotes'>

                        {emblems && emblems.map(emote => emote.type === 3 && <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{emote.name}</h1>}>
                            <div className='dashboard-content-emotes-image'>
                                <i onClick={() => removeEmote(emote.name)} style={{position: "absolute", marginLeft: "40px", marginBottom: "55px"}} class="fas fa-times" />
                                <img src={emote.image} />
                            </div>
                        </Tippy> )}

                        {emblemType3.length < 1 && <div className='dashboard-content-emotes-empty'><i style={{cursor: "pointer"}} onClick={() => openAddEmblemPopup(3)} class="fas fa-plus" /></div>}

                        
                        </div> : 
                        <div style={{marginTop: "30px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <ScaleLoader color="#f36197d7" />
                        </div>
                        }
                    </div>



                </div>

                <div className="dashboard-content-title">
                    <h3>Comunidad del canal</h3>
                </div>

                <div className='dashboard-community-card-container'>

                    {user.followers && user.followers.map(follower => <div className='dashboard-community-card'>
                        <div className='dashboard-community-card-image'>
                            <img src={follower.avatar} />
                        </div>
                        <div className='dashboard-community-card-image'>
                            <h4>{follower.name}</h4>
                        </div>
                        <div className='dashboard-community-card-hover'>
                            <button className="channel-bottom-v2-button-follow">Seguir</button>
                            <button  className="channel-bottom-v2-button-follow">Susurrar</button>

                        </div>
                        
                    </div>)}
                    
                </div>
            </div>

            {addEmotePopup && <AddEmotePopup emoteType={emoteType} handleReload={() => handleReload()} closePopup={openAddEmotePopup} />}
            {addEmblemPopup && <AddEmblemPopup emoteType={emoteType} handleReload={() => handleReload()} closePopup={openAddEmblemPopup} />}

        </div>
    )  
}