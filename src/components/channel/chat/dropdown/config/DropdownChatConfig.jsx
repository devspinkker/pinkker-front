import React, { useState, useEffect } from 'react';
import './DropdownChatConfig.css';
import { Link } from 'react-router-dom';


import axios from 'axios'
import {useSelector} from 'react-redux'

import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';

import { useParams } from 'react-router-dom';


function DropdownChatConfig( { closeNavbar, changeTextSize, chatOff } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const [type, setType] = useState(0);

  const [pauseChat, setPauseChat] = useState(false);

  const chatTextSize = localStorage.getItem("chatTextSize");

  const [textSize, setTextSize] = useState(chatTextSize === null ? 1 : parseInt(chatTextSize));
  const { streamer } = useParams();


  function getTextFromTextSize() {
    if(textSize === 0) {
      return "Letra chica"
    }
    if(textSize === 1) {
      return "Predeterminado"
    }
    if(textSize === 2) {
      return "Letra Mediana"
    }
    if(textSize === 3) {
      return "Letra Grande"
    }
  }

  function getChangeTextSize(size) {
    setTextSize(size)
    changeTextSize(size)
    localStorage.setItem("chatTextSize", size)
  }

  function popupwindow(url, title, w, h) {
    chatOff()
    var y = window.outerHeight / 2 + window.screenY - ( h / 2)
    var x = window.outerWidth / 2 + window.screenX - ( w / 2)
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
  }

  
  function getdropdownchatconfig() {
      if(type === 0) {
        return (
        <div>

            <div className='dropdowns-title-container' style={{borderBottom: "1px solid #4b4b4b8f"}} >
                  <div style={{display: "flex", alignItems: "center", textAlign: "center"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        <h3 style={{width: "85%"}}>Configuración del Chat</h3>
                        <i onClick={handleClick} style={{marginLeft: "10px", marginTop: "3px", cursor: "pointer", fontSize: "15px"}} class="fas fa-times pinkker-button-more"></i>
                  </div>
            </div>

            <p style={{fontFamily: "Inter", color: "darkgray", fontWeight: "100", padding: "5px", fontSize: "14px"}}>MIS PREFERENCIAS</p>
            
            <li style={{display: "flex", justifyContent: "space-between",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Pausar Chat</p>
              <p style={{fontFamily: "Inter", fontWeight: "100", color: "#ff60b2"}}>(Solo desplazar)</p>
            </li> 

            <li onClick={() => setType(1)} style={{display: "flex", justifyContent: "space-between", marginTop: "3px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Apariencia de chat</p>
              <i class="fas fa-caret-right"/>
            </li> 

            <li onClick={() => chatOff()} style={{display: "flex", justifyContent: "space-between", marginTop: "3px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Ocultar Chat</p>
            </li> 

            <li onClick={() => popupwindow(process.env.REACT_APP_API_URL === "localhost" ? `http://localhost:3000/${streamer}/popout/chat` : `https://pinkker.tv/${streamer}/popout/chat`, "Chat", 500, 900)} style={{display: "flex", justifyContent: "space-between", marginTop: "3px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Chat Emergente</p>
              <i class="fas fa-arrow-right"/>
            </li> 
           

            
        </div>
        )
      }


      if(type === 1) {
        return (
        <div>
            <li style={{width: "98%"}} onClick={handleClick} >
                  <div className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        Configuración del Chat
                        <i style={{marginLeft: "10px", marginTop: "3px"}} class="fas fa-times"></i>
                  </div>
            </li> 

            <hr style={{border: "1px solid #4b4b4b8f", margin: "10px auto", width: "100%"}}/>

            <p style={{fontFamily: "Inter", color: "darkgray", fontWeight: "100", padding: "5px", fontSize: "14px"}}>APARIENCIA DEL CHAT</p>
            
            <li style={{display: "flex", justifyContent: "space-between", marginTop: "3px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Tamaño de la fuente</p>
              <p style={{fontFamily: "Inter", fontWeight: "100", color: "#ff60b2"}}>{getTextFromTextSize()}</p>

            </li>

            <div style={{display: "flex", justifyContent: "center"}}>
              <div style={{textAlign: "center", marginRight: "10px"}}>
                <Radio checked={textSize === 0} value={0} onChange={() => getChangeTextSize(0)} />
                <h3 style={{fontSize: "12px"}}>Aa</h3>
              </div>

              <div style={{textAlign: "center", marginRight: "10px"}}>
                <Radio checked={textSize === 1} value={1} onChange={() => getChangeTextSize(1)} />
                <h3 style={{fontSize: "13px"}}>Aa</h3>
              </div>

              <div style={{textAlign: "center", marginRight: "10px"}}>
                <Radio checked={textSize === 2} value={2} onChange={() => getChangeTextSize(2)} />
                <h3 style={{fontSize: "14px"}}>Aa</h3>
              </div>

              <div style={{textAlign: "center", marginRight: "10px"}}>
                <Radio checked={textSize === 3} value={3} onChange={() => getChangeTextSize(3)} />
                <h3 style={{fontSize: "15px"}}>Aa</h3>
              </div>
              
             
            </div>

            <li style={{display: "flex", justifyContent: "space-between", marginTop: "10px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Colores legibles</p>
              <Switch size="small" defaultChecked />
            </li>

            <li style={{display: "flex", justifyContent: "space-between", marginTop: "3px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Animaciones de emoticonos</p>
              <Switch size="small" defaultChecked />
            </li>

            <li style={{display: "flex", justifyContent: "space-between", marginTop: "3px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px"}}>
              <p style={{fontFamily: "Inter", fontWeight: "100"}}>Marca de tiempo para nuevos mensajes</p>
              <Switch size="small" defaultChecked />
            </li>
           

            
        </div>
        )
      }
  }

  return (
    <>
      <ul style={{marginTop: type === 1 && "-262px", height: type === 1 && "280px"}} className={click ? 'dropdownchatconfig-menu clicked' : 'dropdownchatconfig-menu'}>

        <div style={{width: "99%"}} className="dropdownchatconfig-container">

            {getdropdownchatconfig()}

          </div>
      </ul>
    </>
  );
}

export default DropdownChatConfig;