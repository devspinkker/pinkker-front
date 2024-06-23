import React, { useState, useEffect } from "react";
import "./Message.css";
import MessageChat from "./chat/MessageChat";
import Loader from "react-loader-spinner";
import { getUserByNameUser } from "../../services/backGo/user";
import { getMessages, sendMessage } from "../../services/backGo/Chats";

export default function Message({ socketMain, closeMessageChat }) {
  const [messagesOpen, setMessagesOpen] = useState([]); // Estado para almacenar los mensajes abiertos
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga durante la búsqueda
  const [message, setMessage] = useState(""); // Estado para el mensaje a enviar

  useEffect(() => {
    // Obtener token y _id del usuario desde el almacenamiento local
    let token = window.localStorage.getItem("token");
    let userID = window.localStorage.getItem("_id");

    const fetchData = async () => {
      try {
        const response = await getMessages(token, userID);
        console.log(response);

        // Actualizar el estado de los mensajes abiertos con los datos obtenidos
        if (response && response.data) {
          const updatedMessagesOpen = response.data.map((message) => ({
            openedWindow: true,
            streamer: message.streamer,
          }));
          setMessagesOpen(updatedMessagesOpen);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
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
      console.log(selectedUser.id);
      console.log(id);
      console.log(token);
      const response = await sendMessage(token, id, selectedUser.id, message);
      console.log("Message sent:", response);
      setMessage("");
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
      {messagesOpen?.map((message, index) => (
        <MessageChat
          key={index}
          socketMain={socketMain}
          closeMessageChat={closeMessageChat}
          openedWindow={message.openedWindow}
          index={index}
          to={message.streamer}
          selectedUser={selectedUser} // Pasa el usuario seleccionado como prop
        />
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
