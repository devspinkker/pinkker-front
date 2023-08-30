import React from "react"

import "./VideoCard.css"

export default function ClipsCard(props) {
    return (
        <div className="videocard-body">
            <img className="videocard-image" style={{width: "300px"}} src={props.image} alt="" />
            <div style={{display: "flex", alignItems: "center"}}>
                <img style={{width: "50px", borderRadius: "100px"}} src="https://static-cdn.jtvnw.net/jtv_user_pictures/28f0c656ebeaa732-profile_image-50x50.png" alt="" />
                <div style={{marginLeft: "10px"}}>
                    <p style={{fontSize: "12px"}}>{props.streamer}</p>
                    <p style={{fontSize: "12px"}}>{props.categorie}</p>

                </div>
            </div>
        </div>
    )
}