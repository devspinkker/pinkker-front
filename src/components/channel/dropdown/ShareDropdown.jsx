import React, { useState, useEffect } from 'react';
import './ShareDropdown.css';
import { Link } from 'react-router-dom';


import axios from 'axios'
import {useSelector} from 'react-redux'

function ShareDropdown( { closeNavbar, title, streamer, clip, clipId } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const [type, setType] = useState(0);

  const [quality, setQuality] = useState("720p");

  let twitterLink = `https://twitter.com/intent/tweet?text=${title}&url=https://www.pinkker.tv/${streamer}`;
  let facebookLink = `https://www.facebook.com/sharer/sharer.php?u=https://www.pinkker.tv/${streamer}`;

  if(clip === true) {
    twitterLink = `https://twitter.com/intent/tweet?text=${title}&url=https://www.pinkker.tv/clip/${clipId}`;
    facebookLink = `https://www.facebook.com/sharer/sharer.php?u=https://www.pinkker.tv/clip/${clipId}`;
  }

  function copy() {
    if(clip === true) {
      const el = document.createElement('textarea');
      el.value = "https://www.pinkker.tv/clip/" + clipId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    } else {
      const el = document.createElement('textarea');
      el.value = "https://www.pinkker.tv/" + streamer;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

  }

  function getdropdownshare() {
      if(type === 0) {
        return (
        <div>
            <li style={{paddingTop: "10px", paddingBottom: "10px"}} onClick={handleClick} >
                  <div style={{ display: "flex", alignItems: "center"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        Cerrar
                        <i style={{marginLeft: "10px"}} class="fas fa-times"></i>
                  </div>
            </li>

            <hr style={{border: "1px solid #4b4b4b8f", marginBottom: "10px", width: "100%"}}/>

            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%", margin: "10px auto", marginBottom: "10px"}}>


                <a style={{textDecoration: "none"}} target={"_blank"} href={twitterLink}>
                  <li>
                      <div className='dropdownshare-content'>
                          <i style={{fontSize: "44px", color: "lightblue"}} class="fab fa-twitter"></i>
                          <p style={{marginTop: "5px"}}>Twitter</p>
                        
                      </div>
                  </li> 
                </a>
                
                <a style={{textDecoration: "none"}} target={"_blank"} href={facebookLink}>
                  <li>
                      <div className='dropdownshare-content'>
                          <i style={{fontSize: "44px", color: "#4267B2"}} class="fab fa-facebook"></i>
                          <p style={{marginTop: "5px"}}>Facebook</p>
                        
                      </div>
                  </li> 
                </a>
                 

                <li>
                    <div className='dropdownshare-content'>
                        <i style={{fontSize: "44px", color: "#bc2a8d"}} class="fab fa-instagram"></i>
                        <p style={{marginTop: "5px"}}>Instagram</p>
                       
                    </div>
                </li>  

                <li onClick={() => copy()}>
                    <div className='dropdownshare-content'>
                        <i style={{fontSize: "40px", color: "darkgray", marginBottom: "2px"}} class="fas fa-copy"></i>
                        <p style={{marginTop: "5px"}}>Copiar</p>
                       
                    </div>
                </li>  
            </div>
           

            
        </div>
        )
      }
  }

  return (
    <>
      <ul style={{left: clip === true && "0%"}} className={click ? 'dropdownshare-menu clicked' : 'dropdownshare-menu'}>

        <div style={{width: "99%"}} className="dropdownshare-container">

            {getdropdownshare()}

          </div>
      </ul>
    </>
  );
}

export default ShareDropdown;