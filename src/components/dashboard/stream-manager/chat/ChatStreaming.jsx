import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatStreaming.css";
export function ChatStreaming({ OnechatId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const connectWebSocket = () => {
      const newSocket = new WebSocket(
        `ws://localhost:8080/ws/chatStreaming/${OnechatId}/bruno2`
      );

      newSocket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        newSocket.send("onmessage");

        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
        newSocket.send("closing");
      };

      newSocket.onopen = () => {
        console.log("WebSocket connection opened");
        const newMessage = {
          message: message,
          userId: "randomString",
        };
        if (newMessage.message === "") newMessage.message = "presentación";
        newSocket.send(JSON.stringify(newMessage));
      };
      setSocket(newSocket);
    };
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("Establecer la conexión WebSocket");
      connectWebSocket();
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = async () => {
    let token = window.localStorage.getItem("token");
    if (!token) {
      alert("no logueado");
      return;
    }
    try {
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `http://localhost:8080/chatStreaming/${OnechatId}`,
        { message },
        config
      );

      setMessage("");
    } catch (error) {
      setMessage("");

      console.log(error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="ChatStreaming">
      <div className="Conversation">
        {messages.map((message, index) => (
          <div key={index} className="Message">
            <div className="MessagesChat">
              <div className="imgs">
                {message.EmotesChat.Moderator && (
                  <img src={message.EmotesChat.Moderator} alt="" />
                )}
                {message.EmotesChat.Verified && (
                  <img src={message.EmotesChat.Verified} alt="" />
                )}
                {message.EmotesChat.Vip && (
                  <img src={message.EmotesChat.Vip} alt="" />
                )}
              </div>
              <div className="content-info-message">
                <div className="content-info-message-2">
                  <p style={{ color: message.Color, margin: "10px" }}>
                    {message.nameUser}:
                  </p>

                  <span style={{ color: message.Color }}>
                    {message.message}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form className="ChatStreaming_form" onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={handleChange} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
