import React, {useState} from "react"

import "./AchievementCard.css"

import AchievementRewardPopup from "../popup/AchievementRewardPopup"

export default function AchievementCard({achievement}) {


    const [showAchievementRewardPopup, setShowAchievementRewardPopup] = useState(false)

    function openAchievementRewardPopup() {
        setShowAchievementRewardPopup(!showAchievementRewardPopup)
    }

    function getWidth() {
        if(achievement.type === 0) {
            return "20%"
        }
        if(achievement.type === 1) {
            return "10%"
        }
        if(achievement.type === 2) {
            return "15%"
        }
    }

    function getMissionDescription() {
        if(achievement.type === 0) {
            return "Te faltan mirar " + achievement.missionType.amount + " horas de streaming"
        }
        if(achievement.type === 1) {
            return "Te faltan regalar " + achievement.missionType.amount + " suscripciones"
        }
        if(achievement.type === 2) {
            return "Te faltan enviar " + achievement.missionType.amount + " mensajes en el chat"
        }
    }


    return (
        <div className="achievementcard-body">
            <div className="achievementcard-image">
                <img style={{width: "125px"}} src={achievement.image} />
            </div>

            <div className="achievementcard-content">
                <h3 style={{color: "#ededed"}}>{achievement.name}</h3>
                <p style={{color: "darkgray", fontWeight: "600"}}>{achievement.description}</p>

                <div className="achievementcard-progress">
                    <div className="achievementcard-progress-bar">
                        <div className="achievementcard-progress-bar-fill" style={{width: getWidth()}}/>
                    </div>
                    <p style={{fontSize: "13px", color: "#ededed", fontWeight: "600", position: "relative", top: "-17px"}}>{getMissionDescription()}</p>
                </div>

                <div style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                    <h3 style={{color: "#ededed", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", position: "relative", top: "8px"}}>{achievement.rewardPixel} <img style={{width: "20px", marginLeft: "5px", marginRight: "10px"}} src="/images/pixel.png" /></h3>
                    <button onClick={() => openAchievementRewardPopup()} className="achievementcard-button">Reclamar</button>
                    {/*<button className="achievementcard-button-empty">Reclamar</button>*/}
                </div>
            </div>

            {showAchievementRewardPopup && <AchievementRewardPopup achievement={achievement} closePopup={() => openAchievementRewardPopup()}/>}

        </div>
    )
}