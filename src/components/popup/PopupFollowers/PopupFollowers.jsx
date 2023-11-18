import React, {useState, useEffect} from "react"

import {useSelector} from 'react-redux'

import "./PopupFollowers.css"

import { getUserFollowers } from "../../../services/follow"

import FollowersCard from "./Card"
import { ScaleLoader } from "react-spinners"

export default function PopupFollowers({ closePopup, streamer, typeDefault }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)
    const [type, setType] = useState(typeDefault)

    const [follow, setFollow] = useState(null);

    useEffect(() => {
        setFollow(null)
        const fetchData = async () => {
            const data = await getUserFollowers(token, streamer);
            if(data != null && data != undefined) {
                setFollow(data);
            }
        }
        fetchData();
    }, [user, type])


    function getType() {
        if(type === 0) {
            return (
                <div className="popupfollowers-content">
                    {follow && follow[0].map((following) => user.following.includes(following._id) ? 
                        <FollowersCard closePopupp={() => closePopup()} followParams={true} totalFollowers={following.totalFollowers} name={following.name} avatar={following.avatar}/> 
                        :  
                        following.following && following.following.includes(user._id) ?
                        <FollowersCard closePopupp={() => closePopup()} followParams={false} followMe={true} totalFollowers={following.totalFollowers} name={following.name} avatar={following.avatar}/> :
                        <FollowersCard closePopupp={() => closePopup()} followParams={false} followMe={false} totalFollowers={following.totalFollowers} name={following.name} avatar={following.avatar}/>)
                        }

                </div>
            )
        }

        if(type === 1) {
            return (
                <div className="popupfollowers-content">
                    {follow && follow[1].map((following) => user.following.includes(following._id) ? 
                        <FollowersCard closePopupp={() => closePopup()} followParams={true} totalFollowers={following.totalFollowers} name={following.name} avatar={following.avatar}/> 
                        :  
                        following.following && following.following.includes(user._id) ?
                        <FollowersCard closePopupp={() => closePopup()} followParams={false} followMe={true} totalFollowers={following.totalFollowers} name={following.name} avatar={following.avatar}/> :
                        <FollowersCard closePopupp={() => closePopup()} followParams={false} followMe={false} totalFollowers={following.totalFollowers} name={following.name} avatar={following.avatar}/>)
                        }
                </div>
            )
        }
    }

    function getLeftForType() {
        if(type === 0) {
            return "74px"
        }

        if(type === 1) {
            return "165px"
        }
        if(type === 2) {
            return "270px"
        }
    }

    return (
        <div className='popupfollowers-body'>
            <div className='popupfollowers-container'>
                <div style={{borderBottom: "1px solid #4b4b4b8f", paddingLeft: "30px", paddingRight: "30px", paddingTop: "10px", paddingBottom: "5px", marginTop: "-10px"}}>
                    <div style={{position: "relative", top: "5px"}} className="popupfollowers-close">
                        <button  className="pinkker-button-more" onClick={closePopup}><i class="fas fa-times"/></button>
                    </div>

                    <div style={{width: "80%", margin: "0 auto"}} className="type-set">

                        <div onClick={() => setType(0)} className={ type === 0 ? "type-card active" : "type-card"}>
                            <h3>Seguidores</h3>
                        </div>
                        <div onClick={() => setType(1)} className={ type === 1 ? "type-card active" : "type-card"}>
                            <h3>Seguidos</h3>
                        </div>
                        <div onClick={() => setType(2)} className={ type === 2 ? "type-card active" : "type-card"}>
                            <h3>Suscriptores</h3>
                        </div>

                        <div style={{left: getLeftForType()}} className="type-line"></div>
                    </div>    
                </div>
                
                <div style={{paddingLeft: "30px", paddingRight: "30px", paddingTop: "10px", paddingBottom: "10px"}}>
                    {follow ? getType() : 
                    <div style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <ScaleLoader color="#f36197d7" />
                    </div> 
                    }
                </div>
                
               
               
            </div>
      </div>
    )
}