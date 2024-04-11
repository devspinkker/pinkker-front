import React, {useState, useEffect} from "react"

import "./Achievement.css"

import AchievementCard from "./card/AchievementCard"

import { getLogros } from "../../services/logros"

import { useSelector } from "react-redux"

import { ScaleLoader } from "react-spinners"


export default function Achievement() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [logros, setLogros] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            const data = await getLogros(token)
            if(data != null && data != undefined) {
                setLogros(data)
            }
        }

        fetchData()
    }, [token])


    return (
        <div className="achievement-body">
            <div style={{height: "100px"}}/>
            <div className="achievement-container">

                <div className="achievement-title">
                    <img style={{width: "100px"}} src="/images/pinkker-box.png"/>
                    <div>
                        <h1>Recompensas de <img style={{width: "120px", position: "relative", top: "5px"}} src="/images/logo.png"/></h1>
                        <h2 style={{color: "lightgray"}}>SISTEMA DE RECOMPENSA</h2>
                    </div>
                </div>

                <div className="achievement-card-container">
                    {logros ? logros.map((logro) => <AchievementCard achievement={logro}/>) : <div style={{display: "flex", marginTop: "50px", alignItems: "center", justifyContent: "center"}}><ScaleLoader color="#ff60b2"/></div>}
                </div>

            </div>

        </div>
    )
}