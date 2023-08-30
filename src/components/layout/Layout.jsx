import React from "react"

import "./Layout.css"

export default function Layout(props) {
    return (
        <div style={{marginLeft: props.isMobile && "0px", width: props.isMobile && "100%"}} className={props.tyExpanded ? "layout" : "layout-expanded"}>
            <div style={{height: "52px"}}/>
            {props.children}
        </div>
    )
}