import React, {useState, useEffect} from "react"

import "./Activity.css"

import { useSelector } from "react-redux"

import { getStreamUserActivity } from "../../../../services/stream"

export default function Activity() {

    const [activity, setActivity] = useState(null)

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    useEffect(() => {
        if(token != null && token != undefined && token != '') {

            const fetchData = async () => {
                const response = await getStreamUserActivity(token)
                setActivity(response)

                setInterval(() => {
                    reloadData()
                } , 30000)
            }

            fetchData()

        }
    }, [token])

    const reloadData = () => {
        if(token != null && token != undefined && token != '') {

            const fetchData = async () => {
                const response = await getStreamUserActivity(token)
                setActivity(response)
            }

            fetchData()

        }
    }




    function timeSince(date) {

        const date2 = new Date(date).getTime();

        var seconds = Math.floor((new Date().getTime() - date2) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " años";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " meses";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + "d";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + "h";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + "m";
        }
        return Math.floor(seconds) + "s";
    }


    function getCards(item) {
        if(item.type.type === 0) {
            return (
                <div className="activity-card-follow">
                    <i style={{color: "#ff60b2", fontSize: "13px"}} class="fas fa-heart"/>
                    <h4 style={{color: "#ededed", marginLeft: "10px"}}>{item.name} <a style={{color: "darkgray"}}>•</a> <a style={{fontSize: "14px"}}>Te sigue</a></h4>
                    <p style={{color: "darkgray", marginLeft: "5px"}}>• {timeSince(item.createdAt)}</p>
                </div>
            )
        }

        if(item.type.type === 1) {
            return (
                <div className="activity-card-follow">
                    <i style={{color: "gold", fontSize: "13px"}} class="fas fa-parachute-box"/>
                    <h4 style={{color: "#ededed", marginLeft: "10px"}}>test123 <a style={{color: "darkgray"}}>•</a> <a style={{fontSize: "14px"}}>Te ha hecho un raid con 1 espectador</a></h4>
                    <p style={{color: "darkgray", marginLeft: "5px"}}>• ayer</p>
                </div>
            )
        }

        if(item.type.type === 2) {
            return (
                <div className="activity-card-follow">
                    <img style={{width: "16px"}} src="/images/pixel.png" />
                    <h4 style={{color: "#ededed", marginLeft: "6px"}}>test123 <a style={{color: "darkgray"}}>•</a> <a style={{fontSize: "14px"}}>Ha enviado una donación de 200 pixeles</a></h4>
                    <p style={{color: "darkgray", marginLeft: "5px"}}>• ayer</p>
                </div>
            )
        }
        if(item.type.type === 3) {
            return (
                <div className="activity-card-follow">
                    <i style={{color: "#606aff", fontSize: "13px"}} class="fas fa-star"/>
                    <h4 style={{color: "#ededed", marginLeft: "10px"}}>test123 <a style={{color: "darkgray"}}>•</a> <a style={{fontSize: "14px"}}>Se ha suscrito durante 1 mes en el nivel 1</a></h4>
                    <p style={{color: "darkgray", marginLeft: "5px"}}>• ayer</p>
                </div>
            )
        }
        if(item.type.type === 4) {
            return (
                <div className="activity-card-follow">
                    <i style={{color: "#ff6060", fontSize: "13px"}} class="fas fa-gift"/>
                    <h4 style={{color: "#ededed", marginLeft: "10px"}}>test123 <a style={{color: "darkgray"}}>•</a> <a style={{fontSize: "14px"}}>Ha regalado 5 suscripciones de comunidad</a></h4>
                    <p style={{color: "darkgray", marginLeft: "5px"}}>• ayer</p>
                </div>
            )
        }
        
    }

    return (
        <div className="streammanager-activity">
            <div style={{ backgroundColor: "transparent", padding: "10px", color: "#ededed", borderBottom: "1px solid #2b2b2b8f"}}>
                <h5>Fuente de actividades</h5>
            </div>

            <div style={{height: "300px", overflow: "scroll", overflowX: "hidden"}}>
                {activity && activity.map((item) => getCards(item))}

            </div>
        </div>
    )
}