import React, {useState} from "react"

import "./Card.css"

export default function Card(props) {


    return (
        <div onClick={() => props.onclick} style={{backgroundColor: props.color}} className="streammanager-atajos-card">
            <h4 style={{padding: "10px", fontSize: "13px", color: "#ededed"}}>{props.name}</h4>
        </div>
    )
}