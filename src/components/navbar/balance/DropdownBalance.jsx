import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DropdownBalance.css';
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

function DropdownBalance( { closeNavbar } ) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const divRef = useRef();
  const handler = useCallback(() => setClick(true), []);
  useOnClickOutside(divRef, handler);


      


  return (
    <>
      <ul ref={divRef}  onClick={handleClick} className={click ? 'dropdownbalance-menu clicked' : 'dropdownbalance-menu'}>

        <div className="dropdowncomunidad-container">
            
            <li>
                <button className='dropdownbalance-button'>Retirar</button>
            </li> 
            <li>
                <button className='dropdownbalance-button'>Historial</button>
            </li>   
            <li>
                <button className='dropdownbalance-button'>Opciones</button>
            </li>           


          </div>
      </ul>
    </>
  );
}

export default DropdownBalance;