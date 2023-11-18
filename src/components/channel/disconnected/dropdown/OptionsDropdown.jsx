import React, { useState, useEffect, useRef, useCallback } from 'react';
import './OptionsDropdown.css';

import { useSelector } from 'react-redux'

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
  


function OptionsDropdown( { closeNavbar, clip } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const [type, setType] = useState(0);

  const [quality, setQuality] = useState("720p");

  const divRef = useRef();
  const handler = useCallback(() => {
    closeNavbar();
    setClick(true)
  }, []);
  useOnClickOutside(divRef, handler, closeNavbar);

  function getdropdownOptions() {
      if(type === 0) {
        return (
        <div>

            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%", margin: "8px auto", marginBottom: "6px"}}>                
                <li>
                    <h3 style={{color: "white", fontSize: "14px"}}><i style={{marginRight: "5px"}} class="fas fa-share"/> Compartir</h3>
                </li>  
            </div>

            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "95%", margin: "8px auto", marginBottom: "6px"}}>                
                <li>
                    <h3 style={{color: "white", fontSize: "14px"}}><i style={{marginRight: "5px"}} class="fas fa-flag"/> Denunciar</h3>
                </li>  
            </div>
            
            <hr style={{border: "1px solid #4b4b4b8f", width: "100%"}}/>
            <div style={{display: "flex",alignItems: "center", justifyContent: "space-between", width: "95%", margin: "8px auto", marginBottom: "6px"}}>                
                <li>
                    <h3 style={{color: "white", fontSize: "14px"}}><i style={{marginRight: "5px"}} class="fas fa-eye-slash"/> No me interesa</h3>
                </li>  
            </div>
        </div>
        )
      }
  }

  return (
    <>
      <ul ref={divRef} style={{left: clip === true && "0%", zIndex: "99999"}} className={click ? 'dropdownOptions-menu clicked' : 'dropdownOptions-menu'}>

        <div style={{width: "99%"}} className="dropdownOptions-container">

            {getdropdownOptions()}

        </div>
      </ul>
    </>
  );
}

export default OptionsDropdown;