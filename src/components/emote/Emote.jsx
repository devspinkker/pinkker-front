import React from "react";

import "./Emote.css"
import Tippy from '@tippyjs/react';

export default function Emote({name, image}) {
    return (
        <div className="emote-body">
            <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>{name}</h1>}>
                <img src={image}/>
            </Tippy>
        </div>
    )
}