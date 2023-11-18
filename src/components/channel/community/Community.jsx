import React, {useState, useEffect} from "react"

import "./Community.css"

import { useSelector } from "react-redux"

import Draggable from 'react-draggable';


export default function Community() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)


    const renderProfile = () => {
        return (
            <Draggable bounds="parent" style={{zIndex: "99999"}}>
                <div className="channel-community-profile">
                    <div className="channel-community-profile-container">
                        <div className="channel-community-profile-title">
                            <h3>MI PERFIL</h3> 
                        </div>
                        
                        <div style={{width: "90%", margin: "10px auto", height: "1px", backgroundColor: "black", marginTop: "10px", marginBottom: "10px"}}/>
                    
                        <div className="channel-comunnity-profile-content">
                            <h3 style={{display: "flex", alignItems: "center"}}>{user.name}<div style={{backgroundColor: "red", height: "10px", width: "10px", borderRadius: "10px", marginLeft: "5px"}}/></h3>
                            <p style={{color: "darkgray"}}>{user.biography}</p>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <p style={{width: "50%"}}>Cuenta creada el 5 de marzo del 2022</p>
                                <img src={user.lookImage} alt="" />
                            </div>
                        </div>

                        <div style={{width: "90%", margin: "10px auto", height: "1px", backgroundColor: "black", marginTop: "10px", marginBottom: "10px"}}/>
                        
                        <div style={{display: "flex", width: "90%", margin: "0 auto", justifyContent: "space-between"}}>
                            <button style={{marginTop: "0"}} className="channel-bottom-v2-button-follow">Seguir</button>
                        </div>

                        <div style={{width: "90%", margin: "10px auto", height: "1px", backgroundColor: "black", marginTop: "10px", marginBottom: "10px"}}/>

                        
                        <div className="channel-community-profile-tags">
                            <h4 className="video-tag gray-button">#IRL</h4>
                            <h4 className="video-tag gray-button">#NEW</h4>

                        </div>
                    </div>
                </div>
            </Draggable>
            
        )
    }


    const renderBadges = () => {
        return (
            <Draggable bounds="parent" style={{zIndex: "99999"}}>
                <div className="channel-community-badges">
                    <div className="channel-community-badges-container">
                        <div className="channel-community-badges-title">
                            <h3>BADGES</h3> 
                        </div>
                        
                        <div style={{width: "90%", margin: "10px auto", height: "1px", backgroundColor: "black", marginTop: "10px", marginBottom: "10px"}}/>
                    
                        <div className="channel-community-badges-card-container">
                            <div className="channel-community-badges-card">
                                <img src="https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/2" />
                            </div>

                            <div className="channel-community-badges-card">
                                <img src="https://static-cdn.jtvnw.net/badges/v1/0ef07070-2130-4d34-ae4d-a912676eeba6/2" />
                            </div>

                            <div className="channel-community-badges-card">
                                <img src="https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/2" />
                            </div>

                            <div className="channel-community-badges-card">
                                <img src="https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/2" />
                            </div>

                            <div className="channel-community-badges-card">
                                <img src="https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/2" />
                            </div>

    
                        </div>
                    </div>
                </div>
            </Draggable>
            
        )
    }


    const renderFollowers = () => {
        return (
            <Draggable bounds="parent" style={{zIndex: "99999"}}>
                <div className="channel-community-badges">
                    <div className="channel-community-badges-container">
                        <div className="channel-community-badges-title">
                            <h3>SEGUIDORES</h3> 
                        </div>
                        
                        <div style={{width: "90%", margin: "10px auto", height: "1px", backgroundColor: "black", marginTop: "10px", marginBottom: "10px"}}/>
                    
                        <div className="channel-community-followers-card-container">
                            {user.followers && user.followers.map(follower => <div style={{maxWidth: "150px", minWidth: "150px"}} className='dashboard-community-card'>
                                <div className='dashboard-community-card-image'>
                                    <img src={follower.avatar} />
                                </div>
                                <div className='dashboard-community-card-image'>
                                    <h4 style={{color: "white"}}>{follower.name}</h4>
                                </div>
                            
                            </div>)}
                        </div>
                        
                    </div>
                </div>
            </Draggable>
            
        )
    }


    const renderDonations = () => {
        return (
            <Draggable  bounds="parent" style={{zIndex: "99999"}}>
                <div className="channel-community-badges">
                    <div className="channel-community-badges-container">
                        <div className="channel-community-badges-title">
                            <h3>MAYOR DONACIONES</h3> 
                        </div>
                        
                        <div style={{width: "90%", margin: "10px auto", height: "1px", backgroundColor: "black", marginTop: "10px", marginBottom: "10px"}}/>
                    
                        <div style={{backgroundColor: "#f36196"}} className="message-chat-donation">
                            <div>
                                <img style={{width: "50px", position: "relative", top: "-5px"}} src={user.lookImage} />
                            </div>
                            <div style={{fontFamily: "Poppins", textShadow: "1px 2px 0px rgba(0,0,0,0.5)", color: "white"}}>
                                {user.name} ha donado 3000 PXL!
                                <p style={{color: "#ededed", fontSize: "14px"}}>test de donacion</p>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </Draggable>
            
        )
    }


    const renderComments = () => {
        return (
            <Draggable bounds="parent" style={{zIndex: "99999"}}>
                <div className="channel-community-profile">
                    <div className="channel-community-profile-container">
                        <div className="channel-community-badges-title">
                            <h3>COMENTARIOS</h3> 
                        </div>
                        
                        <div style={{width: "90%", margin: "10px auto", height: "1px", backgroundColor: "black", marginTop: "10px", marginBottom: "10px"}}/>
                    
                        <div className="channel-community-comments-content">
                            <div style={{backgroundColor: "#161616"}} className="message-chat-donation">
                                <div>
                                    <img style={{width: "50px", position: "relative", top: "-5px"}} src={user.lookImage} />
                                </div>
                                <div style={{fontFamily: "Poppins", textShadow: "1px 2px 0px rgba(0,0,0,0.5)", color: "white"}}>
                                    {user.name}
                                    <p style={{color: "#ededed", fontSize: "14px"}}>test de comentario</p>
                                </div>
                                
                            </div>
                        </div>


                        <div className="channel-community-comments-input">
                            <input type="text" placeholder="Hacer un comentario.." />
                        </div>
                        
                    </div>
                </div>
            </Draggable>
            
        )
    }


    return (
        <div className="channel-community-body">
            <div className="channel-community-container">
                {renderProfile()}
                {renderBadges()}
                {renderFollowers()}
                {renderDonations()}
                {renderComments()}
            </div>
        </div>
    )
}