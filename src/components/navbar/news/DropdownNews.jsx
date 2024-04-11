import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DropdownNews.css';
import { Link } from 'react-router-dom';


import axios from 'axios'
import {useSelector} from 'react-redux'


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

function DropdownNews( { closeNavbar } ) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const divRef = useRef();
  const handler = useCallback(() => setClick(true), []);
  useOnClickOutside(divRef, handler);

      const handleLogout = async () => {
            try {
                  await axios.get('/user/logout')
                  localStorage.removeItem('firstLogin')
                  window.location.href = "/";
            } catch (err) {
                  window.location.href = "/";
            }
      }

      


  return (
    <>
      <ul ref={divRef}  onClick={handleClick} className={click ? 'dropdownnews-menu clicked' : 'dropdownnews-menu'}>

        <div className="dropdowncomunidad-container">

          <div className='dropdowns-title-container' style={{borderBottom: "1px solid #4b4b4b8f"}} >
                  <div style={{display: "flex", alignItems: "center"}} className="dropdownchatconfig-link" onClick={closeNavbar}> 
                        <h3 style={{width: "85%"}}>Nuevas noticias</h3>
                        <i onClick={handleClick} style={{marginLeft: "10px", marginTop: "3px", cursor: "pointer", height: "25px", width: "20px"}} class="fas fa-times pinkker-button-more"></i>
                  </div>
            </div> 
            
            <li style={{borderBottom: "0px solid transparent"}}>
                <div className='dropdownnews-news-card'>
                    <h3 style={{fontFamily: "Poppins", color: "#ededed", marginBottom: "20px"}}>Cómo reclamar con Prime Gaming</h3>
                    <img style={{width: "250px"}} src="https://static.twitchcdn.net/assets/prime-gaming-purple-2018720eb815c4306af7.svg"/>
                    <button className='dropdownnews-button'>Ver más</button>
                </div>
            </li>             

            <hr style={{border: "1px solid #4b4b4b8f", margin: "10px auto"}}/>


          </div>
      </ul>
    </>
  );
}

export default DropdownNews;