import React, { useState, useEffect } from 'react';
import './DropdownPoints.css';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { useSelector } from 'react-redux'

import {useNotification} from "../../../../Notifications/NotificationProvider"

import { createDonationPixel } from "../../../../../services/donationPixel"


function DropdownPoints( { socketMain, streamer, closeNavbar, callback } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  const token = useSelector(state => state.token)

  const [type, setType] = useState(0);

  const alert = useNotification();

  const [selectedAmount, setSelectedAmount] = useState(0);
  const [textDonation, setTextDonation] = useState(null);

  async function handleSend() {
    if(textDonation != null) {

      
      const data = await createDonationPixel(token, streamer, selectedAmount, textDonation) 
      socketMain.emit("sendNotification", streamer);
      callback(selectedAmount, textDonation, data.data.donation)
      //alert({type: "SUCCESS", message: "Se ha enviado la donacion correctamente!"})
      closeNavbar()

    } else {
      alert({type: "ERROR", message: "Selecciona un texto para donar!"})
    }
  }

  function handleClickPixel(amount) {
    if(user.coins >= amount) {
      //clickDonation("pixels" + amount)
      setSelectedAmount(amount)

    } else {
      alert({type: "ERROR", message: "No tienes suficientes pixels para enviar."})
    }
  }
  


  function getdropdownpoints() {
      if(type === 0) {
        return (
        <div>

            <div className='dropdowns-title-container' style={{borderBottom: "1px solid #4b4b4b8f"}} >
                  <div style={{display: "flex", alignItems: "center", textAlign: "center"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        <h3 style={{width: "85%"}}>Enviar Pixels</h3>
                        <i onClick={handleClick} style={{marginLeft: "10px", marginTop: "3px", cursor: "pointer", fontSize: "15px"}} class="fas fa-times pinkker-button-more"></i>
                  </div>
            </div>


            <div className='dropdownpoints-card-container'>
                <div onClick={() => handleClickPixel(350)} className={user.coins >= 350 ? 'dropdownpoints-card' : 'dropdownpoints-card-disabled'}>
                  <div>
                    <img style={{width: "25px"}} src="/images/donaciones/1.png" alt="" />
                    <p style={{fontSize: "14px", fontFamily: "Poppins"}}>1</p>
                  </div>
                    
                </div>
                <div onClick={() => handleClickPixel(1000)} className={user.coins >= 1000 ? 'dropdownpoints-card' : 'dropdownpoints-card-disabled'}>
                  <div>
                  <img style={{width: "35px"}} src="/images/donaciones/100.png" alt="" />
                    <p style={{fontSize: "14px", fontFamily: "Poppins"}}>100</p>
                  </div>
                </div>
                <div onClick={() => handleClickPixel(1500)} className={user.coins >= 1500 ? 'dropdownpoints-card' : 'dropdownpoints-card-disabled'}>
                    <div>
                    <img style={{width: "40px"}} src="/images/donaciones/1000.png" alt="" />
                      <p style={{fontSize: "14px", fontFamily: "Poppins"}}>1000</p>
                    </div>
                </div>
                <div onClick={() => handleClickPixel(2500)} className={user.coins >= 2500 ? 'dropdownpoints-card' : 'dropdownpoints-card-disabled'}>
                    <div>
                    <img style={{width: "42px"}} src="/images/donaciones/5000.png" alt="" />
                      <p style={{fontSize: "14px", fontFamily: "Poppins"}}>5000</p>
                    </div>
                </div>
                <div onClick={() => handleClickPixel(3000)} className={user.coins >= 3000 ? 'dropdownpoints-card' : 'dropdownpoints-card-disabled'}>
                    <div>
                    <img style={{width: "45px"}} src="/images/donaciones/10000.png" alt="" />
                      <p style={{fontSize: "14px", fontFamily: "Poppins"}}>10000</p>
                    </div>
                </div>
                <div onClick={() => handleClickPixel(3500)} className={user.coins >= 3500 ? 'dropdownpoints-card' : 'dropdownpoints-card-disabled'}>
                    <div>
                    <img style={{width: "50px"}} src="/images/donaciones/50000.png" alt="" />
                      <p style={{fontSize: "14px", fontFamily: "Poppins"}}>50000</p>
                    </div>
                </div>
            </div>

            {selectedAmount != 0 ? <h5 className='dropdownpoints-text'>Has seleccionado el monto de <a style={{color: "#ff60b2", fontFamily: "Poppins"}}>{selectedAmount} PXL</a></h5> : <h5 className='dropdownpoints-text'>Selecciona el monto que quieras enviar al streamer.</h5>}
            {selectedAmount != 0 && <input className='dropdownpoints-input' onChange={(e) => setTextDonation(e.target.value)} placeholder='Escribe tu mensaje aquí..' type="text" />}
            {selectedAmount != 0 && <button onClick={() => handleSend()} className='dropdownpoints-button-send'>Enviar</button>}
            
            
        </div>
        )
      }
  }

  return (
    <>
      <ul id='dropdownpoints-scroll' className={click ? 'dropdownpoints-menu clicked' : 'dropdownpoints-menu'}>

        <div style={{width: "99%"}} className="dropdownpoints-container">

            {getdropdownpoints()}

          </div>
      </ul>
    </>
  );
}

export default DropdownPoints;