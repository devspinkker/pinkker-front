import React, {useState, useEffect} from "react"

import "./BetTop.css"

export default function BetTop({bets, betWon, handleBet}) {

    const [title, setTitle] = useState(true);

    const [expanded, setExpanded] = useState(false);

    const [width, setWidth] = useState("100%");
    const [time, setTime] = useState(bets.minParticipate * 60);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const endDate = new Date(bets.dateClose);
            const diff = endDate.getTime() - now.getTime();
            //get the time left all in seconds
            let diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);
            let diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
            if(diffMinutes > 0){
                diffSeconds += diffMinutes * 60;
            }    
    
            if(diffSeconds <= 0) {
                setTime(0);
                return 0;
            }
            setTime(parseInt(diffSeconds))
        }, 1000);
        return () => clearInterval(interval);
    }, []);




    useEffect(() => {
        if(time == 0) {
            setWidth("0%")
        } else {
            console.log(width)
            setWidth(`${((time * 100) / 60) / bets.minParticipate}%`)
        }
    }, [time]);


    useEffect(() => {
        const interval = setInterval(() => {
            if(title == true) {
                setTitle(false)
            } else {
                setTitle(true)
            }
        }, 7000);
        return () => clearInterval(interval);
    }, [title]);


    function getType() {
        if(bets != null && bets != undefined) {
            if(bets.status === "OPEN") {
                return (
                    <div onClick={() => setExpanded(!expanded)} style={{height: expanded && "108px"}} className="bettop-container" >
                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "90%", margin: "0 auto"}}>
                            <div>
                                <p style={{fontSize: "11.5px", color: "darkgray", position: "relative", top: "-5px", fontWeight: "600"}}>Ahora puedes realizar apuestas</p>
                                
                                {title ? <h3 className="bettop-text-animation"> {bets.title} </h3> : <h3 className="bettop-text-animation" style={{display: "flex", alignItems: "center"}}>
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", height: "15px", fontSize: "13px", backgroundColor: "#8b1919", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>1</p>
                                    {bets.poolOne} 
                                    vs.
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", marginLeft: "5px", height: "15px", fontSize: "13px", backgroundColor: "#19198b", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>2</p>
                                    {bets.poolTwo}
                                </h3>}
                                
                            </div>
                            <div>
                                <button onClick={() => handleBet()} className="bettop-button">Apostar</button>
                            </div>
                        </div>

                        {expanded && <div style={{width: "100%", height: "1px", backgroundColor: "#ffffff1a", marginTop: "15px", marginBottom: "15px"}}/>}

                        {expanded && <div style={{width: "90%", margin: "0 auto", transition: "2s all"}}>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <h5>1. {bets.resultOne}</h5>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", height: "15px", fontSize: "13px", backgroundColor: "#8b1919", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>1</p>
                                    <h5>{bets.poolOne}</h5>
                                </div>
                            </div>
                            <div style={{display: "flex", marginTop: "5px", alignItems: "center", justifyContent: "space-between"}}>
                                <h5>2. {bets.resultTwo}</h5>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", marginLeft: "5px", height: "15px", fontSize: "13px", backgroundColor: "#19198b", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>2</p>
                                    <h5>{bets.poolTwo}</h5>
                                </div>
                            </div>
                        </div>}
                    </div>
                )
            }

            if(bets.status === "CLOSED") {
                return (
                    <div onClick={() => setExpanded(!expanded)} style={{height: expanded && "108px"}} className="bettop-container" >
                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "90%", margin: "0 auto"}}>
                            <div>
                                <p style={{fontSize: "11.5px", color: "darkgray", position: "relative", top: "-5px", fontWeight: "600"}}>Las apuestas estan cerradas</p>
                                
                                {title ? <h3 className="bettop-text-animation"> {bets.title} </h3> : <h3 className="bettop-text-animation" style={{display: "flex", alignItems: "center"}}>
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", height: "15px", fontSize: "13px", backgroundColor: "#8b1919", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>1</p>
                                    {bets.poolOne} 
                                    vs.
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", marginLeft: "5px", height: "15px", fontSize: "13px", backgroundColor: "#19198b", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>2</p>
                                    {bets.poolTwo}
                                </h3>}
                                
                            </div>
                            <div>
                                <button style={{width: "115px"}} onClick={() => handleBet()} className="bettop-button">Ver resultados</button>
                            </div>
                        </div>

                        {expanded && <div style={{width: "100%", height: "1px", backgroundColor: "#ffffff1a", marginTop: "15px", marginBottom: "15px"}}/>}

                        {expanded && <div style={{width: "90%", margin: "0 auto", transition: "2s all"}}>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <h5>1. {bets.resultOne}</h5>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", height: "15px", fontSize: "13px", backgroundColor: "#8b1919", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>1</p>
                                    <h5>{bets.poolOne}</h5>
                                </div>
                            </div>
                            <div style={{display: "flex", marginTop: "5px", alignItems: "center", justifyContent: "space-between"}}>
                                <h5>2. {bets.resultTwo}</h5>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <p className="bettop-text-animation" style={{width: "15px", marginRight: "5px", marginLeft: "5px", height: "15px", fontSize: "13px", backgroundColor: "#19198b", textAlign: "center", color: "#ededed", borderRadius: "50px"}}>2</p>
                                    <h5>{bets.poolTwo}</h5>
                                </div>
                            </div>
                        </div>}
                    </div>
                )
            }
        }
    }

    return (
        <div className="bettop-body">       
            {getType()}
            <div style={{width: width}} className="bettop-body-main"/>
        </div>
    )
}