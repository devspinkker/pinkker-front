import React, { useState } from 'react';
import './DropdownMarcas.css';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux'

function DropdownSettings() {

  const [click, setClick] = useState(false);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  const token = useSelector(state => state.token)


  const handleClick = () => setClick(!click);
  return (
    <>
      <ul onClick={handleClick} className={click ? 'dropdowndashboard-menu clicked' : 'dropdowndashboard-menu'}>

                    <li className="dropdown-li">
                        <Link to={"/" + user.name + "/dashboard/settings/stream"} style={{display: "flex", alignItems: "flex-start"}} className="dropdown-marcas-link" ><i style={{color: "darkgray"}} class="fa fa-signal"/>Transmisión</Link>
                    </li>

                  
        
      </ul>
    </>
  );
}

export default DropdownSettings;