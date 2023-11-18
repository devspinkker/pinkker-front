import React, {useState, useEffect} from 'react';

import Draggable from 'react-draggable';

import "./DonationCard.css";


import { useSelector } from 'react-redux';

import Tippy from '@tippyjs/react';

export default function DonationCard({ donationColor, donationAmount, donationName, donationAvatar, donationText, donationLook, close }) {

    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    function getColorFromAmount(amount) {
        if(amount <= 600) {
          return {colorPrimary: "#1F2DA5", colorSecondary: "#162077"};
        }
      
        if(amount > 600 && amount <= 1200) {
          return {colorPrimary: "#1EACB0", colorSecondary: "#167477"};
        }
      
        if(amount > 1200 && amount <= 3000) {
          return {colorPrimary: "#A19A1B", colorSecondary: "#7C7717"};
        }
  
        if(amount > 3000 && amount <= 6000) {
          return {colorPrimary: "#A16E1B", colorSecondary: "#86590F"};
        }
      }

    return (
        <div className='donationcard-body-container'>
                <div style={{backgroundColor: getColorFromAmount(donationAmount).colorPrimary}} className='donationcard-body'>
                    <div style={{width: "100%", margin: "0 auto"}}>
                        
                        <div onClick={() => close()} className='donationcard-close'>
                            <i style={{cursor: "pointer"}} class="fas fa-times"/>
                        </div>

                        <div className='donationcard-container'>
                            <div className='donationcard-primary'>
                                <img style={{width: "40px", marginRight: "10px", borderRadius: "100px"}} src={donationLook} />
                            </div>

                            <div className='donationcard-secondary'>   
                                <h5 style={{fontFamily: "Poppins", color: "white", fontSize: "14px"}}>{donationName}</h5>                         
                                <h6 style={{fontFamily: "Poppins", color: "darkgray", fontSize: "14px"}}>{donationText}</h6>
                            </div>

                        </div>

                    </div>
                    

                    <button className='donationcard-button'>COMPRAR PIXELS</button> 
                </div>
            </div>
    )
}