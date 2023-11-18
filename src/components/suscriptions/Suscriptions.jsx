import React, {useState, useEffect} from "react"

import "./Suscriptions.css"

import { useSelector } from "react-redux"


import { ScaleLoader } from "react-spinners"


export default function Suscriptions() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [type, setType] = useState(0)
    


    useEffect(() => {
        const fetchData = async () => {
          
        }

        fetchData()
    }, [token])

    function getLeftForType() {

        if(type === 0) {
            return "35px"
        }

        if(type === 1) {
            return "222px"
        }

        if(type === 2) {
            return "425px"
        }
    }

   
    return (
        <div className="suscriptions-body">
            <div style={{width: "100%", height: "50px"}} />
            <div className="suscriptions-container">
                <div>
                    <h2 style={{color: "white"}}>Compras y subscripciones</h2>
                    <div style={{width: "100%", marginTop: "20px", height: "1px", backgroundColor: "#ffffff1a", marginTop: "10px", marginBottom: "10px"}}/>
                </div>

                <div style={{width: "100%", margin: "0 auto", borderTop: "0.01em solid #2b2b2b3f"}} className="type-set">
                    <div style={{width: "150px"}} onClick={() => setType(0)} className={ type === 0 ? "type-card active" : "type-card"}>
                        <h3>Tus subscripciones</h3>
                    </div>
                    <div style={{width: "180px"}} onClick={() => setType(1)} className={ type === 1 ? "type-card active" : "type-card"}>
                        <h3>Subscripciones de regalo</h3>
                    </div>
                    <div style={{width: "170px"}} onClick={() => setType(2)} className={ type === 2 ? "type-card active" : "type-card"}>
                        <h3>Subscripciones vencidas</h3>
                    </div>   
                                        
                    <div style={{left: getLeftForType(), width: "185px"}} className="type-line"></div>
                </div>


                <div className="subscriptions-card">
                    <div>
                        <img style={{width: "100%"}} src="https://marketplace.canva.com/EAEeOQwo3jY/1/0/1600w/canva-purple-mountain-vintage-retro-twitch-banner-1NYTq34QR6I.jpg"/>
                    </div>
                    <div className="subscriptions-card-content">
                        <div style={{position: "relative", top: "-30px"}}>
                            <img style={{width: "50px"}} src={user.avatar} />

                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                <h3 style={{color: "#ededed", marginTop: "10px"}}>asd123</h3>
                                <i style={{color: "darkgray"}} class="fas fa-cog" />
                            </div>
                        </div>

                        <div style={{backgroundColor: "#202020", padding: "5px", borderRadius: "5px", color: "#ededed"}}>
                            <h3 style={{fontSize: "14px"}}><i style={{color: "#ff60b2", marginRight: "5px"}} class="fas fa-star" /> Suscripción de Nivel 1</h3>
                        </div>

                        <p style={{marginTop: "30px", color: "#ededed", fontWeight: "600", fontSize: "13.5px"}}><i style={{color: "lightblue", marginRight: "5px"}} class="fas fa-smile-wink" /> Emoticonos exclusivos</p>
                        <p style={{marginTop: "10px", color: "#ededed", fontWeight: "600", fontSize: "13.5px"}}><i style={{color: "lightblue", marginRight: "5px"}} class="fas fa-bullhorn" /> Sin anuncios</p>
                        <p style={{marginTop: "30px", color: "#ededed", fontWeight: "600", fontSize: "13.5px"}}><i style={{color: "lightblue", marginRight: "5px"}} class="fas fa-star" /> Proxima renovación: 17/3/2023</p>


                    </div>
                </div>
            </div>
        </div>
    )
}