import React, { useState, useEffect } from 'react';
import './DropdownCommands.css';
import { Link } from 'react-router-dom';

import axios from 'axios'
import { useSelector } from 'react-redux'


function DropdownCommands( { streamer, userMod, closeNavbar, message, handleClickMessage, indexHover } ) {
    
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth

  const [type, setType] = useState(0);




  const commands = [
      {
        name: "/clear",
        description: "Borrar el historial del chat para todos los espectadores",
        moderator: true,
        streamer: true,
        user: false

      },
      {
        name: "/mod [username]",
        description: "Asignar estado de moderador a un usuario",
        moderator: false,
        streamer: true,
        user: false
      },
      {
        name: "/unmod [username]",
        description: "Anular el estado de moderador de un usuario",
        moderator: false,
        streamer: true,
        user: false
      },
      {
        name: "/ban [username] [reason]",
        description: "Vetar permanentemente a un usuario del chat",
        moderator: true,
        streamer: true,
        user: false
      },
      {
        name: "/unban [username]",
        description: "Anular la expulsión temporal o el veto permanente a un usuario",
        moderator: true,
        streamer: true,
        user: false
      },
      {
        name: "/vip [username]",
        description: "Asignar estado de VIP a un usuario",
        moderator: false,
        streamer: true,
        user: false
      },
      {
        name: "/unvip [username]",
        description: "Anular el estado de VIP de un usuario",
        moderator: false,
        streamer: true,
        user: false
      },
      {
        name: "/slow [segundos]",
        description: "Limitar la frecuencia que los usuarios pueden enviar mensajes",
        moderator: true,
        streamer: true,
        user: false
      },
      {
        name: "/slowoff",
        description: "Desactivar el modo lento",
        moderator: true,
        streamer: true,
        user: false
      },
      {
        name: "/host [username]",
        description: "Alojar otro stream en tu canal",
        moderator: false,
        streamer: true,
        user: false
      },
      {
        name: "/color [color]",
        description: "Cambiar tu color de usuario (red, blue, green)",
        moderator: true,
        streamer: true,
        user: true
      },
      {
        name: "/announcement",
        description: "Enviar a todos los usuarios un anuncio",
        moderator: false,
        streamer: true,
        user: false
      },
      {
        name: "/emoteonly",
        description: "Restringir los mensajes de chat a solo emoticonos",
        moderator: true,
        streamer: true,
        user: false
      },
      {
        name: "/emoteonlyoff",
        description: "Desactivar el modo solo emoticonos.",
        moderator: true,
        streamer: true,
        user: false
      },

      {
        name: "/subscribers",
        description: "Restringir chat a suscriptores.",
        moderator: true,
        streamer: true,
        user: false
      },

      {
        name: "/subscribersoff",
        description: "Desactivar el modo solo suscriptores.",
        moderator: true,
        streamer: true,
        user: false
      },

      {
        name: "/uniquechat",
        description: "Impedir que los usuarios envien mensajes duplicados en el chat.",
        moderator: true,
        streamer: true,
        user: false
      },

      {
        name: "/uniquechatoff",
        description: "Desactivar el modo chat unico",
        moderator: true,
        streamer: true,
        user: false
      },
      
      {
        name: "/user [username]",
        description: "Mostrar la información del perfil de un usuario del canal",
        moderator: true,
        streamer: true,
        user: false
      },

      {
        name: "/followers [duration]",
        description: "Restringir el chat a seguidores en funcion del tiempo que lleven siéndolo",
        moderator: true,
        streamer: true,
        user: false
      },

      {
        name: "/followersoff",
        description: "Desactivar el modo solo seguidores.",
        moderator: true,
        streamer: true,
        user: false
      },
      {
        name: "/bet",
        description: "Crear una apuesta.",
        moderator: false,
        streamer: true,
        user: false
      },

  ]

  const commandsFilterPerMessage = commands.filter(command => {
    return command.name.includes(message)
  })
  
  const commandsFilterPerRank = commandsFilterPerMessage.filter(command => {

    if(user.name === streamer) {
      return command.streamer === true;
    }

    if(userMod) {
      return command.moderator === true;
    }

    return command.user === true;
  })



  function getdropdowncommands() {
      if(type === 0) {
        return (
        <div>
            <li style={{width: "98%"}} onClick={handleClick} >
                  <div className="dropdowncommands-link" onClick={closeNavbar}> 
                        CHANNEL MANAGEMENT
                        <i style={{marginLeft: "10px", marginTop: "3px"}} class="fas fa-times"></i>
                  </div>
            </li> 

            <hr style={{display: "block", border: "1px solid #4b4b4b8f", margin: "10px auto", width: "100%"}}/>

            {commandsFilterPerRank.map((command, index) => (
                <li onClick={() => handleClickMessage(command)} style={{marginTop: "10px",  paddingTop: "5px", paddingBottom: "5px", padding: "5px", backgroundColor: indexHover === index && "#2e2e2e"}}>
                    <p style={{fontFamily: "Inter", fontWeight: "600", fontSize: "12px"}}>{command.name.split(" ")[0]} <a style={{fontFamily: "Inter", fontWeight: "100", fontSize: "12px"}}>{command.name.split(" ")[1]} {command.name.split(" ")[2] ? command.name.split(" ")[2] : null}</a></p>
                    <p style={{fontFamily: "Inter", fontWeight: "100", color: "darkgray", fontSize: "11px"}}>{command.description}</p>
                </li>
            ))}

            

            

            
        </div>
        )
      }
  }

  return (
    <>
      <ul id='dropdowncommands-scroll' className={click ? 'dropdowncommands-menu clicked' : 'dropdowncommands-menu'}>

        <div style={{width: "99%"}} className="dropdowncommands-container">

            {getdropdowncommands()}

          </div>
      </ul>
    </>
  );
}

export default DropdownCommands;