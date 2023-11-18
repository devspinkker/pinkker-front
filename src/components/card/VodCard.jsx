import React from "react"

import "./VodCard.css"

export default function VodCard(props) {
    return (
        <div style={{minWidth: props.width ? props.width : "250px", maxWidth: props.width ? props.width : "250px"}} className="vodcard-body">


            <div className="vodcard-container">
                <div className="vodcard-image">
                    <img className="img-video" style={{width: props.width ? props.width : "250px", borderRadius: "5px"}} src={props.image ? props.image : "https://static-cdn.jtvnw.net/previews-ttv/live_user_markitonavaja-440x248.jpg"} alt="" />
                </div>
            </div>
           
            
            <div style={{display: "flex", alignItems: "center"}}>
                <div style={{textAlign: "left"}}>
                    <h3 style={{ fontSize: "13px", fontFamily: "Roboto", fontWeight: "600"}}>{props.title}</h3>
                    <p className="pink-hover" style={{fontSize: "12px", margin: "5px auto"}}>{props.categorie}</p>
                   
                </div>
            </div>
        </div>
    )
}