import React, { useState } from 'react';
import './DropdownLang.css';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux'

function DropdownLang( { closeNavbar, callback, close } ) {

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  return (
    <>
      <ul style={{transition: "0.5s all"}} className={click ? 'dropdownaccount-menu clicked' : 'dropdownaccount-menu'}>
        <div className="dropdowncomunidad-container">

            <li className='dropdownnews-news-li' style={{width: "98%", cursor: "pointer"}} onClick={close} >
                  <div className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        Idiomas
                        <i style={{marginLeft: "10px", marginTop: "3px"}} class="fas fa-times"></i>
                  </div>
            </li> 

            <li>
              <div style={{display: "flex", alignItems: "center", padding: "16px", paddingTop: "15px", paddingBottom: "15px", width: "100%"}}>
                <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                  <p style={{color: "white"}}>Español - Latinoamérica</p>
                </div>
              </div>
            </li>

            <li>
              <div style={{display: "flex", alignItems: "center", padding: "16px", paddingTop: "15px", paddingBottom: "15px", width: "100%"}}>
                <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                  <p style={{color: "white"}}>Español - España</p>
                </div>
              </div>
            </li>

            <li>
              <div style={{display: "flex", alignItems: "center", padding: "16px", paddingTop: "15px", paddingBottom: "15px", width: "100%"}}>
                <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                  <p style={{color: "white"}}>English</p>
                </div>
              </div>
            </li>

          </div>
      </ul>
    </>
  );
}

export default DropdownLang;