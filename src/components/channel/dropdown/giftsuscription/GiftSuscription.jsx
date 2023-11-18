import React, { useState, useEffect } from 'react';
import './GiftSuscription.css';
import { Link } from 'react-router-dom';


import axios from 'axios'
import {useSelector} from 'react-redux'

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import GiftConfirm from './confirm/GiftConfirm';

import { giftSuscription } from '../../../../services/suscribers';

import { useNotification } from "../../../Notifications/NotificationProvider";



function GiftSuscriptionDropdown( { socket, users, closeNavbar, title, streamer, streamerData } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)
  const {user, isLogged} = auth

  const [type, setType] = useState(0);
  const alert = useNotification();


  const [hoverSubscriber, setHoverSubscriber] = useState(false);

  const [dropdownSuscriptionConfirm, setDropdownSuscriptionConfirm] = useState(false);
  const [quantity, setQuantity] = useState(0)
  const [userToGiftSub, setUserToGiftSub] = useState(null)

  const onMouseEnterSub = (quantity) => {
    if(dropdownSuscriptionConfirm === true) {
        setDropdownSuscriptionConfirm(false);
    } else{
        setQuantity(quantity)
        setDropdownSuscriptionConfirm(true);
    }
  };


  async function giftToUser() {
    const data = await giftSuscription(token, userToGiftSub, streamer)
    if(data != null && data != undefined) {
      alert({type: "SUCCESS", message: data.data.msg})
      socket.emit("sendGiftSuscription", [userToGiftSub], 1, streamer);
      closeNavbar();
    }
  }
  


  function getdropdowngiftsuscription() {
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

                <div className='dropdowngiftsuscription-streamer'>
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
                    <button onClick={() => setType(1)} className='dropdowngiftsuscription-button-user-gift'>Regalar a un usuario especifico</button>
                </div>

                
                <div className='dropdowngiftsuscription-card-container'>
                    <div className='dropdowngiftsuscription-card'>
                        <div className='dropdowngiftsuscription-card-primary'>
                            <img style={{width: "35px", position: "relative", left: "20px"}} src="/images/donaciones/regalar1.png"/>
                        </div>
                        <div className='dropdowngiftsuscription-card-secondary'>
                            <h3>Regalar 1 suscripción</h3>
                        </div>
                        <div className='dropdowngiftsuscription-card-tercery'>
                            <button onClick={() => onMouseEnterSub(1)} className='dropdowngiftsuscription-button-sub-price'><i style={{marginRight: "5px"}} class={"fas fa-gift"}/> 500 PXL</button>
                        </div>
                    </div>

                    <div className='dropdowngiftsuscription-card'>
                        <div className='dropdowngiftsuscription-card-primary'>
                            <img style={{width: "85px"}} src="/images/donaciones/regalar10.png"/>

                        </div>
                        <div className='dropdowngiftsuscription-card-secondary'>
                            <h3>Regalar 10 suscripciones</h3>
                        </div>
                        <div className='dropdowngiftsuscription-card-tercery'>
                            <button onClick={() => onMouseEnterSub(10)} className='dropdowngiftsuscription-button-sub-price'><i style={{marginRight: "5px"}} class={"fas fa-gift"}/> 5000 PXL</button>
                        </div>
                    </div>

                    <div className='dropdowngiftsuscription-card'>
                        <div className='dropdowngiftsuscription-card-primary'>
                            <img style={{width: "75px", position: "relative", left: "5px"}} src="/images/donaciones/regalar20.png"/>
                        </div>
                        <div className='dropdowngiftsuscription-card-secondary'>
                            <h3>Regalar 20 suscripciones</h3>
                        </div>
                        <div className='dropdowngiftsuscription-card-tercery'>
                            <button className='dropdowngiftsuscription-button-sub-price'><i style={{marginRight: "5px"}} class={"fas fa-gift"}/> 5000 PXL</button>
                        </div>
                    </div>

                    <div className='dropdowngiftsuscription-card'>
                        <div className='dropdowngiftsuscription-card-primary'>
                            <img style={{width: "55px", position: "relative", left: "15px"}} src="/images/donaciones/regalar50.png"/>

                        </div>
                        <div className='dropdowngiftsuscription-card-secondary'>
                            <h3>Regalar 50 suscripciones</h3>
                        </div>
                        <div className='dropdowngiftsuscription-card-tercery'>
                            <button className='dropdowngiftsuscription-button-sub-price'><i style={{marginRight: "5px"}} class={"fas fa-gift"}/> 5000 PXL</button>
                        </div>
                    </div>

                    <div className='dropdowngiftsuscription-card'>
                        <div className='dropdowngiftsuscription-card-primary'>
                            <img style={{width: "70px", position: "relative", left: "10px"}} src="/images/donaciones/regalar100.png"/>

                        </div>
                        <div className='dropdowngiftsuscription-card-secondary'>
                            <h3>Regalar 100 suscripciones</h3>
                        </div>
                        <div className='dropdowngiftsuscription-card-tercery'>
                            <button className='dropdowngiftsuscription-button-sub-price'><i style={{marginRight: "5px"}} class={"fas fa-gift"}/> 5000 PXL</button>
                        </div>
                    </div>
                </div>


            </div>

            
        </div>
        )
      }

      if(type === 1) {
        return (
        <div>
            <li style={{paddingTop: "10px", paddingBottom: "10px"}} onClick={handleClick} >
                  <div style={{ display: "flex", alignItems: "center"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        Suscribirte
                        <i style={{marginLeft: "10px"}} class="fas fa-times"></i>
                  </div>
            </li>

            <hr style={{border: "1px solid #4b4b4b8f", marginBottom: "10px", width: "100%"}}/>


            <div style={{width: "90%", margin: "0 auto"}}>

                <div className='dropdowngiftsuscription-streamer'>
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
                    <button onClick={() => setType(0)} className='dropdowngiftsuscription-button-user-gift'>Volver</button>
                </div>

                
                <h3 style={{color: "#ededed", marginTop: "10px"}}>Elige un destinatario</h3>

                <div style={{display: "flex", alignItems: "center", height: "40px", textAlign: "center", marginTop: "10px"}}>
                    <input onChange={(e) => setUserToGiftSub(e.target.value)} style={{height: "30px", width: "200px", paddingLeft: "5px"}} className='pinkker-input' placeholder='Buscar' type="search" />
                    <i style={{display: "flex", alignItems: "center",  justifyContent: "center", height: "20px"}} class="fas fa-search navbar-search-i"></i>
                </div>

                <div className='giftsuscription-card-type-1'>
                    <div style={{textAlign: "center"}}>
                        <h3>1</h3>
                        <p style={{marginTop: "5px", display: "flex", alignItems: "center"}}><img style={{width: "25px"}} src='/images/pinkker.png'/> 500 PXL</p>
                    </div>
                </div>


                <div style={{marginTop: "150px", display: "flex", justifyContent: "right"}}>
                    <div style={{textAlign: "right"}}>
                        <h3 style={{color: "#ededed", display: "flex", alignItems: "center"}}>Subtotal: <img style={{width: "40px", marginLeft: "20px"}} src="/images/pinkker.png" alt="" /> 500 PXL</h3>
                        <button onClick={() => giftToUser()} style={{width: "200px"}} className="channel-bottom-v2-button-sub"><i style={{marginRight: "5px"}} class={hoverSubscriber ? "fas fa-star" : "far fa-star"}/> Regalar suscripción</button>    
                    </div>
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
      <ul className={click ? 'dropdowngiftsuscription-menu clicked' : 'dropdowngiftsuscription-menu'}>

        <div style={{width: "99%"}} className="dropdowngiftsuscription-container">

            {getdropdowngiftsuscription()}

          </div>

          {dropdownSuscriptionConfirm && <GiftConfirm socket={socket} users={users} quantity={quantity} closeNavbar={() => close()} streamerData={streamerData} streamer={streamer} />}


      </ul>
    </>
  );
}

export default GiftSuscriptionDropdown;