import React, {useState} from "react"

import "./FollowersCard.css"
import { useSelector } from 'react-redux'

import {follow, unfollow} from "../../../services/follow"

import { useNotification } from "../../Notifications/NotificationProvider"
import { useHistory } from 'react-router';


export default function FollowersCard({followParams, name, followMe, totalFollowers, avatar, closePopupp}) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [followParam, setFollowParam] = useState(followParams)

    const alert = useNotification();
    const routerHistory = useHistory();

    async function handleSubmit() {
        setFollowParam(true)

        const data =  await follow(token, name);
        if(data != null) {
            alert({type: "SUCCESS", message: data.data.msg})
        } else {
            alert({type: "ERROR", message: data})
        }
    }

    async function handleUnfollow() {
        setFollowParam(false)
        const data =  await unfollow(token, name);
        if(data != null) {
            alert({type: "SUCCESS", message: data.data.msg})
        } else {
            alert({type: "ERROR", message: data})
        }
    }

    const [nameD, setNameD] = useState("Siguiendo");

    function getButtonCard() {
        if(user != null) {

            if(user.name != name) {
                if(followParam === true) {
                    return (
                        <button style={{width: "100px", marginLeft: "5px", marginRight: "5px", backgroundColor: nameD === "Siguiendo" && "#762543"}} onMouseEnter={() => setNameD("Dejar de seguir")} onMouseLeave={() => setNameD("Siguiendo")} onClick={() => handleUnfollow()} className="followerscard-button-unfollow">{nameD}</button>
                    )
                }
                if(followParam === false) {
                    return (
                        <button onClick={() => handleSubmit()} className="followerscard-button">{followMe ? "Seguir tambien" : "Seguir"}</button>
                    )
                }
            } 
        }
    }

    function onClickChangeRoute(text) {
        routerHistory.push(text);
        closePopupp();
    
      }

    return (
        <div className="followerscard-body">
            <div style={{width: "13%", marginRight: "5px"}}>
                <a style={{cursor: "pointer"}} onClick={() => onClickChangeRoute("/" + name)}>
                    <img style={{width: "40px", borderRadius: "100px", marginRight: "10px"}} src={avatar} alt="" />
                </a>
                
            </div>
            <div style={{width: "25%", textAlign: "left"}}>
                <p onClick={() => onClickChangeRoute("/" + name)} style={{color: "#ededed", cursor: "pointer"}}>{name}</p>
                <p style={{color: "darkgray", fontSize: "12px"}}>{totalFollowers} seguidores</p>
            </div>
            <div style={{width: "65%", textAlign: "right"}}>
                {getButtonCard()}
            </div>
        </div>
    )
}