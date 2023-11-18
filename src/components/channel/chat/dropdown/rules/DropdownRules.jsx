import React, { useState, useEffect } from 'react';
import './DropdownRules.css';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { useSelector } from 'react-redux'


function DropdownRules( { closeNavbar } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const [type, setType] = useState(0);

  function handleClickRules() {
    localStorage.setItem('rules', 'true');
    closeNavbar();
  }


  function getdropdownrules() {
      if(type === 0) {
        return (
        <div>
            <li style={{width: "98%"}} onClick={handleClick} >
                  <div className="dropdownrules-link" onClick={closeNavbar}> 
                        Reglas del chat
                        <i style={{marginLeft: "10px", marginTop: "3px"}} class="fas fa-times"></i>
                  </div>
            </li> 

            <hr style={{display: "block", border: "1px solid #4b4b4b8f", margin: "10px auto", width: "100%"}}/>

            <li style={{marginTop: "10px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
                <p style={{fontFamily: "Inter", fontWeight: "600", fontSize: "12px"}}>NO hacer spam</p>
            </li>
            <li style={{marginTop: "10px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
                <p style={{fontFamily: "Inter", fontWeight: "600", fontSize: "12px"}}>NO insultar en el chat</p>
            </li>
            <li style={{marginTop: "10px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
                <p style={{fontFamily: "Inter", fontWeight: "600", fontSize: "12px"}}>NO incites a debates políticos, religiosos, etc</p>
            </li>

            
            <p style={{fontFamily: "Inter", fontWeight: "600", fontSize: "12px", marginTop: "20px"}}>Al aceptar estas de acuerdo a las <a style={{color: "#ff60b2"}}>politicas del chat</a> y a los <a style={{color: "#ff60b2"}}>terminos y condiciones</a></p>
            
            <div style={{width: "100%", display: "flex", justifyContent: "center", marginTop: "20px"}}>
                <button onClick={() => handleClickRules()} className='dropdownrules-button-okay'>De acuerdo</button>

            </div>
            
        </div>
        )
      }
  }

  return (
    <>
      <ul id='dropdownrules-scroll' className={click ? 'dropdownrules-menu clicked' : 'dropdownrules-menu'}>

        <div style={{width: "99%"}} className="dropdownrules-container">

            {getdropdownrules()}

          </div>
      </ul>
    </>
  );
}

export default DropdownRules;