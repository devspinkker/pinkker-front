import React from "react";
import "./ChatSettings.css"; // Asegúrate de tener estilos para este componente
import { UpdateUserStatus } from "../../../services/backGo/Chats";

const ChatSettings = ({ to, chatID, activeTab }) => {
  const token = window.localStorage.getItem("token");
  const id = window.localStorage.getItem("_id");

  const handleUpdateStatus = (status) => {
    UpdateUserStatus(token, status, chatID)
      .then((response) => {
        console.log("Estado actualizado:", response);
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
      });
  };

  const handleBlockUser = () => {
    console.log("Usuario bloqueado");
  };

  const handleDeleteUser = () => {
    console.log("Usuario eliminado");
  };

  return (
    <div className="chat-settings-container">
      <div className="chat-settings">
        <h2>Configuración del Chat</h2>

        {/* Información del usuario */}
        <div className="user-info">
          <img src={to.Avatar} alt="Avatar" className="avatar" />
          <p>
            <strong>{to.NameUser}</strong>
          </p>
        </div>

        <div className="settings-options">
          {activeTab !== "primary" && (
            <button
              className="settings-option"
              onClick={() => handleUpdateStatus("primary")}
            >
              Mover a Bandeja Primaria
            </button>
          )}
          {activeTab !== "secondary" && (
            <button
              className="settings-option"
              onClick={() => handleUpdateStatus("secondary")}
            >
              Mover a Bandeja Secundaria
            </button>
          )}
          <button className="settings-option danger" onClick={handleBlockUser}>
            Bloquear Usuario
          </button>

          <button className="settings-option danger" onClick={handleDeleteUser}>
            Eliminar Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
