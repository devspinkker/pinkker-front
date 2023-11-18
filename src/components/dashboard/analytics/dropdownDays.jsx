import React from "react"

import "./DropdownDays.css"

export default function DropdownDays({setDays}) {
    return (
        <div className="dropdowndays-body">
            <p onClick={() => setDays(28)}>Ultimos 28 días</p>
            <p onClick={() => setDays(15)}>Ultimos 15 días</p>
            <p onClick={() => setDays(7)}>Ultimos 7 días</p>
            <p onClick={() => setDays(1)}>Ayer</p>

        </div>
    )
}