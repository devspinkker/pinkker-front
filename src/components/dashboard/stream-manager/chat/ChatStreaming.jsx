import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatStreaming.css";
export function ChatStreaming({ OnechatId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const conversationRef = useRef(null);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const connectWebSocket = () => {
      const token = window.localStorage.getItem("token");
      const newSocket = new WebSocket(
        `wss://pinkker-chat-czpr.4.us-1.fl0.io/ws/chatStreaming/${OnechatId}/${token}`
      );
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      newSocket.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        newSocket.send("onmessage");
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        scrollToBottom();
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
        console.log("closed");
        newSocket.send("closing");
      };

      newSocket.onopen = () => {
        console.log("WebSocket connection opened");
      };
      setSocket(newSocket);

      window.addEventListener("beforeunload", () => {
        console.log("closed");
        newSocket.send("closing");
        newSocket.close();
      });
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
  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = async () => {
    try {
      const token = window.localStorage.getItem("token");
      if (!token) {
        alert("no logueado");
        return;
      }
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(config);
      const res = await axios.post(
        `https://pinkker-chat-czpr.4.us-1.fl0.io/chatStreaming/${OnechatId}`,
        { message },
        config
      );

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="ChatStreaming">
      <div className="Conversation" ref={conversationRef}>
        {messages.map((message, index) => (
          <div key={index} className="Message">
            <div className="MessagesChat">
              <div className="badges">
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
                  <p
                    className="content-info-message-2-nameUser"
                    style={{
                      color: message.Color,
                    }}
                  >
                    {message.nameUser}:
                    <span style={{ color: "#ffff" }}>
                      {" " + message.message}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form className="ChatStreaming_form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          placeholder="Enviar un mensaje"
          onChange={handleChange}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
