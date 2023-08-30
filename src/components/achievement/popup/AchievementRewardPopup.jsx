import React, {useState, useEffect} from "react"

import "./AchievementRewardPopup.css"

import { useSelector } from 'react-redux'


import { useNotification } from "../../Notifications/NotificationProvider"
import { ScaleLoader } from "react-spinners"


export default function AchievementRewardPopup({ closePopup, achievement }) {

    const auth = useSelector(state => state.auth)
    const {user, isAdmin} = auth
    const token = useSelector(state => state.token)

    const alert = useNotification()


    return (
        <div className='achievementreward-popup-body'>
            
            <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center"}}>
                
                <div className={'achievementreward-popup-container'}>

                    <div className="usersettings-popup-close">
                        <button onClick={closePopup}><i style={{fontSize: "24px"}} className="fas fa-times" /></button>
                    </div>

                    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <img style={{width: "350px"}} src="/images/box-animation.gif" />
                    </div>
                    
                    <div style={{textAlign: "center", color: "#ededed"}}>
                        <h2>Felicitaciones!</h2>
                        <h3 style={{color: "lightgray"}}>Has desbloqueado una recompensa</h3>

                        <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}>
                            <img style={{width: "30px", marginRight: "5px"}} src="/images/pixel.png"/>
                            <h3>{achievement.rewardPixel}</h3>
                        </div>
                        
                    </div>


                </div>
            </div>
      </div>
    )

}