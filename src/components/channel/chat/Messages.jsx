import React, {useState} from "react";

import Message from "./Message";
import "./Messages.css";

import UserInfo from "../../userinfo/UserInfo";

import { useSelector } from "react-redux";


const Messages = ({ isScrolled, setIsScrolled, isMobile, replyToUser, viewChat, chatOff, announce, chatData, userMod, userBan, colorUser, textSize, messages, name, room, lookImage, emotes, handleSendMessage }) => {

  const user = useSelector(state => state.user);
  const token = useSelector(state => state.token)

  const [isHover, setIsHover] = useState(false);
  const [messagesInScrolled, setMessagesInScrolled] = useState(0);

  const [userInfoDiv, setUserInfoDiv] = useState(false);
  const [streamerInfo, setStreamerInfo] = useState(false);
  


  const handleScroll = (e) => {
    var elem = document.getElementById('chat-message-data');
    console.log(elem.scrollTop);

    if(elem.scrollTop < 28) {
      setMessagesInScrolled(messages.length);
      console.log("True pa")
      setIsScrolled(true);
    } else {
      setMessagesInScrolled(0);
      setIsScrolled(false);
    }

  }
  function scrollLastElement() {
    var elem = document.getElementById('chat-message-data');
    elem.scrollTop = elem.scrollHeight - 50;    
  }

  function getUserInfo(streamer) {
    setUserInfoDiv(true);
    setStreamerInfo(streamer);
  }


  function getType() {
    if(userBan === true) {
      return (
        <div>
          <div style={{height: "660px"}} id="chat-message-data" onScroll={(e) => handleScroll(e)} className="messages">
            
            <div className="chat-message-ban">
              <div style={{textAlign: "center"}}>
                <i style={{fontSize: "34px", marginBottom: "10px"}} class="fas fa-exclamation-circle"/>
                <h3>Te han vetado en el chat.</h3>
                <p style={{fontSize: "14px"}}>No podrás participar en el chat de este canal hasta que un moderador anule tu veto.Este canal permite a los usuarios vetados solicitar una anulación tras una espera de 15 minutos.</p>
              </div>
            </div>
    
          </div>
        </div>
      );
    } 

    if(chatOff === true) {
      return (
        <div>
          <div id="chat-message-data" onScroll={(e) => handleScroll(e)} className="messages">
            
            <div className="chat-message-ban">
              <div style={{textAlign: "center"}}>
                <i style={{fontSize: "34px", marginBottom: "10px"}} class="fas fa-exclamation-circle"/>
                <h3>Has ocultado el chat.</h3>
                <button className="chat-button-view-chat" onClick={() => viewChat()}>Ver chat</button>
              </div>
            </div>
    
          </div>
        </div>
      );
    }

    function getHeightMain() {
      if(isMobile === true) {
       return announce ? "215px" : "375px"
      } 

      return announce ? "500px" : "690px"
    }


    return (
      <div>
        <div style={{height: getHeightMain()}} id="chat-message-data" onScroll={(e) => handleScroll(e)} className="messages">

          {userInfoDiv && <UserInfo userMod={userMod} close={() => setUserInfoDiv(false)} streamer={streamerInfo} handleSendMessage={(e) => handleSendMessage(e)} /> }
          
          {messages.map((message, i) => (
            <div key={i}>
              
              <Message replyToUser={(e) => replyToUser(e)} emotes={emotes} colorUser={message.color} handleClickUser={(streamer) => getUserInfo(streamer)} chatData={chatData} userMod={userMod} textSize={textSize} message={message} name={name} room={room} lookImage={message.lookImage} />
            </div>
          ))}
        </div>
  
          {isScrolled && <div onClick={() => scrollLastElement()} onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className="chat-new-messages">
            {isHover === false && <h3>Ver mensajes nuevos</h3>}
            {isHover === true && <h3><i style={{marginRight: "5px"}} class="fas fa-arrow-down"/> {messages.length - messagesInScrolled} mensajes nuevos</h3>}
          </div>}
  
      </div>
      
    );
  }

 

  return (getType());
};

export default Messages;