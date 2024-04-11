import React, { useState, useEffect } from 'react';
import './SuscriptionDropdown.css';
import { Link } from 'react-router-dom';


import axios from 'axios'
import {useSelector} from 'react-redux'

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import SuscriptionConfirm from './confirm/SuscriptionConfirm';

function SuscriptionDropdown( { socket, closeNavbar, title, streamer, streamerData } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const [type, setType] = useState(0);

  const [hoverSubscriber, setHoverSubscriber] = useState(false);

  const [dropdownSuscriptionConfirm, setDropdownSuscriptionConfirm] = useState(false);

  const onMouseEnterSub = () => {
    if(dropdownSuscriptionConfirm === true) {
        setDropdownSuscriptionConfirm(false);
    } else{
        setDropdownSuscriptionConfirm(true);
    }
};


  function getdropdownsuscription() {
      if(type === 0) {
        return (
        <div>
            <div className='dropdowns-title-container' style={{borderBottom: "1px solid #4b4b4b8f"}} >
                  <div style={{display: "flex", alignItems: "center", textAlign: "center"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        <h3 style={{width: "85%"}}>Suscribirte</h3>
                        <i onClick={handleClick} style={{marginLeft: "10px", marginTop: "3px", cursor: "pointer", fontSize: "15px"}} class="fas fa-times pinkker-button-more"></i>
                  </div>
            </div> 

            <hr style={{border: "1px solid #4b4b4b8f", marginBottom: "10px", width: "100%"}}/>


            <div style={{width: "90%", margin: "0 auto"}}>

                <div className='dropdownsuscription-streamer'>
                    <div style={{width: "40%"}}>
                        <img style={{borderRadius: "200px", width: "100px"}} src={streamerData.avatar} alt="" />
                        <h5 className="channel-avatar-text" style={{color: "#ededed", textAlign: "center", padding: "2px", borderRadius: "5px", position: "relative", left: "5px", top: "-20px", width: "85px"}}>EN DIRECTO</h5>
                    </div>

                    <div style={{width: "50%"}}>
                        <h2 style={{fontFamily: "Poppins", color: "white", fontSize: "26px"}}>{streamer}</h2>
                        <p style={{color: "lightgray", fontFamily: "Poppins", fontSize: "13px"}}>{streamerData.biography}</p>
                    </div>
                </div>

                <div>
                    <h4 style={{color: "white", fontFamily: "Poppins", marginTop: "20px"}}>Como agradecimiento de {streamer}:</h4>

                    <div style={{marginTop: "15px"}}>
                        <h5 style={{color: "lightgray", fontFamily: "Poppins", marginBottom: "5px"}}>Emoticonos de suscriptor</h5>
                        <img style={{marginRight: "10px"}} src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_bc7c3aa534e74c2cbddabb459087b2db/default/dark/1.0" />
                        <img style={{marginRight: "10px"}} src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_d56cbc6a77dc43c39636cf59982e1119/default/dark/1.0" />
                        <img src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_e1c18aaf72e64d8d93631b76c47c1c26/default/dark/1.0" />

                    </div>

                    <div style={{marginTop: "15px"}}>
                        <h5 style={{color: "lightgray", fontFamily: "Poppins", marginBottom: "5px"}}>Emblemas de suscriptor para lucir en al chat y fardar del tiempo que llevas aquí</h5>
                        <img style={{marginRight: "10px"}} src="https://static-cdn.jtvnw.net/badges/v1/62f1c43a-835b-4a90-8d75-c4a1d47260a1/2" />
                        <img style={{marginRight: "10px"}} src="https://static-cdn.jtvnw.net/badges/v1/02c1b948-58fd-4335-abea-009d877ef658/2" />

                    </div>
                </div>


                <div>
                    <h4 style={{color: "white", fontFamily: "Poppins", marginTop: "20px"}}>Y no olvides..</h4>

                    <div style={{marginTop: "10px", display: "flex", alignItems: "center"}}>
                        <div style={{textAlign: "center"}}>
                            <img style={{width: "25px"}} src="/images/pinkker.png" />
                            <p style={{color: "lightgray", fontSize: "12px", marginRight: "5px"}}>1,2x puntos de canal</p>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <i style={{fontSize: "12px", color: "white", width: "25px", height: "26px"}} class="fas fa-photo-video"/>
                            <p style={{color: "lightgray", fontSize: "12px", marginRight: "5px"}}>Visualización sin anuncios</p>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <i style={{fontSize: "12px", color: "white", width: "25px", height: "26px"}} class="fas fa-envelope"/>
                            <p style={{color: "lightgray", fontSize: "12px", marginRight: "5px"}}>Chat para suscriptores</p>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <i style={{fontSize: "12px", color: "white", width: "25px", height: "26px"}} class="fas fa-satellite-dish"/>
                            <p style={{color: "lightgray", fontSize: "12px", marginRight: "5px"}}>Streams para suscriptores</p>
                        </div>
                    </div>
                </div>

                
                <div style={{display: "flex", marginTop: "50px", justifyContent: "right"}}>
                    <Tippy placement="bottom" theme="pinkker" content={<h1 style={{fontSize: "12px", fontFamily: "Montserrat"}}>Suscribirse al canal</h1>}>
                        <div className='suscriptiondropdown-price-buttons-container' style={{display: "flex", height: "50px"}}>
                            <button onClick={onMouseEnterSub} onMouseEnter={() => setHoverSubscriber(true)} onMouseLeave={() => setHoverSubscriber(false)} className="dropdownsuscription-button-sub"><i style={{marginRight: "5px"}} class={"fas fa-star"}/> Suscribirse</button>    
                            <button onClick={onMouseEnterSub} onMouseEnter={() => setHoverSubscriber(true)} onMouseLeave={() => setHoverSubscriber(false)} className="dropdownsuscription-button-sub-price">{streamerData.suscriptionPrice} PXL</button>            
                        </div>
                    </Tippy>
                    
                </div>


            </div>

            
        </div>
        )
      }
  }

  function close() {
    closeNavbar();
    setDropdownSuscriptionConfirm(false);
  }

  return (
    <>
      <ul className={click ? 'dropdownsuscription-menu clicked' : 'dropdownsuscription-menu'}>

        <div style={{width: "99%"}} className="dropdownsuscription-container">

            {getdropdownsuscription()}

          </div>

          {dropdownSuscriptionConfirm && <SuscriptionConfirm socket={socket} closeNavbar={() => close()} streamerData={streamerData} streamer={streamer} />}

      </ul>
    </>
  );
}

export default SuscriptionDropdown;