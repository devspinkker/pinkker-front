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
  const [userID, setUserID] = useState(""); // Nuevo estado para almacenar el ID del usuario actual

  useEffect(() => {
    // Obtener token y _id del usuario desde el almacenamiento local
    let token = window.localStorage.getItem("token");
    let userID = window.localStorage.getItem("_id");
    setUserID(userID); // Guardar el ID del usuario actual en el estado

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
          console.log(updatedMessagesOpen);
          setMessagesOpen(updatedMessagesOpen);

          // Cargar los mensajes para cada chat
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
  }, []); // Se ejecuta solo una vez al montar el componente

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
            console.log(updatedMessagesOpen);
            setMessagesOpen(updatedMessagesOpen);

            // Cargar los mensajes para cada chat
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

      // Llamar a fetchData para actualizar los chats después de enviar el mensaje
      fetchData();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="message-body">
      <div style={{ marginTop: "10px", marginLeft: "10px" }}>
        <input
          type="text"
          placeholder="Buscar usuario por nombre..."
          onChange={(e) => searchUserByName(e.target.value)}
        />
        {loading && (
          <Loader
            type="TailSpin"
            color="#ff60b2"
            height={20}
            width={20}
            style={{ marginLeft: "10px" }}
          />
        )}
        {selectedUser && (
          <div style={{ marginTop: "5px" }}>
            <p>Usuario encontrado: {selectedUser.FullName}</p>
            <button onClick={() => setSelectedUser(selectedUser)}>
              Abrir Chat con {selectedUser.NameUser}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", marginLeft: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
      {messagesOpen.map((chat, index) => (
        <div>
          {console.log(chat)}
          <MessageChat
            key={index}
            socketMain={socketMain}
            closeMessageChat={closeMessageChat}
            openedWindow={chat.openedWindow}
            index={index}
            chatID={chat.chatID} // Pasamos el ID del chat como prop
            to={chat.usersInfo.find((user) => user.ID !== userID)} // Seleccionamos el usuario destinatario correcto
            usersInfo={chat.usersInfo}
            messages={chat.messages}
          />
        </div>
      ))}
    </div>
  );
}
