import React, { useState, useEffect } from 'react';
import './DropdownEmotes.css';

import {useSelector} from 'react-redux'

import { getAllEmotes } from "../../../../../services/emotes";


function DropdownEmotes( { closeNavbar, clickEmoticon, muro } ) {

    
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  const token = useSelector(state => state.token)

  const [type, setType] = useState(0);

  const [emotes, setEmotes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getAllEmotes(token);
        if(data != null && data != undefined) {
            setEmotes(data);
        }
    }
    fetchData();
  }, [token])



  function getdropdownemotes() {
      if(type === 0) {
        return (
        <div  className='dropdownemotes-primary'>
            

            <hr style={{border: "1px solid #4b4b4b8f", width: "95%", marginBottom: "10px"}}/>

            <p style={{fontFamily: "Inter", color: "darkgray", fontWeight: "100", fontSize: "14px", marginBottom: "5px"}}>Más usados</p>
            
            <div style={{display: "flex", flexWrap: "wrap", overflow: "scroll", height: "180px"}}>
                {emotes && emotes.map((emote) => 
                    <div onClick={() => clickEmoticon(emote)} className='dropdownemotes-emote'>
                        <img style={{width: "25px"}} src={emote.image} />
                    </div>
                )}
            </div>

            
        </div>
        )
      }

  }

  return (
    <>
      <ul className={click ? 'dropdownemotes-menu clicked' : muro ? "dropdownemotes-muro-menu" : 'dropdownemotes-menu'}>

            <div style={{width: "100%"}} className="dropdownemotes-container">

                <div className="dropdownemotes-link" onClick={closeNavbar}> 
                    <div style={{marginRight: "70px"}} className='dropdownemotes-input'>
                        <i style={{fontSize: "14px"}} class="fas fa-search"/>
                        <input placeholder='Buscar emoticono' type="text" />
                    </div>
                    <i onClick={handleClick} style={{marginLeft: "10px", cursor: "pointer"}} class="fas fa-times pinkker-button-more"></i>
                </div>

                <div style={{display: "flex"}}>

                    {getdropdownemotes()}

                    <div className='dropdown-secondary'>
                        <div className='dropdown-secondary-card'>
                            <i style={{fontSize: "14px"}} class="fas fa-clock"/>
                        </div>

                        <div className='dropdown-secondary-card'>
                            <i style={{fontSize: "14px"}} class="fas fa-unlock"/>
                        </div>

                        <div className='dropdown-secondary-card'>
                            <i style={{fontSize: "14px"}} class="fas fa-globe"/>
                        </div>
                    </div>

                </div>

                

            </div>
      </ul>
    </>
  );
}

export default DropdownEmotes;