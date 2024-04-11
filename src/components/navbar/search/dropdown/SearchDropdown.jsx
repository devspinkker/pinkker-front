import React, { useState, useEffect } from 'react';
import './SearchDropdown.css';
import { Link } from 'react-router-dom';


import axios from 'axios'
import {useSelector} from 'react-redux'

function SearchDropdown( { isMobile, search, text, handleClickHistory, handleRemove } ) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);


  const [type, setType] = useState(0);

  


  const renderUsers = (name, avatar, followers) => {
    return (
      <li onClick={() => handleClickHistory(name, avatar)} style={{display: "flex", alignItems: "center"}} >
            <div className='dropdownsearch-content'>
                <div style={{display: "flex", alignItems: "center"}}>
                    <img style={{width: "35px", borderRadius: "50px"}} src={avatar}  />

                    <div style={{textAlign: "left", marginLeft: "5px"}}>
                      <h4 style={{fontSize: isMobile ? "18px" : "13px"}}>{name}</h4>
                      <p style={{fontSize: isMobile ? "16px" :"12px", color: "darkgray"}}>{followers} seguidores</p>
                    </div>

                </div>
          </div>
      </li>  
    )
  }

  const renderHistory = (text, avatar) => {
    if(avatar != null) {
      return (
        <li style={{display: "flex", alignItems: "center"}}>
              <div onClick={() => handleClickHistory(text, avatar)} className='dropdownsearch-content'>
                  <div style={{display: "flex", alignItems: "center"}}>
                      <img style={{width: "35px", borderRadius: "50px"}} src={avatar}  />

                      <div style={{textAlign: "left", marginLeft: "5px"}}>
                        <h4 style={{fontSize: "13px"}}>{text}</h4>
                      </div>

                  </div>
            </div>
            <div onClick={() => handleRemove(text)} className='dropdownsearch-close-icon' style={{marginRight: "10px", width: "20px", padding: "3px", borderRadius: "3px"}}>
              <i style={{color: "white"}} class="fas fa-times"/>
            </div>
        </li>  
      )
    }

    return (
      <li style={{display: "flex", alignItems: "center"}}>
          <div onClick={() => handleClickHistory(text, null)} className='dropdownsearch-content'>
              <div>
                <h4 style={{color: "#ff60b2"}}><i style={{color: "#ededed", width: "25px"}} class="fas fa-search"></i></h4>   
              </div>
              <div style={{marginLeft: "10px"}}>
                <h4>{text}</h4>
              </div>
          </div>
          <div onClick={() => handleRemove(text)} className='dropdownsearch-close-icon' style={{marginRight: "10px", width: "20px", padding: "3px", borderRadius: "3px"}}>
            <i style={{color: "white"}} class="fas fa-times"/>
          </div>
      </li>  
    )
  }


  function getdropdownsearch() {
        if(search != null) {
          return (
            <div style={{width: "100%", backgroundColor: "#0a0a0afc", }}>
               
               {text != null && <li onClick={() => handleClickHistory(text, null)}>
                      <div className='dropdownsearch-content'>
                          <div>
                              <h4 style={{color: "#ff60b2"}}><i style={{color: "#ededed", width: "25px"}} class="fas fa-search"></i></h4>   
                          </div>
                          <div style={{marginLeft: "10px"}}>
                              <h4>{text}</h4>
                          </div>
                    </div>
                </li> }

                {search.users && search.users.map(user => {
                  return renderUsers(user.name, user.avatar, user.followers.length)
                })} 
                

                {search.history && search.history.map(text => {
                  return renderHistory(text.text, text.avatar)
                })}

                
            </div>
            )
        }
       
      
  }

  return (
    <>
      <ul className={click ? 'dropdownsearch-menu clicked' : 'dropdownsearch-menu'}>

        {getdropdownsearch()}
      </ul>
    </>
  );
}

export default SearchDropdown;