import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import Messages from "./Messages";
import { useSelector } from 'react-redux'
import Input from "../../../channel/chat/Input";

import "./Chat.css";

let socket;

const Chat = () => {

  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  const token = useSelector(state => state.token)

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  let [users, setUsers] = useState([]);

  const ENDPOINT = "http://localhost:3002";
  // const ENDPOINT = "http://localhost:5000";



  /*useEffect(() => {
    const name = "asd123";
    const room = "asd123";

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, () => {});

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
    
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  useEffect(() => {
    socket.on("roomData", (user) => {
      users = [];
      user.users.forEach((el) => {
        users.push(el.name);
      });
      setUsers(users);
    });
  }, [message]);
*/
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="stream-page-wrapper">
        <title>Chat room: {room}</title>
      <div className="chat-wrapper">
        <div className="list-wrapper">
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px", fontFamily: "Montserrat"}}>
            <h4 style={{fontSize: "12px"}}>CHAT DE LA TRANSMICIÓN</h4>
            <i class="fas fa-users"></i>
          </div>


        </div>
        <hr style={{border: "1px solid #2b2b2b8f", margin: "10px auto"}}/>

        <div className="messages-wrapper">
          <Messages messages={messages} name={name} room={room} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;