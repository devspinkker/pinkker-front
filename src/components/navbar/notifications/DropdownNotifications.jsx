import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DropdownNotifications.css';


import {useSelector} from 'react-redux'

import { Link } from 'react-router-dom';

import { getNotifications } from '../../../services/notifications';
import { ScaleLoader } from "react-spinners"


function useOnClickOutside(ref, handler) {
      useEffect(() => {
        const listener = event => {
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
    
          handler(event);
        };
    
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
    
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      }, [ref, handler]);
    }

function DropdownNotifications( { closeNavbar, handleMessage } ) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  const token = useSelector(state => state.token)

  const divRef = useRef();
  const handler = useCallback(() => setClick(true), []);
  useOnClickOutside(divRef, handler);

  const [notifications, setNotifications] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotifications(token);
      if(data != null && data != undefined) {
        setNotifications(data);
      }
    }
    fetchData();
    
  }, [token])

  function dateStringSince(dateString) {

    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const day = 1000 * 60 * 60 * 24;
    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % day) / (1000 * 60));
    const seconds = Math.floor((diff % day) / 1000);
    if(days > 0) {
      return days + " d";
    } else if(hours > 0) {
      return hours + " h";
    } else if(minutes > 0) {
      return minutes + " min";
    } else if(seconds > 0) {
      return seconds + " sec";
    } else {
      return "just now";
    }
  }


  const getCardFromType = (notification) => {

    if(notification.type === 3) {
        return (
            <li style={{padding: "0px", paddingLeft: "5px"}}>
              <div className='dropdownnotifications-news-card'>

                <div style={{width: "45px", position: "relative"}} className='navbar-image-avatar-container'>
                  <div style={{backgroundColor: "transparent", width: "45px"}} className='navbar-image-avatar'>
                    <a href={'/' + notification.target}><img style={{backgroundColor: "#080809"}} src={notification.avatar} alt="" /></a>
                  </div>
                </div>
                <div style={{marginLeft: "5px", display: "flex", alignItems: "center"}}>
                    <h3><a style={{color: "#ededed", fontSize: "12px"}}>{notification.target}</a> <a style={{color: "lightgray", fontSize: "12px", marginLeft: "5px"}}> te ha donado <img style={{width: "16px", position: "relative", top: "3px", marginLeft: "5px"}} src="/images/pixel.png"/> <a style={{color: "white"}}>{notification.donationAmount}</a></a> <a style={{color: "darkgray", fontSize: "12px"}}> • {dateStringSince(notification.createdAt)}</a></h3>
                </div>
              </div>
            </li>           
        )
    }

    
  }


  return (
    <>
      <ul ref={divRef} className={click ? 'dropdownnotifications-menu clicked' : 'dropdownnotifications-menu'}>

      

        <div style={{width: "99%"}} className="dropdowncomunidad-container">

            <div className='dropdowns-title-container' style={{borderBottom: "1px solid #4b4b4b8f"}} >
                  <div style={{display: "flex", alignItems: "center", height: "15px"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        <h3 style={{width: "85%"}}>Notificaciones</h3>
                        <i onClick={handleClick} style={{marginLeft: "10px", marginTop: "3px", cursor: "pointer", fontSize: "15px"}} class="fas fa-times pinkker-button-more"></i>
                  </div>
            </div> 



              {notifications != null && notifications.length > 0 &&  notifications.map((message) => getCardFromType(message))}
              {notifications === null && <div style={{ minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <ScaleLoader width={4} height={20} color="#f36197d7" />
                  </div>}

              {notifications != null && notifications.length === 0 && <div style={{ minHeight: "130px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <img style={{width: "125px"}} src="/images/no-notificaciones.png" />
                  </div>}
            

          </div>
      </ul>
    </>
  );
}

export default DropdownNotifications;