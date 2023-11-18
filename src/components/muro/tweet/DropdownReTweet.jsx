import React, {useState} from "react"

import "./DropdownReTweet.css"

export default function DropdownReTweet({closePopup, reTweet, citeTweet}) {
    return (
        <div className="dropdownretweet-body">
            <div className="dropdownretweet-container">
                <div onClick={() => reTweet()} className="dropdownretweet-card">
                    <i style={{fontSize: "14px", width: "25px"}} class="fas fa-retweet"/>
                    <h3>Retwitear</h3>    
                </div>
                <div onClick={() => citeTweet()} className="dropdownretweet-card">
                    <i style={{fontSize: "14px", width: "25px"}} class="fas fa-pen-square"/>
                    <h3>Citar</h3>    
                </div>
                
            </div>
        </div>
    )
}