// ChatSettings.js
import React from "react";
import "./ChatSettings.css"; // Asegúrate de tener estilos para este componente
import { UpdateUserStatus } from "../../../services/backGo/Chats";

const ChatSettings = ({ to, chatID }) => {
  const token = window.localStorage.getItem("token");

  const handleUpdateStatus = (status) => {
    // Llama a la función UpdateUserStatus con el token, chatID y el nuevo estado
    UpdateUserStatus(token, status, chatID)
      .then((response) => {
        console.log("Estado actualizado:", response);
        // Aquí puedes manejar el éxito, como mostrar un mensaje o actualizar el estado
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
        // Maneja el error según sea necesario
      });
  };

  return (
    <div className="chat-settings">
      <h2>Configuración del Chat</h2>
      <div>
        <label>
          Notificaciones:
          <input type="checkbox" />
        </label>
      </div>
      <div>
        <label>
          Tema:
          <select>
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </label>
      </div>
      {/* Opciones para actualizar el estado del usuario */}
      <div>
        <h3>Actualizar Estado del Usuario</h3>
        <button onClick={() => handleUpdateStatus("primary")}>
          Establecer como Primary
        </button>
        <button onClick={() => handleUpdateStatus("secondary")}>
          Establecer como Secondary
        </button>
      </div>
      {/* Agrega más configuraciones según sea necesario */}
    </div>
  );
};

export default ChatSettings;
