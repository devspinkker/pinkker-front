import React, {useState} from "react"

import "./navbarButtom.css"

import Auth from '../auth/Auth';


export default function NavbarButtom({isMobile}) {

    const [showPopupAuth, setShowPopupAuth] = useState(false);
    function togglePopupAuth() {
        setShowPopupAuth(!showPopupAuth)
      }
    

    return (
        <div className="navbar-buttom">
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between",  marginTop: "0px", width: "95%", margin: "0 auto"}}>
                <div style={{display: "flex", alignItems: "center", marginTop: "0px", width: "80%"}}>
                    <img style={{width: "65px", marginRight: "10px", marginLeft: "0px"}} src="/images/pinkker.png" alt="" />
                    <div>
                        <h5 style={{fontSize: isMobile ? "15px" : "16px"}}>¡Sube a Pinkker Prime!</h5>
                        <p style={{fontSize: isMobile ? "11px" : "14px"}}>Try Premium free for 3 months. Listen to your music offline and ad-free. Monthly subscription fee applies after. Open only to users who haven't already tried Premium. Offer excludes Family and Duo plans. </p>
                    </div>
                    
                </div>

                <div style={{width: "15%"}}>
                    <h6 onClick={() => togglePopupAuth(1)} style={{width: isMobile ? "130px": "195px", fontSize: isMobile && "9px", marginLeft: isMobile && "-20px"}} className="button-navbar-register">Conseguir 3 meses gratis</h6>
                </div>               
            </div>
            {showPopupAuth === true && <Auth typeDefault={1} closePopup={() => togglePopupAuth()}/>}

        </div>
    )
}