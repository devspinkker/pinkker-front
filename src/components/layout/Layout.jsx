import React from "react"

import "./Layout.css"
import { useLocation } from "react-router-dom"
export default function Layout(props) {
    const location = useLocation()
    return (
        <div style={{marginLeft: props.isMobile && "0px", width: props.isMobile && "100%"}} className={props.tyExpanded ? "layout" : "layout-expanded"}>
            <div style={{height: location?.pathname == '/' && props.isMobile ? "52px" : null}}/>
            {props.children}
        </div>
    )
}