import React, {useState, useEffect} from "react"

import "./BetTop.css"

export default function BetTopWin({bets, betWon, betWonAmount}) {


    return (
        <div className="bettop-body">       
            <div style={{overflow: "hidden"}} className="bettopwin-container" >
                <div style={{display: "flex", alignItems: "center", width: "160%", margin: "0 auto"}}>
                    <div style={{display: "flex", overflow: "hidden", alignItems: "center", justifyContent: "center", height: "60px"}}>
                        <h2 className="bettopwin-text-animation" style={{fontSize: "26px", color: "white", fontFamily: "Poppins", position: "relative",}}>FELICITACIONES! HAS GANADO {betWonAmount} <img style={{width: "20px", marginLeft: "5px"}} src="/images/pixel.png" /></h2>
                    </div> 
                </div>
            </div>
        </div>
    )
}