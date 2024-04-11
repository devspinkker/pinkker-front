import React, {useState, useEffect} from "react"

import "./Content.css"

import Checkbox from '@mui/material/Checkbox';

import { useSelector } from "react-redux";

import { getStreamerVod, getStreamerClips } from "../../../services/vods";


export default function Content() {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [type, setType] = useState(0);

    const [streams, setStreams] = useState(null);
    const [clips, setClips] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if(token != null && token != undefined && token != "") {
                const dataLast4Vod = await getStreamerVod(user.name, 6, -1)
                if(dataLast4Vod != null && dataLast4Vod != undefined) {
                    setStreams(dataLast4Vod)
                }
    
                const dataLastClips = await getStreamerClips(user.name, 6, -1)
                if(dataLastClips != null && dataLastClips != undefined) {
                    setClips(dataLastClips)
                }
            }



        }

        fetchData()
    }, [token])

    function getLeftForType() {
        if(type === 0) {
            return "0px"
        }

        if(type === 1) {
            return "125px"
        }

    }
    


    function getType() {


        if(type === 0) {
            return (
                <div className="dashboard-content-type">
    
                    <div className="dashboard-content-card-primary">
                        <div className="dashboard-content-card-checkbox">
                            <Checkbox style={{color: "white"}} />
                        </div>
                        <div className="dashboard-content-card-video">
                            <h3 style={{fontSize: "14px"}}>Video</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Visibilidad</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Restricciones</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Fecha</h3>
                        </div>
                        
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Vistas</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Comentarios</h3>
                        </div>
                    </div>
    
    
                    {streams && streams.map((stream) => <div className="dashboard-content-card">
                        <div className="dashboard-content-card-checkbox">
                            <Checkbox style={{color: "white"}} />
                        </div>
                        <div className="dashboard-content-card-video">
                            <img style={{width: "125px"}} src="https://res.cloudinary.com/pinkker/image/upload/v1644524261/min/cjpje0wof5sq0m6vbufz.png"/>
                            <p style={{position: "relative", backgroundColor: "rebeccapurple", width: "0px", left: "-35px", top: "25px", fontSize: "13px"}}>00:25</p>
                            <div style={{marginLeft: "10px"}}>
                                <p style={{fontSize: "14px"}}>{stream.stream_title}</p>
                                <p style={{fontSize: "14px", color: "#f36196"}}>{stream.stream_category}</p>
                            </div>
                        
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px"}}><i class="fas fa-low-vision"/> No listado</p>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px"}}>Ninguna</p>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px"}}>31 ene 2022</p>
                        </div>
                        
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px", color: "#f36196"}}>{stream.views}</p>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px", color: "#f36196"}}>0</p>
                        </div>
                    </div>)}
    
    
                    
                </div>
            )
        }


        if(type === 1) {
            return (
                <div className="dashboard-content-type">
    
                    <div className="dashboard-content-card-primary">
                        <div className="dashboard-content-card-checkbox">
                            <Checkbox style={{color: "white"}} />
                        </div>
                        <div className="dashboard-content-card-video">
                            <h3 style={{fontSize: "14px"}}>Video</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Visibilidad</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Creado por</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Fecha</h3>
                        </div>
                        
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Vistas</h3>
                        </div>

                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Likes</h3>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <h3 style={{fontSize: "14px"}}>Comentarios</h3>
                        </div>
                    </div>
    
    
                    {clips && clips.map((stream) => <div className="dashboard-content-card">
                        <div className="dashboard-content-card-checkbox">
                            <Checkbox style={{color: "white"}} />
                        </div>
                        <div className="dashboard-content-card-video">
                            <img style={{width: "50px"}} src={stream.cover}/>
                            <div style={{marginLeft: "10px"}}>
                                <p style={{fontSize: "14px"}}>{stream.clipName}</p>
                                <p style={{fontSize: "14px", color: "#f36196"}}>{stream.stream.stream_category}</p>
                            </div>
                        
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px", color: "white"}}><i class="fas fa-eye"/> Visible</p>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px", color: "lightblue"}}>{stream.name}</p>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px"}}>31 ene 2022</p>
                        </div>
                        
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px", color: "#f36196"}}>{stream.views}</p>
                        </div>
    
                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px", color: "#f36196"}}>{stream.totalLikes}</p>
                        </div>

                        <div className="dashboard-content-card-visibility">
                            <p style={{fontSize: "14px", color: "#f36196"}}>{stream.totalComments}</p>
                        </div>
                    </div>)}
    
    
                    
                </div>
            )
        }

        
    }


    return (
        <div className="dashboard-content-body">
            <div className="dashboard-content-container">
                <div className="dashboard-content-title">
                    <h3>Contenido del canal</h3>
                </div>

                <div style={{width: "100%", margin: "20px auto", borderTop: "0.01em solid #2b2b2b3f"}} className="type-set">
                    <div onClick={() => setType(0)} className={ type === 0 ? "type-card active" : "type-card"}>
                        <h3>STREAMS</h3>
                    </div>
                    <div onClick={() => setType(1)} className={ type === 1 ? "type-card active" : "type-card"}>
                        <h3>CLIPS</h3>
                    </div>
                    <div style={{left: getLeftForType()}} className="type-line"></div>
                </div>


                {getType()}

            </div>
        </div>
    )
}