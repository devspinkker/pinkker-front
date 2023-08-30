import React, {useState, useEffect} from 'react';

import "./MessageChat.css";

import { sendMessage, getMessages } from '../../../services/messages';

import { useSelector } from 'react-redux';

import Loader from "react-loader-spinner";

export default function MessageChat({socketMain, closeMessageChat, openedWindow, changeOpenedWindow, index, to}) {


    const auth = useSelector(state => state.auth)
    const {user, isLogged} = auth
    const token = useSelector(state => state.token)

    const [message, setMessage] = useState(null);
    const [messages, setMessages] = useState(null);

    const [opened, setOpened] = useState(openedWindow === false ? index === 0 ? true : false : false);

    const [previusDay, setPreviusDay] = useState([]);

    const [openWindow, setOpenWindow] = useState(openedWindow)

    let messageData = []
    var messageDataHistory = []


    useEffect(() => {
        socketMain.on("message", (message) => {
    
            messageData = [...messageData, message]
            messageDataHistory = [...messageDataHistory, message]

            if(opened === false && message.to === user.name) {
                setOpenWindow(true)
            }
        
            setMessages(messageData);

        });
      }, []);



      function scrollLastElement() {
        var elem = document.getElementById('messagechat-messages');
        elem.scrollTop = elem.scrollHeight - 50;    
      }


    useEffect(() => {
        if(opened === true) {
            const fetchData = async () => {
                const data = await getMessages(token, to);
                if(data != null && data != undefined) {
                    setMessages(data);
                    messageData = data;
                    messageDataHistory = data;
                }
            }
            fetchData();
        }
    }, [token, opened])


    const reloadData = async () => {
        const data = await getMessages(token, to);
        if(data != null && data != undefined) {
            setMessages(data);
        }
    }

    async function handleSendMessage() {
        //scrollLastElement();
        socketMain.emit("sendMessage", message, user.avatar, to, () => setMessage(""));
        await sendMessage(token, to, message);
        //reloadData();
        setMessage("");
    }

    const onKeyPressInput = (e) => {
        if(e.key === "Enter") {
          handleSendMessage();
        }
    }

    function formatHour(dateString) {
        const date = new Date(dateString);

        const hour = date.getHours();
        const minutes = date.getMinutes();

        if(minutes < 10) {
            return `${hour}:0${minutes}`;
        } else {
            return `${hour}:${minutes}`;
        }

    }

    function handleOpened() {
        setOpened(true);
        setOpenWindow(false)
        //changeOpenedWindow();
    }
    

    function getType() {
        if(opened) {
            return (
                <div className='messagechat-opened'>
                    <div onClick={() => setOpened(false)} className='messagechat-opened-close'>
                        <h5 style={{color: "#ededed", marginLeft:" 10px"}}>{to}</h5>
                        <i onClick={() => closeMessageChat(to)} style={{marginRight: "10px", cursor: "pointer", color: "#ededed", padding: "7px", borderRadius: "3px"}} class="fas fa-times gray-button"/>
                    </div>

                    

                    <div id='messagechat-messages' className='messagechat-opened-messages'>
                        {messages != null ? messages.map((message, index) => {
                            return (
                                <div>
                                    {index === 0 && <div className='messagechat-date'>
                                        <h3 style={{color: "white", fontSize: "11px", backgroundColor: "rgba(27, 27, 27, 0.366)", padding: "3px", width: "50px", borderRadius: "3px", margin: "0 auto", marginTop: "3px"}}>hoy</h3>
                                    </div>}

                                    <div style={{justifyContent: message.name === user.name && "right", color: "#ededed"}} className='general-chat-selected-message'>
                                        {message.name != user.name && 
                                        <div style={{width: "45px", position: "relative", left: "10px", marginRight: "5px"}} className='navbar-image-avatar-container'>
                                            <div style={{backgroundColor: "transparent"}} className='navbar-image-avatar'>
                                            <img src={message.avatar} alt="" />
                                            </div>
                                        </div>}
                                        <div style={{backgroundColor: message.name === user.name ? "#005246" : "#363638", display: "flex", marginLeft: "5px"}} className='general-chat-selected-message-message'>
                                            <p>{message.message}</p>
                                            <p className='messagechat-time'>{formatHour(message.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) :
                        
                        <div style={{ minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Loader  type="TailSpin" color="#ff60b2" height={30} width={30} timeout={3000} />
                        </div>
                        }
                    </div>

                    <div className='messagechat-opened-input'>
                        <input id='chat-input' 
                            type="text" 
                            value={message}
                            className="message-chat-send-input" 
                            placeholder="Enviar un mensaje" 
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(event) => onKeyPressInput(event)}
                            autoComplete="off"
                        />
                        <button style={{marginRight: "3px"}} className="config-button"><i class="fas fa-laugh"/></button>
                    </div>
                </div>
            )
        } else {
            return (
                <div onClick={() => handleOpened()} className={'messagechat-closed'}>
                    <h5 style={{color: "#ededed", marginLeft:" 10px"}}>{to}</h5>
                    <i onClick={() => closeMessageChat(to)} style={{marginRight: "10px", cursor: "pointer", color: "#ededed", padding: "7px", borderRadius: "3px"}} class="fas fa-times gray-button"/>
                </div>
            )
        } 
    }


    return (
        <div style={{height: opened ? "500px" : "35px", width: opened ? "300px" : "200px"}} className={openWindow === true ? "message-chat-body-window" : "message-chat-body"}>
            {getType()}
        </div>
    )
}