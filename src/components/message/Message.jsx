import React, { useState, useEffect } from "react";
import "./Message.css";
import MessageChat from "./chat/MessageChat";
import Loader from "react-loader-spinner";
import { getUserByNameUser } from "../../services/backGo/user";
import {
  getChatsByUserID,
  sendMessage,
  getMessages,
} from "../../services/backGo/Chats";

export default function Message({ socketMain, closeMessageChat }) {
  const [messagesOpen, setMessagesOpen] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userID, setUserID] = useState("");

  useEffect(() => {
    let token = window.localStorage.getItem("token");
    let userID = window.localStorage.getItem("_id");
    setUserID(userID);

    const fetchData = async () => {
      try {
        const response = await getChatsByUserID(token);
        if (response) {
          const updatedMessagesOpen = response.map((chat) => ({
            chatID: chat.ID,
            openedWindow: false,
            user1: chat.User1ID,
            user2: chat.User2ID,
            usersInfo: chat.Users,
            messages: [],
          }));
          setMessagesOpen(updatedMessagesOpen);

          for (let chat of updatedMessagesOpen) {
            const messages = await getMessages(
              token,
              chat.user1 === userID ? chat.user2 : chat.user1
            );
            chat.messages = messages || [];
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchData();
  }, []);

  async function searchUserByName(nameUser) {
    setLoading(true);
    try {
      const userData = await getUserByNameUser(nameUser);
      setSelectedUser(userData.data);
    } catch (error) {
      console.error("Error searching user:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendMessage = async () => {
    try {
      let token = window.localStorage.getItem("token");
      let id = window.localStorage.getItem("_id");

      const response = await sendMessage(token, id, selectedUser.id, message);
      setMessage("");

      const fetchData = async () => {
        try {
          const response = await getChatsByUserID(token);
          if (response) {
            const updatedMessagesOpen = response.map((chat) => ({
              chatID: chat.ID,
              openedWindow: false,
              user1: chat.User1ID,
              user2: chat.User2ID,
              usersInfo: chat.Users,
              messages: [],
            }));
            setMessagesOpen(updatedMessagesOpen);

            for (let chat of updatedMessagesOpen) {
              const messages = await getMessages(
                token,
                chat.user1 === userID ? chat.user2 : chat.user1
              );
              chat.messages = messages || [];
            }
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      };

      fetchData();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="message-body">
      <div className="ContNewChat">
        <div className="message-bodysearch-input">
          <input
            type="text"
            // className="message-bodysearch-input"
            placeholder="Buscar usuario por nombre..."
            onChange={(e) => searchUserByName(e.target.value)}
          />
          {loading && (
            <Loader
              type="TailSpin"
              color="#ff60b2"
              height={20}
              width={20}
              className="loader"
            />
          )}
          {selectedUser && (
            <div className="user-info">
              <p> {selectedUser.FullName}</p>
              <button
                className="open-chat-button"
                onClick={() => setSelectedUser(selectedUser)}
              >
                Abrir Chat con {selectedUser.NameUser}
              </button>
            </div>
          )}
        </div>
        <div className="message-input-container">
          <input
            type="text"
            value={message}
            className="message-input"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <button className="send-button" onClick={handleSendMessage}>
            Enviar
          </button>
        </div>
      </div>
      {messagesOpen.map((chat, index) => (
        <div key={index}>
          <MessageChat
            socketMain={socketMain}
            closeMessageChat={closeMessageChat}
            openedWindow={chat.openedWindow}
            index={index}
            chatID={chat.chatID}
            to={chat.usersInfo.find((user) => user.ID !== userID)}
            usersInfo={chat.usersInfo}
            messages={chat.messages}
          />
        </div>
      ))}
    </div>
  );
}
