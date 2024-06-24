import React, { useState, useEffect } from "react";
import "./Message.css";
import MessageChat from "./chat/MessageChat";
import Loader from "react-loader-spinner";
import { getUserByNameUser } from "../../services/backGo/user";
import {
  getChatsByUserID,
  sendMessage,
  getMessages,
} from "../../services/backGo/Chats"; // Asegúrate de importar getMessages

export default function Message({ socketMain, closeMessageChat }) {
  const [messagesOpen, setMessagesOpen] = useState([]); // Estado para almacenar los mensajes abiertos
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga durante la búsqueda
  const [message, setMessage] = useState(""); // Estado para el mensaje a enviar
  let userID = window.localStorage.getItem("_id");

  useEffect(() => {
    // Obtener token y _id del usuario desde el almacenamiento local
    let token = window.localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await getChatsByUserID(token);
        console.log(response);

        // Actualizar el estado de los mensajes abiertos con los datos obtenidos
        if (response) {
          const updatedMessagesOpen = response.map((chat) => ({
            openedWindow: true,
            user1: chat.User1ID,
            user2: chat.User2ID,
            usersInfo: chat.Users,
            messages: [], // Inicialmente vacío, se llenará con los mensajes
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
  }, []); // Se ejecuta solo una vez al montar el componente

  // Función para buscar usuarios por nombre
  async function searchUserByName(nameUser) {
    setLoading(true); // Activa el estado de carga

    try {
      const userData = await getUserByNameUser(nameUser); // Llama al servicio para obtener los datos del usuario
      setSelectedUser(userData.data); // Guarda el usuario encontrado en el estado
    } catch (error) {
      console.error("Error searching user:", error);
    } finally {
      setLoading(false); // Desactiva el estado de carga al finalizar la búsqueda
    }
  }

  // Función para enviar un mensaje al usuario seleccionado
  const handleSendMessage = async () => {
    if (!selectedUser || !message) {
      console.error("No user selected or message empty.");
      return;
    }

    try {
      let token = window.localStorage.getItem("token");
      let id = window.localStorage.getItem("_id");
      const response = await sendMessage(token, id, selectedUser.id, message);
      setMessage("");

      // Actualizar los mensajes para el chat seleccionado
      const updatedMessagesOpen = [...messagesOpen];
      const chatIndex = updatedMessagesOpen.findIndex(
        (chat) =>
          chat.user1 === selectedUser.id || chat.user2 === selectedUser.id
      );
      if (chatIndex !== -1) {
        const messages = await getMessages(token, selectedUser.id);
        updatedMessagesOpen[chatIndex].messages = messages || [];
        setMessagesOpen(updatedMessagesOpen);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="message-body">
      <div style={{ marginTop: "10px", marginLeft: "10px" }}>
        {/* Input para buscar usuarios por nombre */}
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
            <button
              onClick={() => {
                setSelectedUser(selectedUser);
              }}
            >
              Abrir Chat con {selectedUser.NameUser}
            </button>
          </div>
        )}
      </div>
      {/* Muestra todos los chats abiertos */}
      {messagesOpen.map((chat, index) => (
        <div>
          <h1>XD</h1>
          <MessageChat
            key={index}
            socketMain={socketMain}
            closeMessageChat={closeMessageChat}
            openedWindow={chat.openedWindow}
            index={index}
            to={chat.user1 === userID ? chat.user2 : chat.user1}
            selectedUser={selectedUser} // Pasa el usuario seleccionado como prop
            usersInfo={chat.usersInfo} // Pasa la información de los usuarios como prop
            messages={chat.messages} // Pasa los mensajes del chat como prop
          />
        </div>
      ))}
      {/* Input y botón para enviar mensaje */}
      <div style={{ marginTop: "20px", marginLeft: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
}
