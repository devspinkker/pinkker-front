import React, {useState} from "react"

import "./AccordionList.css"

export default function AccordionList({users, mods, vips, streamer}) {    

    const [hoverUser, setHoverUser] = useState(null);

    const [accordionStreamer, setAccordionStreamer] = useState(true);
    const [accordionMods, setAccordionMods] = useState(true);
    const [accordionVips, setAccordionVips] = useState(true);
    const [accordionUsers, setAccordionUsers] = useState(true);

    return (
        <div className="accordionlist-body">

            <div className="accordionlist-item">
                <div onClick={() => setAccordionStreamer(!accordionStreamer)} className="accordionlist-item-title">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <i style={{backgroundColor: "rgb(110, 0, 0)", padding: "3px", borderRadius: "3px", marginRight: "10px"}} class="fas fa-user-shield"></i>                        
                        <h4>Streamer</h4>
                    </div>
                    {accordionStreamer === false && <i class="fas fa-angle-down"/>}
                    {accordionStreamer === true && <i class="fas fa-angle-up"/>}

                </div>

                {accordionStreamer && <div className="accordionlist-item-content">
                    <p style={{fontSize: "14px", marginTop: "10px", color: "darkgray"}}>La persona responsable del canal y quien te ofrece el contenido más nuevo.</p>
                    <div>
                        <div onMouseLeave={() => setHoverUser(null)} className="chat-users-card">
                            <h4>{streamer}</h4>

                            <div>
                                <i style={{marginRight: "10px"}} class="fas fa-comment"/>
                                <i class="fas fa-gift"/>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>


            <div className="accordionlist-item">
                <div onClick={() => setAccordionMods(!accordionMods)} className="accordionlist-item-title">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <i style={{backgroundColor: "lightgreen", padding: "3px", borderRadius: "3px", marginRight: "10px"}} class="fas fa-bolt"></i>
                        <h4>Moderadores</h4>
                    </div>
                    {accordionMods === false && <i class="fas fa-angle-down"/>}
                    {accordionMods === true && <i class="fas fa-angle-up"/>}

                </div>

                {accordionMods && <div className="accordionlist-item-content">
                    <p style={{fontSize: "14px", marginTop: "10px", color: "darkgray"}}>Miembros de confianza que contribuyen a que nuestra comunidad siga siendo segura y divertida para todos.</p>
                    <div>
                        {mods.map((user, i) => (
                            <div onMouseLeave={() => setHoverUser(null)} className="chat-users-card" key={i}>
                                <h4 onMouseOver={() => setHoverUser(i)}>{user.name}</h4>

                                {hoverUser === i && <div>
                                <i style={{marginRight: "10px"}} class="fas fa-comment"/>
                                <i class="fas fa-gift"/>
                                
                                </div>}
                            </div>
                        ))}
                    </div>
                </div>}
            </div>


            <div className="accordionlist-item">
                <div onClick={() => setAccordionVips(!accordionVips)} className="accordionlist-item-title">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <i style={{backgroundColor: "#ff60b2", padding: "3px", borderRadius: "3px", marginRight: "10px"}} class="fas fa-gem"></i>
                        <h4>VIP de la comunidad</h4>
                    </div>
                    {accordionVips === false && <i class="fas fa-angle-down"/>}
                    {accordionVips === true && <i class="fas fa-angle-up"/>}

                </div>

                {accordionVips && <div className="accordionlist-item-content">
                    <p style={{fontSize: "14px", marginTop: "10px", color: "darkgray"}}>Miembros distinguidos de la comunidad.</p>
                    <div>
                        {vips.map((user, i) => (
                            <div onMouseLeave={() => setHoverUser(null)} className="chat-users-card" key={i}>
                                <h4 onMouseOver={() => setHoverUser(i)}>{user.name}</h4>

                                {hoverUser === i && <div>
                                <i style={{marginRight: "10px"}} class="fas fa-comment"/>
                                <i class="fas fa-gift"/>
                                
                                </div>}
                            </div>
                        ))}
                    </div>
                </div>}
            </div>


            <div className="accordionlist-item">
                <div onClick={() => setAccordionUsers(!accordionUsers)} className="accordionlist-item-title">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <i style={{backgroundColor: "#151515", padding: "3px", borderRadius: "3px", marginRight: "10px"}} class="fas fa-users"></i>
                        <h4>Espectadores</h4>
                    </div>
                    {accordionUsers === false && <i class="fas fa-angle-down"/>}
                    {accordionUsers === true && <i class="fas fa-angle-up"/>}

                </div>

                {accordionUsers && <div className="accordionlist-item-content">
                    <p style={{fontSize: "14px", marginTop: "10px", color: "darkgray"}}>Algunos espectadores y participantes del chat activos de la comunidad.</p>
                    <div>
                        {users.map((user, i) => (
                            <div onMouseLeave={() => setHoverUser(null)} className="chat-users-card" key={i}>
                                <h4 onMouseOver={() => setHoverUser(i)}>{user.name}</h4>

                                {hoverUser === i && <div>
                                <i style={{marginRight: "10px"}} class="fas fa-comment"/>
                                <i class="fas fa-gift"/>
                                
                                </div>}
                            </div>
                        ))}
                    </div>
                </div>}
            </div>


        </div>
    )
}