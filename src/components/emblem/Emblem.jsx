import React, {useState} from "react"

import "./Emblem.css"

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import EmblemDropdown from "./EmblemDropdown";


export default function Emblem({name, img, style, chat, imageWidth}) {

    const [emblemInfo, setEmblemInfo] = useState(false)
    

    return (
        <div style={style} className="emblem-img">
            <Tippy theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{name}</h1>}>
                <img onClick={() => setEmblemInfo(!emblemInfo)} style={{width: imageWidth ? imageWidth : "17px", borderRadius: "2px", position: "relative", top: "2px", cursor: "pointer", height:'17px'}} src={img} alt="" />
            </Tippy>

            <div style={{position: "absolute"}}>
                {emblemInfo && <EmblemDropdown chat={chat} close={() => setEmblemInfo(!emblemInfo)} name={name} img={img}/>}
            </div>
            
        </div>
    )
}
